import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { Blog, BlogSchema } from '../blog/blog.schema';
import { DB_URL } from '../app.environment';

describe('PostService', () => {
    let service: PostService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PostService],
            imports: [
                MongooseModule.forRoot(DB_URL),
                MongooseModule.forFeature([
                    { name: Post.name, schema: PostSchema },
                    { name: Blog.name, schema: BlogSchema },
                ]),
            ],
        }).compile();

        service = module.get<PostService>(PostService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
