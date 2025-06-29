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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const media_entity_1 = require("../entities/media.entity");
class MediaResponseDto {
}
exports.MediaResponseDto = MediaResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The unique identifier of the media',
    }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1234567890-image.jpg',
        description: 'The generated filename',
    }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'image.jpg',
        description: 'The original filename',
    }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "originalname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'image/jpeg',
        description: 'The MIME type of the file',
    }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "mimetype", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1024,
        description: 'The size of the file in bytes',
    }),
    __metadata("design:type", Number)
], MediaResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: media_entity_1.MediaType,
        example: media_entity_1.MediaType.IMAGE,
        description: 'The type of media (image or video)',
    }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'http://localhost:3000/uploads/images/1234567890-image.jpg',
        description: 'The URL to access the media',
    }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 120,
        description: 'The duration of the video in seconds (for videos only)',
        required: false,
    }),
    __metadata("design:type", Number)
], MediaResponseDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'http://localhost:3000/uploads/thumbnails/1234567890-thumb.jpg',
        description: 'The URL to the thumbnail (for videos only)',
        required: false,
    }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the user who uploaded the media',
    }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-20T12:00:00Z',
        description: 'The date when the media was uploaded',
    }),
    __metadata("design:type", Date)
], MediaResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-20T12:00:00Z',
        description: 'The date when the media was last updated',
    }),
    __metadata("design:type", Date)
], MediaResponseDto.prototype, "updated_at", void 0);
//# sourceMappingURL=media-response.dto.js.map