import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Blog } from './blog.schema';
import mongoose, { Model } from 'mongoose';
import { CreateBlogDto, GetBlogDto } from './blog.dto';
import { BLOG_NOT_FOUND_ERROR, DUPLICATE_BLOG_SLUG_ERROR, INVALID_BLOG_QUERY_ERROR } from '../common/errors';
import { PostService } from '../post/post.service';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
        @InjectConnection() private readonly dbConnection: mongoose.Connection,
        private postService: PostService,
    ) {}

    /**
     * Create a new blog object with an optional number of post objects
     *
     * @param blogCreationData
     * @returns
     */
    public async createBlog(blogCreationData: CreateBlogDto): Promise<Blog> {
        // Should we autogenerate the slug for the user if they havent passed in one?
        const slugDuplicates = await this.blogModel.countDocuments({ slug: blogCreationData.slug });
        if (slugDuplicates) throw new HttpException(`${DUPLICATE_BLOG_SLUG_ERROR}: ${blogCreationData.slug}`, HttpStatus.BAD_REQUEST);

        const dbSession = await this.dbConnection.startSession();
        return dbSession.withTransaction(async (session) => {
            const newBlog = new this.blogModel({ name: blogCreationData.name, slug: blogCreationData.slug });

            // Create any post objects specified and attach them simultaneously
            if (blogCreationData.posts && blogCreationData.posts.length) {
                newBlog.posts = await this.postService.createPostsForBlog(blogCreationData.posts, session, true);
            }

            const newBlogObj = await newBlog.save({ session });

            return this.sanitizeBlogData(newBlogObj);
        });
    }

    /**
     * Fetch a specified blog object.
     * Inclusion of associated post objects is optional.
     *
     * @param blogQueryData
     * @returns
     */
    public async getBlog(blogQueryData: GetBlogDto): Promise<Blog> {
        const blogFilter: mongoose.FilterQuery<Blog> = {};
        if (blogQueryData.uuid) blogFilter.uuid = blogQueryData.uuid;
        if (blogQueryData.slug) blogFilter.slug = blogQueryData.slug;

        if (!Object.keys(blogFilter).length) throw new HttpException(`${INVALID_BLOG_QUERY_ERROR}: ${JSON.stringify(blogQueryData)}`, HttpStatus.BAD_REQUEST);

        const fetchedBlog = await this.blogModel.findOne(blogFilter).populate(blogQueryData.includePosts ? 'posts' : null);

        if (!fetchedBlog) throw new HttpException(`${BLOG_NOT_FOUND_ERROR}: ${JSON.stringify(blogQueryData)}`, HttpStatus.NOT_FOUND);
        
        // Should we increment view count of returned posts if included?
        return this.sanitizeBlogData(fetchedBlog, blogQueryData.includePosts);
    }

    /**
     * Small helper method to censor and control which blog data is returned to the client.
     *
     * @param rawBlog
     * @param includePosts
     * @returns
     */
    private sanitizeBlogData(rawBlog: Blog, includePosts = true): Blog {
        return {
            uuid: rawBlog.uuid,
            name: rawBlog.name,
            slug: rawBlog.slug,
            createdAt: rawBlog.createdAt,
            updatedAt: rawBlog.updatedAt,
            posts: ((includePosts && rawBlog.posts) || []).map((post) => this.postService.sanitizePostData(post)),
        };
    }
}
