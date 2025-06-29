import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
  ParseUUIDPipe,
  Query,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiSecurity, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { MediaResponseDto } from './dto/media-response.dto';
import { Public } from '../auth/decorators/public.decorator';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {
    // Ensure upload directories exist
    this.ensureUploadDirectories();
  }

  private ensureUploadDirectories() {
    const directories = ['./uploads', './uploads/avatars', './uploads/images'];
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  @ApiBearerAuth('jwt_auth')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        // Default to images folder
        cb(null, './uploads/images');
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  }))
  @ApiOperation({ summary: 'Upload a media file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          description: 'Type of the media (avatar)',
          enum: ['avatar'],
          example: 'avatar',
        },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({ type: MediaResponseDto })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<MediaResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Get type from form data
    const type = req.body?.type;
    const allowedTypes = ['avatar'];
    const uploadType = allowedTypes.includes(type) ? type : undefined;
    
    console.log('Request body:', req.body);
    console.log('Type from body:', type);
    console.log('Upload type:', uploadType);
    
    // If it's an avatar, move the file to avatars folder
    if (uploadType === 'avatar') {
      const oldPath = file.path;
      const newPath = path.join('./uploads/avatars', path.basename(file.filename));
      
      try {
        fs.renameSync(oldPath, newPath);
        file.path = newPath;
        console.log(`File moved from ${oldPath} to ${newPath}`);
      } catch (error) {
        console.error('Error moving file:', error);
        throw new BadRequestException('Failed to process avatar upload');
      }
    }
    
    this.mediaService.validateFileType(file.mimetype);
    return this.mediaService.createMediaRecord(file, req.user.id, undefined, undefined, uploadType);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all media files' })
  @ApiOkResponse({ type: [MediaResponseDto] })
  async findAll(): Promise<MediaResponseDto[]> {
    return this.mediaService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get media file by id' })
  @ApiOkResponse({ type: MediaResponseDto })
  async findOne(@Param('id') id: string): Promise<MediaResponseDto> {
    return this.mediaService.findOne(id);
  }

  @Public()
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all media files for a specific user' })
  @ApiOkResponse({ type: [MediaResponseDto] })
  async findByUserId(
    @Param('userId', new ParseUUIDPipe({ version: '4', optional: true })) userId?: string
  ): Promise<MediaResponseDto[]> {
    if (!userId) {
      return [];
    }
    return this.mediaService.findByUserId(userId);
  }
} 