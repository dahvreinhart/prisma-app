import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PostModule } from '../post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { Post, PostSchema } from '../post/post.schema';
import { DB_URL } from '../app.environment';

describe('BlogController', () => {
    let controller: BlogController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BlogController],
            providers: [BlogService],
            imports: [
                PostModule,
                MongooseModule.forRoot(DB_URL),
                MongooseModule.forFeature([
                    { name: Blog.name, schema: BlogSchema },
                    { name: Post.name, schema: PostSchema },
                ]),
            ],
        }).compile();

        controller = module.get<BlogController>(BlogController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
