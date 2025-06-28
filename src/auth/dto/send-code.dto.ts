import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SendCodeDto {
  @ApiProperty({
    description: 'Phone number to send verification code to',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;
}

export class SendCodeResponseDto {
  @ApiProperty({ example: 'Code sent', description: 'Status message' })
  message: string;

  @ApiProperty({ example: '123456', description: 'Verification code sent to the user' })
  code: string;
} 