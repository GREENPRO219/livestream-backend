import { ApiProperty } from '@nestjs/swagger';

export class FavoriteStatusDto {
  @ApiProperty({ example: true, description: 'Whether the user has favorited the item' })
  favorited: boolean;
}

export class CountDto {
  @ApiProperty({ example: 5, description: 'Number of favorites' })
  count: number;
} 