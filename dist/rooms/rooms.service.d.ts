import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomMember } from './entities/room-member.entity';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private roomsRepository;
    private roomMembersRepository;
    private appId;
    private appCertificate;
    constructor(roomsRepository: Repository<Room>, roomMembersRepository: Repository<RoomMember>);
    createRoom(userId: string, createRoomDto: CreateRoomDto): Promise<Room>;
    joinRoom(userId: string, roomId: string, password?: string): Promise<void>;
    leaveRoom(userId: string, roomId: string): Promise<void>;
    getRoomMembers(roomId: string): Promise<RoomMember[]>;
    getRoomDetails(roomId: string): Promise<Room>;
    addMember(roomId: string, userId: string): Promise<RoomMember>;
    removeMember(roomId: string, memberId: string, requesterId: string): Promise<void>;
    getRooms(filters?: Partial<Room>): Promise<Room[]>;
    deleteRoom(roomId: string, userId: string): Promise<void>;
}
