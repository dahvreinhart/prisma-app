import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { Post } from '../post/post.schema';

/**
 * DB Definition of a blog object.
 */
@Schema({ timestamps: true })
export class Blog {
    /**
     * The unique identifier of the blog.
     */
    @ApiProperty()
    @Prop({
        required: true,
        default: () => randomUUID(),
    })
    uuid: string;

    /**
     * The name of the blog.
     */
    @ApiProperty()
    @Prop({
        required: true,
    })
    name: string;

    /**
     * The unique slug of the blog.
     */
    @ApiProperty()
    @Prop({
        required: true,
        unique: true,
    })
    slug: string;

    /**
     * The posts associated with this blog.
     */
    @ApiProperty({ type: [Post] })
    @Prop({
        required: true,
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: Post.name,
            },
        ],
        default: [],
    })
    posts: Post[];

    // Timestamps specified here explicitly only for proper typing

    /**
     * The creation date of the blog.
     */
    @ApiProperty()
    createdAt: Date;

    /**
     * The date when the blog was last updated.
     */
    @ApiProperty()
    updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
