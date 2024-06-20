import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Blog } from './blog.schema';
import { BasicValidationOptions } from '../app.config';
import { CreateBlogDto, GetBlogDto } from './blog.dto';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogController {
    constructor(private blogService: BlogService) {}

    /**
     * Create a new blog.
     *
     * @param blogCreationData
     * @returns
     */
    @Post()
    @ApiOperation({ summary: 'Create new blog', description: 'Create a new blog and persist it in the database.' })
    @ApiResponse({ status: 201, description: 'Successfully created a new blog.', type: Blog })
    @ApiResponse({ status: 400, description: 'Creation data validation error.' })
    async createBlog(@Body(new ValidationPipe(BasicValidationOptions)) blogCreationData: CreateBlogDto): Promise<Blog> {
        return this.blogService.createBlog(blogCreationData);
    }

    /**
     * Fetch a single blog.
     *
     * @param blogQueryData
     * @returns
     */
    @Get()
    @ApiOperation({ summary: 'Fetch a single blog object', description: 'Fetch a blog.' })
    @ApiResponse({ status: 200, description: 'Successfully fetched a blog.', type: Blog })
    @ApiResponse({ status: 400, description: 'Query param validation error.' })
    @ApiResponse({ status: 404, description: 'No blog object matching specified filter.' })
    async getBlog(@Query(new ValidationPipe(BasicValidationOptions)) blogQueryData: GetBlogDto): Promise<Blog> {
        return this.blogService.getBlog(blogQueryData);
    }
}
