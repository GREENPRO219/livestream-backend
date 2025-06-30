import { Controller, Post, Delete, Param, UseGuards, Request, Get, Body, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoomsService } from '../rooms/rooms.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomMembersDto } from './dto/room-members.dto';
import { Room } from './entities/room.entity';
import { Public } from '@/auth/decorators/public.decorator';

@ApiTags('rooms')

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiBody({ type: CreateRoomDto })
  @ApiCreatedResponse({ description: 'Room created successfully', type: Room })
  async createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    console.log('post data =>', req.user.id, createRoomDto);
    return this.roomsService.createRoom(req.user.id, createRoomDto);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiOkResponse({ description: 'Successfully joined the room', type: Room })
  async joinRoom(@Request() req, @Param('id') roomId: string) {
    return this.roomsService.joinRoom(req.user.id, roomId);
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: 'Leave a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiOkResponse({ description: 'Successfully left the room', type: Room })
  async leaveRoom(@Request() req, @Param('id') roomId: string) {
    return this.roomsService.leaveRoom(req.user.id, roomId);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID to remove' })
  @ApiOkResponse({ description: 'Successfully removed member from room', type: Room })
  async removeMember(
    @Request() req,
    @Param('id') roomId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.roomsService.removeMember(roomId, memberId, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiOkResponse({ description: 'Successfully deleted the room' })
  async deleteRoom(@Request() req, @Param('id') roomId: string) {
    return this.roomsService.deleteRoom(roomId, req.user.id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get room members' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiOkResponse({ description: 'Returns list of room members', type: RoomMembersDto })
  async getRoomMembers(@Param('id') roomId: string) {
    return this.roomsService.getRoomMembers(roomId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room details' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiOkResponse({ description: 'Returns room details', type: Room })
  async getRoomDetails(@Param('id') roomId: string) {
    return this.roomsService.getRoomDetails(roomId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  
  @ApiOkResponse({ description: 'Returns all rooms', type: [Room] })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'is_private', required: false })
  @ApiQuery({ name: 'createdBy', required: false, description: 'Filter by creator user ID' })
  async getRooms(
    @Query('name') name?: string,
    @Query('is_private') is_private?: string,
    @Query('createdBy') createdBy?: string,
  ) {
    return this.roomsService.getRooms({ name, isPrivate: is_private === undefined ? undefined : is_private === 'true', createdBy });
  }
} 