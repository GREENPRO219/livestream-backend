import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikeDto {
  @ApiProperty({ example: true, description: 'Whether the item is liked after toggling' })
  liked: boolean;
} 