import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
export declare class ChatService {
    private chatMessageRepository;
    constructor(chatMessageRepository: Repository<ChatMessage>);
    createMessage(userId: string, roomId: string, message: string): Promise<ChatMessage>;
    getRoomMessages(roomId: string, limit?: number, offset?: number): Promise<ChatMessage[]>;
    getLatestMessages(roomId: string, limit?: number): Promise<ChatMessage[]>;
}
