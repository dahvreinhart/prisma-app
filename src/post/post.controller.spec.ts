import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { Blog, BlogSchema } from '../blog/blog.schema';
import { DB_URL } from '../app.environment';

describe('PostController', () => {
    let controller: PostController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostController],
            providers: [PostService],
            imports: [
                MongooseModule.forRoot(DB_URL),
                MongooseModule.forFeature([
                    { name: Post.name, schema: PostSchema },
                    { name: Blog.name, schema: BlogSchema },
                ]),
            ],
        }).compile();

        controller = module.get<PostController>(PostController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
