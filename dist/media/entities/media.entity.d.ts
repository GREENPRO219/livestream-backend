import { User } from '@users/entities/user.entity';
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video"
}
export declare class Media {
    id: string;
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    type: MediaType;
    url: string;
    duration?: number;
    thumbnail?: string;
    user: User;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}
