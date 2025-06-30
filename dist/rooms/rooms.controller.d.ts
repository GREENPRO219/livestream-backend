import { RoomsService } from '../rooms/rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    createRoom(req: any, createRoomDto: CreateRoomDto): Promise<Room>;
    joinRoom(req: any, roomId: string): Promise<void>;
    leaveRoom(req: any, roomId: string): Promise<void>;
    removeMember(req: any, roomId: string, memberId: string): Promise<void>;
    deleteRoom(req: any, roomId: string): Promise<void>;
    getRoomMembers(roomId: string): Promise<import("./entities/room-member.entity").RoomMember[]>;
    getRoomDetails(roomId: string): Promise<Room>;
    getRooms(name?: string, is_private?: string, createdBy?: string): Promise<Room[]>;
}
