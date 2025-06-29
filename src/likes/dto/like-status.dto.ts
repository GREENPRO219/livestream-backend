import { ApiProperty } from '@nestjs/swagger';

export class LikeStatusDto {
  @ApiProperty({ example: true, description: 'Whether the user has liked the item' })
  liked: boolean;
}

export class CountDto {
  @ApiProperty({ example: 5, description: 'Number of likes' })
  count: number;
} 