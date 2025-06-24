"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(jwtService, usersService, chatService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.chatService = chatService;
        this.logger = new common_1.Logger('ChatGateway');
        this.connectedClients = new Map();
    }
    async handleConnection(client) {
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
        }
        catch (error) {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const clientInfo = this.connectedClients.get(client.id);
        if (clientInfo) {
            this.connectedClients.delete(client.id);
            this.logger.log(`Client disconnected: ${clientInfo.userId}`);
        }
    }
    async handleJoinRoom(client, roomId) {
        client.join(roomId);
        this.logger.log(`Client joined room: ${roomId}`);
        const messages = await this.chatService.getLatestMessages(roomId);
        client.emit('room_messages', messages);
    }
    handleLeaveRoom(client, roomId) {
        client.leave(roomId);
        this.logger.log(`Client left room: ${roomId}`);
    }
    async handleMessage(client, payload) {
        const clientInfo = this.connectedClients.get(client.id);
        if (!clientInfo) {
            return;
        }
        const savedMessage = await this.chatService.createMessage(clientInfo.userId, payload.roomId, payload.message);
        const user = await this.usersService.findOne(clientInfo.userId);
        this.server.to(payload.roomId).emit('chat_message', {
            id: savedMessage.id,
            userId: clientInfo.userId,
            username: user.username,
            message: payload.message,
            timestamp: savedMessage.created_at,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat_message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map