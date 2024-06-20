import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreatePostBaseDto } from '../post/post.dto';

/**
 * Creation data DTO definition for blogs.
 */
export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    slug: string;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(1000)
    @ValidateNested({ each: true })
    @Type(() => CreatePostBaseDto)
    @ApiProperty({ type: [CreatePostBaseDto], required: false })
    posts?: CreatePostBaseDto[];
}

/**
 * Fetch options DTO definition for blogs.
 */
export class GetBlogDto {
    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    uuid?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    slug?: string;

    @IsOptional()
    @Transform(({ value }) => ['true', '1'].includes(value))
    @IsBoolean()
    @ApiProperty({ required: false })
    includePosts?: boolean = false;
}
