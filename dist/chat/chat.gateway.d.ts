import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private usersService;
    private chatService;
    server: Server;
    private logger;
    private connectedClients;
    constructor(jwtService: JwtService, usersService: UsersService, chatService: ChatService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, roomId: string): Promise<void>;
    handleLeaveRoom(client: Socket, roomId: string): void;
    handleMessage(client: Socket, payload: {
        roomId: string;
        message: string;
    }): Promise<void>;
}
