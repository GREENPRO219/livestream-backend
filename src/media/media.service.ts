import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Media, MediaType } from './entities/media.entity';
import { MediaResponseDto } from './dto/media-response.dto';

@Injectable()
export class MediaService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {
    // Create upload directories if they don't exist
    const uploadDirs = ['uploads/images', 'uploads/videos', 'uploads/thumbnails'];
    uploadDirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  getFileUrl(filename: string, type: MediaType, uploadType?: string): string {
    // If it's an avatar upload, use the avatars folder
    if (uploadType === 'avatar') {
      return `/uploads/avatars/${filename}`;
    }
    
    // Otherwise use the default logic based on file type
    return `/uploads/${type}s/${filename}`;
  }

  validateFileType(mimetype: string): void {
    if (!mimetype.startsWith('image/') && !mimetype.startsWith('video/')) {
      throw new BadRequestException('Only images and videos are allowed');
    }
  }

  getFileType(mimetype: string): MediaType {
    return mimetype.startsWith('video/') ? MediaType.VIDEO : MediaType.IMAGE;
  }

  async createMediaRecord(
    file: Express.Multer.File,
    userId: string,
    duration?: number,
    thumbnail?: string,
    uploadType?: string,
  ): Promise<MediaResponseDto> {
    const fileType = this.getFileType(file.mimetype);
    const fileUrl = this.getFileUrl(file.filename, fileType, uploadType);

    const media = this.mediaRepository.create({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      type: fileType,
      url: fileUrl,
      duration,
      thumbnail,
      user_id: userId,
      uploadType,
    });

    const savedMedia = await this.mediaRepository.save(media);
    return this.mapToResponseDto(savedMedia);
  }

  async findAll(): Promise<MediaResponseDto[]> {
    const media = await this.mediaRepository.find({
      order: { created_at: 'DESC' },
    });
    return media.map(this.mapToResponseDto);
  }

  async findOne(id: string): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) {
      throw new BadRequestException(`Media with ID ${id} not found`);
    }
    return this.mapToResponseDto(media);
  }

  async findByUserId(userId: string): Promise<MediaResponseDto[]> {
    const media = await this.mediaRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    return media.map(this.mapToResponseDto);
  }

  private mapToResponseDto(media: Media): MediaResponseDto {
    return {
      id: media.id,
      filename: media.filename,
      originalname: media.originalname,
      mimetype: media.mimetype,
      size: media.size,
      type: media.type,
      url: media.url,
      duration: media.duration,
      thumbnail: media.thumbnail,
      user_id: media.user_id,
      created_at: media.created_at,
      updated_at: media.updated_at,
    };
  }
} 