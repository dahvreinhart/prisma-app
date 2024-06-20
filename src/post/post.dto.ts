import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * Base creation data DTO definition for posts.
 */
export class CreatePostBaseDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    title?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    content: string;
}

/**
 * Creation data DTO definition for posts being created and attached to existing blogs.
 */
export class CreatePostToAttachDto extends CreatePostBaseDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    blogUuid: string;
}
