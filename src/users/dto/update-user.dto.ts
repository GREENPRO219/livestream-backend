import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  fullname?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    minLength: 6,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
} 