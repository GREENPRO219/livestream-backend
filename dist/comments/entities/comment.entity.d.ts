import { User } from '@users/entities/user.entity';
import { Media } from '@media/entities/media.entity';
export declare class Comment {
    id: string;
    comment: string;
    user_id: string;
    user: User;
    media_id: string;
    media: Media;
    created_at: Date;
}
