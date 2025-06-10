import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Name of the room', minLength: 3, maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'Description of the room', required: false, maxLength: 500 })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Whether the room is private', default: false })
  @IsBoolean()
  @IsOptional()
  is_private?: boolean;

  @ApiProperty({ description: 'Password for private room', required: false, minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
} 