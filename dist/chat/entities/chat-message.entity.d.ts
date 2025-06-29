import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
export declare class ChatMessage {
    id: string;
    user_id: string;
    user: User;
    room_id: string;
    room: Room;
    message: string;
    created_at: Date;
}
