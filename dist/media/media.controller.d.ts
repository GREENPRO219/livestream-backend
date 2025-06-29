import { MediaService } from './media.service';
import { MediaResponseDto } from './dto/media-response.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    private ensureUploadDirectories;
    uploadFile(file: Express.Multer.File, req: any): Promise<MediaResponseDto>;
    findAll(): Promise<MediaResponseDto[]>;
    findOne(id: string): Promise<MediaResponseDto>;
    findByUserId(userId?: string): Promise<MediaResponseDto[]>;
}
