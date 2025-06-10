import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private connectedClients: Map<string, { socket: Socket; userId: string }> = new Map();

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);
      
      if (!user) {
        client.disconnect();
        return;
      }

      this.connectedClients.set(client.id, { socket: client, userId: user.id });
      this.logger.log(`Client connected: ${user.username}`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      this.connectedClients.delete(client.id);
      this.logger.log(`Client disconnected: ${clientInfo.userId}`);
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    this.logger.log(`Client joined room: ${roomId}`);

    // Send last 50 messages when joining a room
    const messages = await this.chatService.getLatestMessages(roomId);
    client.emit('room_messages', messages);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    this.logger.log(`Client left room: ${roomId}`);
  }

  @SubscribeMessage('chat_message')
  async handleMessage(client: Socket, payload: { roomId: string; message: string }) {
    const clientInfo = this.connectedClients.get(client.id);
    if (!clientInfo) {
      return;
    }

    // Save message to database
    const savedMessage = await this.chatService.createMessage(
      clientInfo.userId,
      payload.roomId,
      payload.message
    );

    // Get user info for the message
    const user = await this.usersService.findOne(clientInfo.userId);

    // Broadcast message to room
    this.server.to(payload.roomId).emit('chat_message', {
      id: savedMessage.id,
      userId: clientInfo.userId,
      username: user.username,
      message: payload.message,
      timestamp: savedMessage.created_at,
    });
  }
} 