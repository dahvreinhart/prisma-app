import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { DB_URL } from '../../src/app.environment';
import { Connection } from 'mongoose';
import { BlogModule } from '../../src/blog/blog.module';
import { PostModule } from '../../src/post/post.module';
import { DUPLICATE_BLOG_SLUG_ERROR } from '../../src/common/errors';

describe('BlogController (e2e)', () => {
    let app: INestApplication;
    let moduleFixture: TestingModule;
    let db: Connection;

    const BASE_TEST_ROUTE = '/blogs';

    beforeEach(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [BlogModule, PostModule, MongooseModule.forRoot(DB_URL)],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        db = app.get(getConnectionToken());
        await db.collections.blogs.deleteMany({});
    });

    afterEach(async () => {
        await db.collections.blogs.deleteMany({});
    });

    afterAll(async () => {
        await app.close();
        await moduleFixture.close();
        await db.close();
    });

    describe('POST /blogs | Create a new blog', () => {
        it("should succeed and return a newly created blog with no attached posts", async () => {
            const creationData = { name: 'Test Blog Name', slug: 'Test Blog Slug' };

            const response = await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send(creationData);

            expect(response.status).toEqual(201);
            expect(response.body.uuid).toEqual(expect.any(String));
            expect(response.body.name).toEqual(creationData.name);
            expect(response.body.slug).toEqual(creationData.slug);
            expect(response.body.posts).toEqual([]);
            expect(new Date(response.body.createdAt)).toEqual(expect.any(Date));
            expect(new Date(response.body.updatedAt)).toEqual(expect.any(Date));
        });

        it("should succeed and return a newly created blog with a single attached post", async () => {
            const creationData = {
                name: 'Test Blog Name',
                slug: 'Test Blog Slug',
                posts: [
                    { title: 'Test Post Title', content: 'Test Post Content' },
                ],
            };

            const response = await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send(creationData);

            expect(response.status).toEqual(201);
            expect(response.body.uuid).toEqual(expect.any(String));
            expect(response.body.name).toEqual(creationData.name);
            expect(response.body.slug).toEqual(creationData.slug);
            expect(new Date(response.body.createdAt)).toEqual(expect.any(Date));
            expect(new Date(response.body.updatedAt)).toEqual(expect.any(Date));
            
            expect(response.body.posts).toHaveLength(1);
            expect(response.body.posts[0].uuid).toEqual(expect.any(String));
            expect(response.body.posts[0].title).toEqual(creationData.posts[0].title);
            expect(response.body.posts[0].content).toEqual(creationData.posts[0].content);
            expect(response.body.posts[0].viewCount).toEqual(0);
            expect(new Date(response.body.posts[0].createdAt)).toEqual(expect.any(Date));
            expect(new Date(response.body.posts[0].updatedAt)).toEqual(expect.any(Date));
        });

        it("should succeed and return a newly created blog with many attached posts", async () => {
            const creationData = {
                name: 'Test Blog Name',
                slug: 'Test Blog Slug',
                posts: [
                    { title: 'Test Post Title1', content: 'Test Post Content1' },
                    { title: 'Test Post Title2', content: 'Test Post Content2' },
                    { title: 'Test Post Title3', content: 'Test Post Content3' },
                ],
            };

            const response = await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send(creationData);

            expect(response.status).toEqual(201);
            expect(response.body.uuid).toEqual(expect.any(String));
            expect(response.body.name).toEqual(creationData.name);
            expect(response.body.slug).toEqual(creationData.slug);
            expect(new Date(response.body.createdAt)).toEqual(expect.any(Date));
            expect(new Date(response.body.updatedAt)).toEqual(expect.any(Date));
            
            expect(response.body.posts).toHaveLength(3);
            for (let i = 0; i < response.body.posts.length; i++) {
                expect(response.body.posts[i].uuid).toEqual(expect.any(String));
                expect(response.body.posts[i].title).toEqual(creationData.posts[i].title);
                expect(response.body.posts[i].content).toEqual(creationData.posts[i].content);
                expect(response.body.posts[i].viewCount).toEqual(0);
                expect(new Date(response.body.posts[i].createdAt)).toEqual(expect.any(Date));
                expect(new Date(response.body.posts[i].updatedAt)).toEqual(expect.any(Date));
            }
        });

        it("should fail and return an error when a slug duplicate is encountered", async () => {
            const creationData = { name: 'Test Blog Name', slug: 'Test Blog Slug' };

            const response = await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send(creationData);

            expect(response.status).toEqual(201);

            const errorResponse = await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send(creationData);

            expect(errorResponse.status).toEqual(400);
            expect(JSON.parse(errorResponse.text).message).toContain(DUPLICATE_BLOG_SLUG_ERROR);
        });

        it("should fail and return an error when an invalid name is given", async () => {
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ slug: 'Test Slug' })).status).toEqual(400);
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ name: null, slug: 'Test Slug' })).status).toEqual(400);
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ name: undefined, slug: 'Test Slug' })).status).toEqual(400);
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ name: '', slug: 'Test Slug' })).status).toEqual(400);
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ name: 123, slug: 'Test Slug' })).status).toEqual(400);
        });

        it("should fail and return an error when an invalid slug is given", async () => {
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ name: 'Test Name' })).status).toEqual(400);
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ name: 'Test Name', slug: null })).status).toEqual(400);
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ name: 'Test Name', slug: undefined })).status).toEqual(400);
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ name: 'Test Name', slug: '' })).status).toEqual(400);
            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send({ name: 'Test Name', slug: 123 })).status).toEqual(400);
        });

        it("should fail and return an error when an attached post is missing required data", async () => {
            const creationData = {
                name: 'Test Blog Name',
                slug: 'Test Blog Slug',
                posts: [
                    { title: 'Test Post Title' },
                ],
            };

            expect((await request(app.getHttpServer()).post(BASE_TEST_ROUTE).send(creationData)).status).toEqual(400);
        });
    })
});
