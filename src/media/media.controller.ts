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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { MediaResponseDto } from './dto/media-response.dto';
import { Public } from '../auth/decorators/public.decorator';
import { createFileUploadConfig, createUploadDirectories, processUploadRequest, moveFileToCorrectDirectory } from './helpers';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {
    // Ensure upload directories exist
    createUploadDirectories();
  }

  @ApiBearerAuth('jwt_auth')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', createFileUploadConfig()))
  @ApiOperation({ summary: 'Upload a media file (image or video)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image or video file to upload',
        },
        type: {
          type: 'string',
          description: 'Type of the media (avatar for profile pictures)',
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

    const uploadType = processUploadRequest(req);
    
    console.log('File MIME type:', file.mimetype);
    console.log('File path:', file.path);
    
    try {
      // Move file to correct directory based on upload type
      moveFileToCorrectDirectory(file, uploadType);
    } catch (error) {
      console.error('Error moving file:', error);
      throw new BadRequestException('Failed to process file upload');
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