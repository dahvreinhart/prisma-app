import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

/**
 * DB Definition of a post object.
 */
@Schema({ timestamps: true })
export class Post {
    /**
     * The unique identifier of the post.
     */
    @ApiProperty()
    @Prop({
        required: true,
        default: () => randomUUID(),
    })
    uuid: string;

    /**
     * The title of the post.
     */
    @ApiProperty()
    @Prop({
        required: true,
        default: 'Untitled',
    })
    title: string;

    /**
     * The content of the post.
     */
    @ApiProperty()
    @Prop({
        required: true,
    })
    content: string;

    /**
     * The title of the post.
     */
    @ApiProperty()
    @Prop({
        required: true,
        default: 0,
    })
    viewCount: number;

    // Timestamps specified here explicitly only for proper typing

    /**
     * The creation date of the post.
     */
    @ApiProperty()
    createdAt: Date;

    /**
     * The date when the post was last updated.
     */
    @ApiProperty()
    updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
