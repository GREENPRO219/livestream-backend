import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { MediaResponseDto } from './dto/media-response.dto';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
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
      },
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

    this.mediaService.validateFileType(file.mimetype);
    return this.mediaService.createMediaRecord(file, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all media files' })
  @ApiOkResponse({ type: [MediaResponseDto] })
  async findAll(): Promise<MediaResponseDto[]> {
    return this.mediaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media file by id' })
  @ApiOkResponse({ type: MediaResponseDto })
  async findOne(@Param('id') id: string): Promise<MediaResponseDto> {
    return this.mediaService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all media files for a specific user' })
  @ApiOkResponse({ type: [MediaResponseDto] })
  async findByUserId(@Param('userId') userId: string): Promise<MediaResponseDto[]> {
    return this.mediaService.findByUserId(userId);
  }
} 