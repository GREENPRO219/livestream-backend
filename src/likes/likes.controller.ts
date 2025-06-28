import { Controller, Post, Delete, Param, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikesService } from '../likes/likes.service';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBearerAuth, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { ContentType } from '../common/types/content.types';
import { LikeStatusDto, CountDto } from './dto/like-status.dto';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@ApiTags('likes')
@ApiBearerAuth()
@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('media/:id')
  @ApiOperation({ summary: 'Like a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiCreatedResponse({ description: 'Media liked successfully' })
  async likeMedia(@Request() req, @Param('id') mediaId: string) {
    return this.likesService.createLike(req.user.id, mediaId, 'Media');
  }

  @Delete('media/:id')
  @ApiOperation({ summary: 'Unlike a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiOkResponse({ description: 'Media unliked successfully', type: Object })
  async unlikeMedia(@Request() req, @Param('id') mediaId: string) {
    return this.likesService.removeLike(req.user.id, mediaId, 'Media');
  }

  @Post('room/:id')
  @ApiOperation({ summary: 'Like a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiCreatedResponse({ description: 'Room liked successfully' })
  async likeRoom(@Request() req, @Param('id') roomId: string) {
    return this.likesService.createLike(req.user.id, roomId, 'Room');
  }

  @Delete('room/:id')
  @ApiOperation({ summary: 'Unlike a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiOkResponse({ description: 'Room unliked successfully', type: Object })
  async unlikeRoom(@Request() req, @Param('id') roomId: string) {
    return this.likesService.removeLike(req.user.id, roomId, 'Room');
  }

  @Post('media/:id/toggle')
  @ApiOperation({ summary: 'Toggle like for a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiOkResponse({ description: 'Like toggled successfully', type: ToggleLikeDto })
  async toggleMediaLike(@Request() req, @Param('id') mediaId: string) {
    return this.likesService.toggleLike(req.user.id, mediaId, 'Media');
  }

  @Post('room/:id/toggle')
  @ApiOperation({ summary: 'Toggle like for a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiOkResponse({ description: 'Like toggled successfully', type: ToggleLikeDto })
  async toggleRoomLike(@Request() req, @Param('id') roomId: string) {
    return this.likesService.toggleLike(req.user.id, roomId, 'Room');
  }

  @Get('media/:id/count')
  @ApiOperation({ summary: 'Get likes count for a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiOkResponse({ description: 'Returns the number of likes', type: CountDto })
  async getMediaLikesCount(@Param('id') mediaId: string) {
    const count = await this.likesService.getLikesCount(mediaId, 'Media');
    return { count };
  }

  @Get('room/:id/count')
  @ApiOperation({ summary: 'Get likes count for a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiOkResponse({ description: 'Returns the number of likes', type: CountDto })
  async getRoomLikesCount(@Param('id') roomId: string) {
    const count = await this.likesService.getLikesCount(roomId, 'Room');
    return { count };
  }

  @Get('media/:id/status')
  @ApiOperation({ summary: 'Check if user has liked a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiOkResponse({ description: 'Returns like status', type: LikeStatusDto })
  async getMediaLikeStatus(@Request() req, @Param('id') mediaId: string) {
    const liked = await this.likesService.hasLiked(req.user.id, mediaId, 'Media');
    return { liked };
  }

  @Get('room/:id/status')
  @ApiOperation({ summary: 'Check if user has liked a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiOkResponse({ description: 'Returns like status', type: LikeStatusDto })
  async getRoomLikeStatus(@Request() req, @Param('id') roomId: string) {
    const liked = await this.likesService.hasLiked(req.user.id, roomId, 'Room');
    return { liked };
  }
} 