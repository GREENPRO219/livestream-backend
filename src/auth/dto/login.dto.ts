import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class LoginDto {
  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;

  @ApiProperty({
    description: 'SMS verification code sent to the user',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
} 