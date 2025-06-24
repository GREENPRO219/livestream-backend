import { User } from '../../users/entities/user.entity';
import { RoomMember } from './room-member.entity';
export declare class Room {
    id: string;
    name: string;
    description: string;
    isPrivate: boolean;
    password: string;
    createdBy: string;
    createdByUser: User;
    members: RoomMember[];
    createdAt: Date;
    updatedAt: Date;
    ws_url: string;
    token: string;
}
