import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomMember } from './entities/room-member.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(RoomMember)
    private roomMembersRepository: Repository<RoomMember>,
  ) {}

  async createRoom(userId: string, createRoomDto: CreateRoomDto): Promise<Room> {
    const { name, description, is_private, password, ws_url, token } = createRoomDto;

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

  async getRooms(filters?: { name?: string; is_private?: string; createdBy?: string }): Promise<Room[]> {
    const where: any = {};
    if (filters) {
      if (filters.name) where.name = filters.name;
      if (filters.is_private !== undefined) where.isPrivate = filters.is_private === 'true';
      if (filters.createdBy) where.createdBy = filters.createdBy;
    }
    return this.roomsRepository.find({ where });
  }
} 