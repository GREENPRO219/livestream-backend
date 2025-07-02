import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomMember } from './entities/room-member.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import * as bcrypt from 'bcrypt';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoomsService {
  private appId: string;
  private appCertificate: string;

  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(RoomMember)
    private roomMembersRepository: Repository<RoomMember>,
  ) {
    const configService = new ConfigService();
    this.appId = configService.get('AGORA_APP_ID');
    this.appCertificate = configService.get('AGORA_APP_CERTIFICATE');
  }

  async createRoom(userId: string, createRoomDto: CreateRoomDto): Promise<Room> {
    const { name, description, is_private, password, ws_url } = createRoomDto;

    // generate token
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + 3600;

    const agoraRole = RtcRole.PUBLISHER; // role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      ws_url,
      1234567890,
      agoraRole,
      privilegeExpireTime
    );

    // If room is private, hash the password
    let hashedPassword: string | null = null;
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

    // Add creator as a member
    await this.roomMembersRepository.save({
      room_id: savedRoom.id,
      user_id: userId,
    });

    return savedRoom;
  }

  async joinRoom(userId: string, roomId: string, password?: string): Promise<void> {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is already a member
    const existingMember = await this.roomMembersRepository.findOne({
      where: { room_id: roomId, user_id: userId },
    });
    if (existingMember) {
      throw new BadRequestException('User is already a member of this room');
    }

    // If room is private, verify password
    if (room.isPrivate) {
      if (!password) {
        throw new BadRequestException('Password is required for private room');
      }
      const isPasswordValid = await bcrypt.compare(password, room.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
    }

    // Add user as a member
    await this.roomMembersRepository.save({
      room_id: roomId,
      user_id: userId,
    });
  }

  async leaveRoom(userId: string, roomId: string): Promise<void> {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is a member
    const member = await this.roomMembersRepository.findOne({
      where: { room_id: roomId, user_id: userId },
    });
    if (!member) {
      throw new BadRequestException('User is not a member of this room');
    }

    // Check if user is the creator
    if (room.createdBy === userId) {
      throw new BadRequestException('Room creator cannot leave the room. Delete the room instead.');
    }

    await this.roomMembersRepository.remove(member);
  }

  async getRoomMembers(roomId: string): Promise<RoomMember[]> {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return this.roomMembersRepository.find({
      where: { room_id: roomId },
      relations: ['user'],
    });
  }

  async getRoomDetails(roomId: string): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['createdByUser'],
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async addMember(roomId: string, userId: string): Promise<RoomMember> {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is already a member
    const existingMember = await this.roomMembersRepository.findOne({
      where: { room_id: roomId, user_id: userId },
    });
    if (existingMember) {
      throw new BadRequestException('User is already a member of this room');
    }

    const member = this.roomMembersRepository.create({
      room_id: roomId,
      user_id: userId,
    });

    return this.roomMembersRepository.save(member);
  }

  async removeMember(roomId: string, memberId: string, requesterId: string): Promise<void> {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if requester is the room creator or the member themselves
    if (room.createdBy !== requesterId && memberId !== requesterId) {
      throw new BadRequestException('Only room creator or the member themselves can remove a member');
    }

    const member = await this.roomMembersRepository.findOne({
      where: { room_id: roomId, user_id: memberId },
    });
    if (!member) {
      throw new BadRequestException('Member not found in this room');
    }

    // Prevent room creator from being removed
    if (room.createdBy === memberId) {
      throw new BadRequestException('Room creator cannot be removed from the room');
    }

    await this.roomMembersRepository.remove(member);
  }

  async getRooms(filters?: Partial<Room>): Promise<Room[]> {
    return this.roomsRepository.find({ where: filters });
  }

  async deleteRoom(roomId: string, userId: string): Promise<void> {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is the room creator
    if (room.createdBy !== userId) {
      throw new BadRequestException('Only room creator can delete the room');
    }

    // Delete all room members first
    await this.roomMembersRepository.delete({ room_id: roomId });

    // Delete the room
    await this.roomsRepository.remove(room);
  }
} 