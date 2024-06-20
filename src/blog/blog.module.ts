import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { Post, PostSchema } from '../post/post.schema';
import { PostModule } from '../post/post.module';

@Module({
    imports: [
        PostModule,
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Post.name, schema: PostSchema },
        ]),
    ],
    controllers: [BlogController],
    providers: [BlogService],
})
export class BlogModule {}
