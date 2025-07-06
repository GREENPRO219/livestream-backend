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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
const room_member_entity_1 = require("./entities/room-member.entity");
const bcrypt = require("bcrypt");
const agora_access_token_1 = require("agora-access-token");
const config_1 = require("@nestjs/config");
let RoomsService = class RoomsService {
    constructor(roomsRepository, roomMembersRepository) {
        this.roomsRepository = roomsRepository;
        this.roomMembersRepository = roomMembersRepository;
        const configService = new config_1.ConfigService();
        this.appId = configService.get('AGORA_APP_ID');
        this.appCertificate = configService.get('AGORA_APP_CERTIFICATE');
    }
    async createRoom(userId, createRoomDto) {
        const { name, description, is_private, password, ws_url } = createRoomDto;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTimestamp + 3600;
        const agoraRole = agora_access_token_1.RtcRole.PUBLISHER;
        const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(this.appId, this.appCertificate, ws_url, 1234567890, agoraRole, privilegeExpireTime);
        let hashedPassword = null;
        if (is_private && password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const room = this.roomsRepository.create({
            name,
            description,
            isPrivate: is_private,
            password: hashedPassword,
            createdBy: userId,
            ws_url,
            token,
        });
        const savedRoom = await this.roomsRepository.save(room);
        await this.roomMembersRepository.save({
            room_id: savedRoom.id,
            user_id: userId,
        });
        return savedRoom;
    }
    async joinRoom(userId, roomId, password) {
        const room = await this.roomsRepository.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const existingMember = await this.roomMembersRepository.findOne({
            where: { room_id: roomId, user_id: userId },
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a member of this room');
        }
        if (room.isPrivate) {
            if (!password) {
                throw new common_1.BadRequestException('Password is required for private room');
            }
            const isPasswordValid = await bcrypt.compare(password, room.password);
            if (!isPasswordValid) {
                throw new common_1.BadRequestException('Invalid password');
            }
        }
        await this.roomMembersRepository.save({
            room_id: roomId,
            user_id: userId,
        });
    }
    async leaveRoom(userId, roomId) {
        const room = await this.roomsRepository.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const member = await this.roomMembersRepository.findOne({
            where: { room_id: roomId, user_id: userId },
        });
        if (!member) {
            throw new common_1.BadRequestException('User is not a member of this room');
        }
        if (room.createdBy === userId) {
            throw new common_1.BadRequestException('Room creator cannot leave the room. Delete the room instead.');
        }
        await this.roomMembersRepository.remove(member);
    }
    async getRoomMembers(roomId) {
        const room = await this.roomsRepository.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return this.roomMembersRepository.find({
            where: { room_id: roomId },
            relations: ['user'],
        });
    }
    async getRoomDetails(roomId) {
        const room = await this.roomsRepository.findOne({
            where: { id: roomId },
            relations: ['createdByUser'],
        });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return room;
    }
    async addMember(roomId, userId) {
        const room = await this.roomsRepository.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const existingMember = await this.roomMembersRepository.findOne({
            where: { room_id: roomId, user_id: userId },
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a member of this room');
        }
        const member = this.roomMembersRepository.create({
            room_id: roomId,
            user_id: userId,
        });
        return this.roomMembersRepository.save(member);
    }
    async removeMember(roomId, memberId, requesterId) {
        const room = await this.roomsRepository.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        if (room.createdBy !== requesterId && memberId !== requesterId) {
            throw new common_1.BadRequestException('Only room creator or the member themselves can remove a member');
        }
        const member = await this.roomMembersRepository.findOne({
            where: { room_id: roomId, user_id: memberId },
        });
        if (!member) {
            throw new common_1.BadRequestException('Member not found in this room');
        }
        if (room.createdBy === memberId) {
            throw new common_1.BadRequestException('Room creator cannot be removed from the room');
        }
        await this.roomMembersRepository.remove(member);
    }
    async getRooms(filters) {
        return this.roomsRepository.find({ where: filters });
    }
    async deleteRoom(roomId, userId) {
        const room = await this.roomsRepository.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        if (room.createdBy !== userId) {
            throw new common_1.BadRequestException('Only room creator can delete the room');
        }
        await this.roomMembersRepository.delete({ room_id: roomId });
        await this.roomsRepository.remove(room);
    }
    async generateAgoraToken(uid, ws_url, role) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTimestamp + 3600;
        const agoraRole = role === 'publisher' ? agora_access_token_1.RtcRole.PUBLISHER : agora_access_token_1.RtcRole.SUBSCRIBER;
        return agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(this.appId, this.appCertificate, ws_url, uid, agoraRole, privilegeExpireTime);
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(room_member_entity_1.RoomMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map