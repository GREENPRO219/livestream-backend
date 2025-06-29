"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const favorites_service_1 = require("../favorites/favorites.service");
const swagger_1 = require("@nestjs/swagger");
const favorite_entity_1 = require("../favorites/entities/favorite.entity");
const favorite_status_dto_1 = require("./dto/favorite-status.dto");
const toggle_favorite_dto_1 = require("./dto/toggle-favorite.dto");
let FavoritesController = class FavoritesController {
    constructor(favoritesService) {
        this.favoritesService = favoritesService;
    }
    async favoriteMedia(req, mediaId) {
        return this.favoritesService.createFavorite(req.user.id, mediaId, 'Media');
    }
    async unfavoriteMedia(req, mediaId) {
        return this.favoritesService.removeFavorite(req.user.id, mediaId, 'Media');
    }
    async favoriteRoom(req, roomId) {
        return this.favoritesService.createFavorite(req.user.id, roomId, 'Room');
    }
    async unfavoriteRoom(req, roomId) {
        return this.favoritesService.removeFavorite(req.user.id, roomId, 'Room');
    }
    async toggleMediaFavorite(req, mediaId) {
        return this.favoritesService.toggleFavorite(req.user.id, mediaId, 'Media');
    }
    async toggleRoomFavorite(req, roomId) {
        return this.favoritesService.toggleFavorite(req.user.id, roomId, 'Room');
    }
    async getUserFavorites(req) {
        return this.favoritesService.getUserFavorites(req.user.id);
    }
    async getMediaFavoritesCount(mediaId) {
        const count = await this.favoritesService.getFavoritesCount(mediaId, 'Media');
        return { count };
    }
    async getRoomFavoritesCount(roomId) {
        const count = await this.favoritesService.getFavoritesCount(roomId, 'Room');
        return { count };
    }
    async getMediaFavoriteStatus(req, mediaId) {
        const favorited = await this.favoritesService.hasFavorited(req.user.id, mediaId, 'Media');
        return { favorited };
    }
    async getRoomFavoriteStatus(req, roomId) {
        const favorited = await this.favoritesService.hasFavorited(req.user.id, roomId, 'Room');
        return { favorited };
    }
};
exports.FavoritesController = FavoritesController;
__decorate([
    (0, common_1.Post)('media/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Favorite a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Media favorited successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "favoriteMedia", null);
__decorate([
    (0, common_1.Delete)('media/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Unfavorite a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Media unfavorited successfully', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Favorite not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "unfavoriteMedia", null);
__decorate([
    (0, common_1.Post)('room/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Favorite a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Room favorited successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "favoriteRoom", null);
__decorate([
    (0, common_1.Delete)('room/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Unfavorite a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Room unfavorited successfully', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Favorite not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "unfavoriteRoom", null);
__decorate([
    (0, common_1.Post)('media/:id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle favorite for a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Favorite toggled successfully', type: toggle_favorite_dto_1.ToggleFavoriteDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "toggleMediaFavorite", null);
__decorate([
    (0, common_1.Post)('room/:id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle favorite for a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Favorite toggled successfully', type: toggle_favorite_dto_1.ToggleFavoriteDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "toggleRoomFavorite", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user favorites' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Returns user favorites', type: [favorite_entity_1.Favorite] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "getUserFavorites", null);
__decorate([
    (0, common_1.Get)('media/:id/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get favorites count for a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Returns the number of favorites', type: favorite_status_dto_1.CountDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "getMediaFavoritesCount", null);
__decorate([
    (0, common_1.Get)('room/:id/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get favorites count for a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Returns the number of favorites', type: favorite_status_dto_1.CountDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "getRoomFavoritesCount", null);
__decorate([
    (0, common_1.Get)('media/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if user has favorited a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Returns favorite status', type: favorite_status_dto_1.FavoriteStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "getMediaFavoriteStatus", null);
__decorate([
    (0, common_1.Get)('room/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if user has favorited a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Returns favorite status', type: favorite_status_dto_1.FavoriteStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "getRoomFavoriteStatus", null);
exports.FavoritesController = FavoritesController = __decorate([
    (0, swagger_1.ApiTags)('favorites'),
    (0, common_1.Controller)('favorites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [favorites_service_1.FavoritesService])
], FavoritesController);
//# sourceMappingURL=favorites.controller.js.map