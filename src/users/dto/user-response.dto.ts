import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  fullname: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
  })
  phone: string;

  @ApiProperty({
    example: 'https://example.com/avatars/johndoe.jpg',
    description: 'The avatar URL of the user',
    nullable: true,
  })
  avatar?: string;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the user was created',
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the user was last updated',
  })
  updated_at: Date;
} 