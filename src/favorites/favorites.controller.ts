import { Controller, Post, Delete, Param, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavoritesService } from '../favorites/favorites.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ContentType } from '../common/types/content.types';
import { Favorite } from '../favorites/entities/favorite.entity';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('media/:id')
  @ApiOperation({ summary: 'Favorite a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 201, description: 'Media favorited successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async favoriteMedia(@Request() req, @Param('id') mediaId: string) {
    return this.favoritesService.createFavorite(req.user.id, mediaId, 'Media');
  }

  @Delete('media/:id')
  @ApiOperation({ summary: 'Unfavorite a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Media unfavorited successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  async unfavoriteMedia(@Request() req, @Param('id') mediaId: string) {
    return this.favoritesService.removeFavorite(req.user.id, mediaId, 'Media');
  }

  @Post('room/:id')
  @ApiOperation({ summary: 'Favorite a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 201, description: 'Room favorited successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async favoriteRoom(@Request() req, @Param('id') roomId: string) {
    return this.favoritesService.createFavorite(req.user.id, roomId, 'Room');
  }

  @Delete('room/:id')
  @ApiOperation({ summary: 'Unfavorite a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room unfavorited successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  async unfavoriteRoom(@Request() req, @Param('id') roomId: string) {
    return this.favoritesService.removeFavorite(req.user.id, roomId, 'Room');
  }

  @Post('media/:id/toggle')
  @ApiOperation({ summary: 'Toggle favorite for a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Favorite toggled successfully', schema: { type: 'object', properties: { favorited: { type: 'boolean' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleMediaFavorite(@Request() req, @Param('id') mediaId: string) {
    return this.favoritesService.toggleFavorite(req.user.id, mediaId, 'Media');
  }

  @Post('room/:id/toggle')
  @ApiOperation({ summary: 'Toggle favorite for a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Favorite toggled successfully', schema: { type: 'object', properties: { favorited: { type: 'boolean' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleRoomFavorite(@Request() req, @Param('id') roomId: string) {
    return this.favoritesService.toggleFavorite(req.user.id, roomId, 'Room');
  }

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiResponse({ status: 200, description: 'Returns user favorites', type: [Favorite] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Get('media/:id/count')
  @ApiOperation({ summary: 'Get favorites count for a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Returns the number of favorites', schema: { type: 'object', properties: { count: { type: 'number' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMediaFavoritesCount(@Param('id') mediaId: string) {
    const count = await this.favoritesService.getFavoritesCount(mediaId, 'Media');
    return { count };
  }

  @Get('room/:id/count')
  @ApiOperation({ summary: 'Get favorites count for a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Returns the number of favorites', schema: { type: 'object', properties: { count: { type: 'number' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRoomFavoritesCount(@Param('id') roomId: string) {
    const count = await this.favoritesService.getFavoritesCount(roomId, 'Room');
    return { count };
  }

  @Get('media/:id/status')
  @ApiOperation({ summary: 'Check if user has favorited a media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Returns favorite status', schema: { type: 'object', properties: { favorited: { type: 'boolean' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMediaFavoriteStatus(@Request() req, @Param('id') mediaId: string) {
    const favorited = await this.favoritesService.hasFavorited(req.user.id, mediaId, 'Media');
    return { favorited };
  }

  @Get('room/:id/status')
  @ApiOperation({ summary: 'Check if user has favorited a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Returns favorite status', schema: { type: 'object', properties: { favorited: { type: 'boolean' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRoomFavoriteStatus(@Request() req, @Param('id') roomId: string) {
    const favorited = await this.favoritesService.hasFavorited(req.user.id, roomId, 'Room');
    return { favorited };
  }
} 