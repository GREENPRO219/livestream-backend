import { Controller, Post, Delete, Param, UseGuards, Request, Get, Body, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoomsService } from '../rooms/rooms.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/create-room.dto';

@ApiTags('rooms')
@ApiBearerAuth()
@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    console.log('post data =>', req.user.id, createRoomDto);
    return this.roomsService.createRoom(req.user.id, createRoomDto);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Successfully joined the room' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async joinRoom(@Request() req, @Param('id') roomId: string) {
    return this.roomsService.joinRoom(req.user.id, roomId);
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: 'Leave a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Successfully left the room' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async leaveRoom(@Request() req, @Param('id') roomId: string) {
    return this.roomsService.leaveRoom(req.user.id, roomId);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID to remove' })
  @ApiResponse({ status: 200, description: 'Successfully removed member from room' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Room or member not found' })
  async removeMember(
    @Request() req,
    @Param('id') roomId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.roomsService.removeMember(roomId, memberId, req.user.id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get room members' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Returns list of room members' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getRoomMembers(@Param('id') roomId: string) {
    return this.roomsService.getRoomMembers(roomId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room details' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Returns room details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getRoomDetails(@Param('id') roomId: string) {
    return this.roomsService.getRoomDetails(roomId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Returns all rooms' })
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