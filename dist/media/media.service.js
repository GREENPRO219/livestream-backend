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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs_1 = require("fs");
const media_entity_1 = require("./entities/media.entity");
let MediaService = class MediaService {
    constructor(configService, mediaRepository) {
        this.configService = configService;
        this.mediaRepository = mediaRepository;
        const uploadDirs = ['uploads/images', 'uploads/videos', 'uploads/thumbnails'];
        uploadDirs.forEach(dir => {
            if (!(0, fs_1.existsSync)(dir)) {
                (0, fs_1.mkdirSync)(dir, { recursive: true });
            }
        });
    }
    getFileUrl(filename, type) {
        return `/uploads/${type}s/${filename}`;
    }
    validateFileType(mimetype) {
        if (!mimetype.startsWith('image/') && !mimetype.startsWith('video/')) {
            throw new common_1.BadRequestException('Only images and videos are allowed');
        }
    }
    getFileType(mimetype) {
        return mimetype.startsWith('video/') ? media_entity_1.MediaType.VIDEO : media_entity_1.MediaType.IMAGE;
    }
    async createMediaRecord(file, userId, duration, thumbnail) {
        const fileType = this.getFileType(file.mimetype);
        const fileUrl = this.getFileUrl(file.filename, fileType);
        const media = this.mediaRepository.create({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            type: fileType,
            url: fileUrl,
            duration,
            thumbnail,
            user_id: userId,
        });
        const savedMedia = await this.mediaRepository.save(media);
        return this.mapToResponseDto(savedMedia);
    }
    async findAll() {
        const media = await this.mediaRepository.find({
            order: { created_at: 'DESC' },
        });
        return media.map(this.mapToResponseDto);
    }
    async findOne(id) {
        const media = await this.mediaRepository.findOne({ where: { id } });
        if (!media) {
            throw new common_1.BadRequestException(`Media with ID ${id} not found`);
        }
        return this.mapToResponseDto(media);
    }
    async findByUserId(userId) {
        const media = await this.mediaRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
        return media.map(this.mapToResponseDto);
    }
    mapToResponseDto(media) {
        return {
            id: media.id,
            filename: media.filename,
            originalname: media.originalname,
            mimetype: media.mimetype,
            size: media.size,
            type: media.type,
            url: media.url,
            duration: media.duration,
            thumbnail: media.thumbnail,
            user_id: media.user_id,
            created_at: media.created_at,
            updated_at: media.updated_at,
        };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], MediaService);
//# sourceMappingURL=media.service.js.map