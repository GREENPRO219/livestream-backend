import { Controller, Post, Delete, Param, UseGuards, Request, Get, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoomsService } from '../rooms/rooms.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
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
} 