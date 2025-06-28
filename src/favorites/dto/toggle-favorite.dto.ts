import { ApiProperty } from '@nestjs/swagger';

export class ToggleFavoriteDto {
  @ApiProperty({ example: true, description: 'Whether the item is favorited after toggling' })
  favorited: boolean;
} 