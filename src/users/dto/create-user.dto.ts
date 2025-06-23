import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;
} 