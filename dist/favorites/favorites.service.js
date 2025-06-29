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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("./entities/favorite.entity");
const content_helper_service_1 = require("../common/services/content-helper.service");
let FavoritesService = class FavoritesService {
    constructor(favoritesRepository, contentHelper) {
        this.favoritesRepository = favoritesRepository;
        this.contentHelper = contentHelper;
    }
    async createFavorite(userId, contentId, contentType) {
        const contentIds = this.contentHelper.getContentIds(contentId, contentType);
        const favorite = this.favoritesRepository.create({
            user_id: userId,
            ...contentIds,
            content_type: contentType,
        });
        return this.favoritesRepository.save(favorite);
    }
    async removeFavorite(userId, contentId, contentType) {
        const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
        const result = await this.favoritesRepository.delete(query);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Favorite not found');
        }
    }
    async toggleFavorite(userId, contentId, contentType) {
        const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
        const existingFavorite = await this.favoritesRepository.findOne({ where: query });
        if (existingFavorite) {
            await this.removeFavorite(userId, contentId, contentType);
            return { favorited: false };
        }
        else {
            await this.createFavorite(userId, contentId, contentType);
            return { favorited: true };
        }
    }
    async getUserFavorites(userId) {
        return this.favoritesRepository.find({
            where: { user_id: userId },
            relations: ['room', 'media'],
            order: { created_at: 'DESC' },
        });
    }
    async getFavoritesCount(contentId, contentType) {
        const contentIds = this.contentHelper.getContentIds(contentId, contentType);
        return this.favoritesRepository.count({ where: contentIds });
    }
    async hasFavorited(userId, contentId, contentType) {
        const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
        const favorite = await this.favoritesRepository.findOne({ where: query });
        return !!favorite;
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        content_helper_service_1.ContentHelperService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map