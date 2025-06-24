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
exports.Favorite = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const room_entity_1 = require("../../rooms/entities/room.entity");
const media_entity_1 = require("../../media/entities/media.entity");
let Favorite = class Favorite {
};
exports.Favorite = Favorite;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Favorite.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Favorite.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Favorite.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Favorite.prototype, "room_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], Favorite.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Favorite.prototype, "media_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => media_entity_1.Media),
    (0, typeorm_1.JoinColumn)({ name: 'media_id' }),
    __metadata("design:type", media_entity_1.Media)
], Favorite.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Room', 'Media'],
        default: 'Media'
    }),
    __metadata("design:type", String)
], Favorite.prototype, "content_type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Favorite.prototype, "created_at", void 0);
exports.Favorite = Favorite = __decorate([
    (0, typeorm_1.Entity)('favorites')
], Favorite);
//# sourceMappingURL=favorite.entity.js.map