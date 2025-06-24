import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Media, MediaType } from './entities/media.entity';
import { MediaResponseDto } from './dto/media-response.dto';
export declare class MediaService {
    private configService;
    private mediaRepository;
    constructor(configService: ConfigService, mediaRepository: Repository<Media>);
    getFileUrl(filename: string, type: MediaType): string;
    validateFileType(mimetype: string): void;
    getFileType(mimetype: string): MediaType;
    createMediaRecord(file: Express.Multer.File, userId: string, duration?: number, thumbnail?: string): Promise<MediaResponseDto>;
    findAll(): Promise<MediaResponseDto[]>;
    findOne(id: string): Promise<MediaResponseDto>;
    findByUserId(userId: string): Promise<MediaResponseDto[]>;
    private mapToResponseDto;
}
