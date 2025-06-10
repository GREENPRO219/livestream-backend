import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async createMessage(userId: string, roomId: string, message: string): Promise<ChatMessage> {
    const chatMessage = this.chatMessageRepository.create({
      user_id: userId,
      room_id: roomId,
      message,
    });
    return this.chatMessageRepository.save(chatMessage);
  }

  async getRoomMessages(roomId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: { room_id: roomId },
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getLatestMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
    return this.getRoomMessages(roomId, limit);
  }
} 