import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_URL } from '../app.environment';
import { Post, PostSchema } from '../post/post.schema';
import { Blog, BlogSchema } from './blog.schema';
import { PostModule } from '../post/post.module';

describe('BlogService', () => {
    let service: BlogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<BlogService>(BlogService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
