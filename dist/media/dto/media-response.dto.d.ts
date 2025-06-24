import { MediaType } from '../entities/media.entity';
export declare class MediaResponseDto {
    id: string;
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    type: MediaType;
    url: string;
    duration?: number;
    thumbnail?: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}
