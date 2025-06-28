import { ApiProperty } from '@nestjs/swagger';

export class RoomMemberDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Member ID' })
  id: string;
  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;
}

export class RoomMembersDto {
  @ApiProperty({ type: [RoomMemberDto] })
  members: RoomMemberDto[];
} 