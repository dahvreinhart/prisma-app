import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Post } from './post.schema';
import mongoose, { ClientSession, Model } from 'mongoose';
import { Blog } from '../blog/blog.schema';
import { CreatePostBaseDto, CreatePostToAttachDto } from './post.dto';
import { BLOG_NOT_FOUND_ERROR, MISSING_POST_CONTENT_ERROR } from '../common/errors';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
        @InjectConnection() private readonly dbConnection: mongoose.Connection,
    ) {}

    /**
     * Create a new standalone post and attach it to a specified blog.
     *
     * @param postCreationData
     * @returns
     */
    public async createAndAttachPost(postCreationData: CreatePostToAttachDto): Promise<Post> {
        const parentBlog = await this.blogModel.findOne({ uuid: postCreationData.blogUuid });
        if (!parentBlog) throw new HttpException(`${BLOG_NOT_FOUND_ERROR}: ${postCreationData.blogUuid}`, HttpStatus.NOT_FOUND);

        const dbSession = await this.dbConnection.startSession();
        return dbSession.withTransaction(async (session) => {
            const newPostModel = new this.postModel({ title: postCreationData.title, content: postCreationData.content });
            const newPost = await newPostModel.save({ session });

            // Attach the new post to its associated blog object
            parentBlog.posts.push(newPost);
            await parentBlog.save({ session });

            return this.sanitizePostData(newPost);
        });
    }

    /**
     * Bulk create a number of post objects.
     *
     * @param postCreationData
     * @param session
     * @returns
     */
    public async createPostsForBlog(postCreationData: CreatePostBaseDto[], session: ClientSession, returnRaw = false): Promise<Post[]> {
        const postsToSave = [];
        for (const postToCreate of postCreationData) {
            postsToSave.push(new this.postModel({ title: postToCreate.title, content: postToCreate.content }));
        }

        const newPosts = await this.postModel.insertMany<Post[]>(postsToSave, { session });

        return returnRaw ? newPosts : newPosts.map((post) => this.sanitizePostData(post));
    }

    /**
     * Small helper method to control and censor which post data is returned to the client.
     *
     * @param rawPost
     * @returns
     */
    public sanitizePostData(rawPost: Post): Post {
        return {
            uuid: rawPost.uuid,
            title: rawPost.title,
            content: rawPost.content,
            viewCount: rawPost.viewCount,
            createdAt: rawPost.createdAt,
            updatedAt: rawPost.updatedAt,
        };
    }
}
