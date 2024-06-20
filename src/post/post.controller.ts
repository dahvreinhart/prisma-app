import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { Post as BlogPost } from './post.schema';
import { BasicValidationOptions } from '../app.config';
import { CreatePostToAttachDto } from './post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    /**
     * Create a new post and attach it to an existing blog.
     *
     * @param postCreationData
     * @returns
     */
    @Post()
    @ApiOperation({ summary: 'Create new post', description: 'Create a new post and attach it to a blog.' })
    @ApiResponse({ status: 201, description: 'Successfully created a new post and attaced it to the specified blog.', type: BlogPost })
    @ApiResponse({ status: 400, description: 'Creation data validation error.' })
    @ApiResponse({ status: 404, description: 'Specified blog to attach to could not be found.' })
    async createAndAttachPost(@Body(new ValidationPipe(BasicValidationOptions)) postCreationData: CreatePostToAttachDto): Promise<BlogPost> {
        return this.postService.createAndAttachPost(postCreationData);
    }
}
