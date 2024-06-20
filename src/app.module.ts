import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { BlogModule } from './blog/blog.module';
import { PostModule } from './post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_URL } from './app.environment';

@Module({
    imports: [BlogModule, PostModule, MongooseModule.forRoot(DB_URL)],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
