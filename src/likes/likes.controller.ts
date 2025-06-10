import { Controller, Post, Delete, Param, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikesService } from '../likes/likes.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ContentType } from '../common/types/content.types';

@ApiTags('likes')
@ApiBearerAuth()
@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('media/:id')
  @ApiOperation({ summary: 'Like a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 201, description: 'Media liked successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async likeMedia(@Request() req, @Param('id') mediaId: string) {
    return this.likesService.createLike(req.user.id, mediaId, 'Media');
  }

  @Delete('media/:id')
  @ApiOperation({ summary: 'Unlike a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Media unliked successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  async unlikeMedia(@Request() req, @Param('id') mediaId: string) {
    return this.likesService.removeLike(req.user.id, mediaId, 'Media');
  }

  @Post('room/:id')
  @ApiOperation({ summary: 'Like a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 201, description: 'Room liked successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async likeRoom(@Request() req, @Param('id') roomId: string) {
    return this.likesService.createLike(req.user.id, roomId, 'Room');
  }

  @Delete('room/:id')
  @ApiOperation({ summary: 'Unlike a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room unliked successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  async unlikeRoom(@Request() req, @Param('id') roomId: string) {
    return this.likesService.removeLike(req.user.id, roomId, 'Room');
  }

  @Post('media/:id/toggle')
  @ApiOperation({ summary: 'Toggle like for a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully', schema: { type: 'object', properties: { liked: { type: 'boolean' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleMediaLike(@Request() req, @Param('id') mediaId: string) {
    return this.likesService.toggleLike(req.user.id, mediaId, 'Media');
  }

  @Post('room/:id/toggle')
  @ApiOperation({ summary: 'Toggle like for a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully', schema: { type: 'object', properties: { liked: { type: 'boolean' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleRoomLike(@Request() req, @Param('id') roomId: string) {
    return this.likesService.toggleLike(req.user.id, roomId, 'Room');
  }

  @Get('media/:id/count')
  @ApiOperation({ summary: 'Get likes count for a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Returns the number of likes', schema: { type: 'object', properties: { count: { type: 'number' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMediaLikesCount(@Param('id') mediaId: string) {
    const count = await this.likesService.getLikesCount(mediaId, 'Media');
    return { count };
  }

  @Get('room/:id/count')
  @ApiOperation({ summary: 'Get likes count for a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Returns the number of likes', schema: { type: 'object', properties: { count: { type: 'number' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRoomLikesCount(@Param('id') roomId: string) {
    const count = await this.likesService.getLikesCount(roomId, 'Room');
    return { count };
  }

  @Get('media/:id/status')
  @ApiOperation({ summary: 'Check if user has liked a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Returns like status', schema: { type: 'object', properties: { liked: { type: 'boolean' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMediaLikeStatus(@Request() req, @Param('id') mediaId: string) {
    const liked = await this.likesService.hasLiked(req.user.id, mediaId, 'Media');
    return { liked };
  }

  @Get('room/:id/status')
  @ApiOperation({ summary: 'Check if user has liked a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Returns like status', schema: { type: 'object', properties: { liked: { type: 'boolean' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRoomLikeStatus(@Request() req, @Param('id') roomId: string) {
    const liked = await this.likesService.hasLiked(req.user.id, roomId, 'Room');
    return { liked };
  }
} 