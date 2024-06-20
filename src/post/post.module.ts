import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { Blog, BlogSchema } from '../blog/blog.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Blog.name, schema: BlogSchema },
        ]),
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
