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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const media_service_1 = require("./media.service");
const media_response_dto_1 = require("./dto/media-response.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const multer_1 = require("multer");
const fs = require("fs");
const path = require("path");
let MediaController = class MediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
        this.ensureUploadDirectories();
    }
    ensureUploadDirectories() {
        const directories = ['./uploads', './uploads/avatars', './uploads/images'];
        directories.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    async uploadFile(file, req) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const type = req.body?.type;
        const allowedTypes = ['avatar'];
        const uploadType = allowedTypes.includes(type) ? type : undefined;
        console.log('Request body:', req.body);
        console.log('Type from body:', type);
        console.log('Upload type:', uploadType);
        if (uploadType === 'avatar') {
            const oldPath = file.path;
            const newPath = path.join('./uploads/avatars', path.basename(file.filename));
            try {
                fs.renameSync(oldPath, newPath);
                file.path = newPath;
                console.log(`File moved from ${oldPath} to ${newPath}`);
            }
            catch (error) {
                console.error('Error moving file:', error);
                throw new common_1.BadRequestException('Failed to process avatar upload');
            }
        }
        this.mediaService.validateFileType(file.mimetype);
        return this.mediaService.createMediaRecord(file, req.user.id, undefined, undefined, uploadType);
    }
    async findAll() {
        return this.mediaService.findAll();
    }
    async findOne(id) {
        return this.mediaService.findOne(id);
    }
    async findByUserId(userId) {
        if (!userId) {
            return [];
        }
        return this.mediaService.findByUserId(userId);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('jwt_auth'),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                cb(null, './uploads/images');
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            },
        }),
        limits: {
            fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 500 * 1024 * 1024,
        },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a media file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                type: {
                    type: 'string',
                    description: 'Type of the media (avatar)',
                    enum: ['avatar'],
                    example: 'avatar',
                },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: media_response_dto_1.MediaResponseDto }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadFile", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all media files' }),
    (0, swagger_1.ApiOkResponse)({ type: [media_response_dto_1.MediaResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get media file by id' }),
    (0, swagger_1.ApiOkResponse)({ type: media_response_dto_1.MediaResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all media files for a specific user' }),
    (0, swagger_1.ApiOkResponse)({ type: [media_response_dto_1.MediaResponseDto] }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe({ version: '4', optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "findByUserId", null);
exports.MediaController = MediaController = __decorate([
    (0, swagger_1.ApiTags)('Media'),
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map