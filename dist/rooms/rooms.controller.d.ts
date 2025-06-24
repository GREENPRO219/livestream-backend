import { RoomsService } from '../rooms/rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    createRoom(req: any, createRoomDto: CreateRoomDto): Promise<import("./entities/room.entity").Room>;
    joinRoom(req: any, roomId: string): Promise<void>;
    leaveRoom(req: any, roomId: string): Promise<void>;
    removeMember(req: any, roomId: string, memberId: string): Promise<void>;
    getRoomMembers(roomId: string): Promise<import("./entities/room-member.entity").RoomMember[]>;
    getRoomDetails(roomId: string): Promise<import("./entities/room.entity").Room>;
    getRooms(name?: string, is_private?: string, createdBy?: string): Promise<import("./entities/room.entity").Room[]>;
}
