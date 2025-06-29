import { User } from '../../users/entities/user.entity';
import { Room } from './room.entity';
export declare class RoomMember {
    id: string;
    room_id: string;
    user_id: string;
    joined_at: Date;
    room: Room;
    user: User;
}
