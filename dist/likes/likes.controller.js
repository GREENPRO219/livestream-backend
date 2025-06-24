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
exports.LikesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const likes_service_1 = require("../likes/likes.service");
const swagger_1 = require("@nestjs/swagger");
let LikesController = class LikesController {
    constructor(likesService) {
        this.likesService = likesService;
    }
    async likeMedia(req, mediaId) {
        return this.likesService.createLike(req.user.id, mediaId, 'Media');
    }
    async unlikeMedia(req, mediaId) {
        return this.likesService.removeLike(req.user.id, mediaId, 'Media');
    }
    async likeRoom(req, roomId) {
        return this.likesService.createLike(req.user.id, roomId, 'Room');
    }
    async unlikeRoom(req, roomId) {
        return this.likesService.removeLike(req.user.id, roomId, 'Room');
    }
    async toggleMediaLike(req, mediaId) {
        return this.likesService.toggleLike(req.user.id, mediaId, 'Media');
    }
    async toggleRoomLike(req, roomId) {
        return this.likesService.toggleLike(req.user.id, roomId, 'Room');
    }
    async getMediaLikesCount(mediaId) {
        const count = await this.likesService.getLikesCount(mediaId, 'Media');
        return { count };
    }
    async getRoomLikesCount(roomId) {
        const count = await this.likesService.getLikesCount(roomId, 'Room');
        return { count };
    }
    async getMediaLikeStatus(req, mediaId) {
        const liked = await this.likesService.hasLiked(req.user.id, mediaId, 'Media');
        return { liked };
    }
    async getRoomLikeStatus(req, roomId) {
        const liked = await this.likesService.hasLiked(req.user.id, roomId, 'Room');
        return { liked };
    }
};
exports.LikesController = LikesController;
__decorate([
    (0, common_1.Post)('media/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Like a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Media liked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "likeMedia", null);
__decorate([
    (0, common_1.Delete)('media/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Unlike a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Media unliked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Like not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "unlikeMedia", null);
__decorate([
    (0, common_1.Post)('room/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Like a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Room liked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "likeRoom", null);
__decorate([
    (0, common_1.Delete)('room/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Unlike a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room unliked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Like not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "unlikeRoom", null);
__decorate([
    (0, common_1.Post)('media/:id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle like for a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Like toggled successfully', schema: { type: 'object', properties: { liked: { type: 'boolean' } } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "toggleMediaLike", null);
__decorate([
    (0, common_1.Post)('room/:id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle like for a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Like toggled successfully', schema: { type: 'object', properties: { liked: { type: 'boolean' } } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "toggleRoomLike", null);
__decorate([
    (0, common_1.Get)('media/:id/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get likes count for a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the number of likes', schema: { type: 'object', properties: { count: { type: 'number' } } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "getMediaLikesCount", null);
__decorate([
    (0, common_1.Get)('room/:id/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get likes count for a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the number of likes', schema: { type: 'object', properties: { count: { type: 'number' } } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "getRoomLikesCount", null);
__decorate([
    (0, common_1.Get)('media/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if user has liked a media' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Media ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns like status', schema: { type: 'object', properties: { liked: { type: 'boolean' } } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "getMediaLikeStatus", null);
__decorate([
    (0, common_1.Get)('room/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if user has liked a room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns like status', schema: { type: 'object', properties: { liked: { type: 'boolean' } } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "getRoomLikeStatus", null);
exports.LikesController = LikesController = __decorate([
    (0, swagger_1.ApiTags)('likes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('likes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [likes_service_1.LikesService])
], LikesController);
//# sourceMappingURL=likes.controller.js.map