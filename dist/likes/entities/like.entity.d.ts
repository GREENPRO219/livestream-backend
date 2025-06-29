import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Media } from '../../media/entities/media.entity';
export declare class Like {
    id: string;
    user_id: string;
    user: User;
    room_id: string;
    room: Room;
    media_id: string;
    media: Media;
    content_type: 'Room' | 'Media';
    created_at: Date;
}
