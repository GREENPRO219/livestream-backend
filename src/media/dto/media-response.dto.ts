import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../entities/media.entity';

export class MediaResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the media',
  })
  id: string;

  @ApiProperty({
    example: '1234567890-image.jpg',
    description: 'The generated filename',
  })
  filename: string;

  @ApiProperty({
    example: 'image.jpg',
    description: 'The original filename',
  })
  originalname: string;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'The MIME type of the file',
  })
  mimetype: string;

  @ApiProperty({
    example: 1024,
    description: 'The size of the file in bytes',
  })
  size: number;

  @ApiProperty({
    enum: MediaType,
    example: MediaType.IMAGE,
    description: 'The type of media (image or video)',
  })
  type: MediaType;

  @ApiProperty({
    example: 'http://localhost:3000/uploads/images/1234567890-image.jpg',
    description: 'The URL to access the media',
  })
  url: string;

  @ApiProperty({
    example: 120,
    description: 'The duration of the video in seconds (for videos only)',
    required: false,
  })
  duration?: number;

  @ApiProperty({
    example: 'http://localhost:3000/uploads/thumbnails/1234567890-thumb.jpg',
    description: 'The URL to the thumbnail (for videos only)',
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user who uploaded the media',
  })
  user_id: string;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the media was uploaded',
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the media was last updated',
  })
  updated_at: Date;
} 