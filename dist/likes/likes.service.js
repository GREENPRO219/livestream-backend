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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const like_entity_1 = require("./entities/like.entity");
const content_helper_service_1 = require("../common/services/content-helper.service");
let LikesService = class LikesService {
    constructor(likesRepository, contentHelper) {
        this.likesRepository = likesRepository;
        this.contentHelper = contentHelper;
    }
    async createLike(userId, contentId, contentType) {
        const contentIds = this.contentHelper.getContentIds(contentId, contentType);
        const like = this.likesRepository.create({
            user_id: userId,
            ...contentIds,
            content_type: contentType,
        });
        return this.likesRepository.save(like);
    }
    async removeLike(userId, contentId, contentType) {
        const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
        const result = await this.likesRepository.delete(query);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Like not found');
        }
    }
    async toggleLike(userId, contentId, contentType) {
        const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
        const existingLike = await this.likesRepository.findOne({ where: query });
        if (existingLike) {
            await this.removeLike(userId, contentId, contentType);
            return { liked: false };
        }
        else {
            await this.createLike(userId, contentId, contentType);
            return { liked: true };
        }
    }
    async getLikesCount(contentId, contentType) {
        const contentIds = this.contentHelper.getContentIds(contentId, contentType);
        return this.likesRepository.count({ where: contentIds });
    }
    async hasLiked(userId, contentId, contentType) {
        const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
        const like = await this.likesRepository.findOne({ where: query });
        return !!like;
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        content_helper_service_1.ContentHelperService])
], LikesService);
//# sourceMappingURL=likes.service.js.map