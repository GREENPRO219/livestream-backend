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
exports.RoomMembersDto = exports.RoomMemberDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RoomMemberDto {
}
exports.RoomMemberDto = RoomMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Member ID' }),
    __metadata("design:type", String)
], RoomMemberDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe', description: 'Username' }),
    __metadata("design:type", String)
], RoomMemberDto.prototype, "username", void 0);
class RoomMembersDto {
}
exports.RoomMembersDto = RoomMembersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RoomMemberDto] }),
    __metadata("design:type", Array)
], RoomMembersDto.prototype, "members", void 0);
//# sourceMappingURL=room-members.dto.js.map