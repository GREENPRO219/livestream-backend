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

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiBearerAuth('jwt_auth')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const type = req.body.type;
        if (type === 'avatar') {
          cb(null, './uploads/avatars');
        } else {
          cb(null, './uploads/images');
        }
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
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
    @Body('type') type?: string,
  ): Promise<MediaResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const allowedTypes = ['avatar'];
    const uploadType = allowedTypes.includes(type) ? type : undefined;
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