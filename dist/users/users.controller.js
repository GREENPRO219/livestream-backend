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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_response_dto_1 = require("./dto/user-response.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async findAll() {
        return this.usersService.findAll();
    }
    async findOne(id) {
        return this.usersService.findOne(id);
    }
    async setAvatar(req, avatar) {
        if (!req.user?.id) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        if (!avatar || typeof avatar !== 'string') {
            throw new common_1.BadRequestException('Valid avatar URL is required');
        }
        if (!avatar.startsWith('/uploads/')) {
            throw new common_1.BadRequestException('Invalid avatar URL format');
        }
        const updatedUser = await this.usersService.update(req.user.id, { avatar });
        return updatedUser;
    }
    async update(id, updateUserDto, req) {
        if (req.user?.id !== id) {
            throw new common_1.ForbiddenException('You can only update your own profile');
        }
        return this.usersService.update(id, updateUserDto);
    }
    async remove(id, req) {
        if (req.user?.id !== id) {
            throw new common_1.ForbiddenException('You can only delete your own account');
        }
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user' }),
    (0, swagger_1.ApiCreatedResponse)({ type: user_response_dto_1.UserResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiOkResponse)({ type: [user_response_dto_1.UserResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({ type: user_response_dto_1.UserResponseDto }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('avatar'),
    (0, swagger_1.ApiOperation)({ summary: 'Set user avatar from uploaded media' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    example: '/uploads/media/abc123.jpg',
                    description: 'Avatar file path'
                },
            },
            required: ['avatar'],
        },
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_response_dto_1.UserResponseDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('avatar')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setAvatar", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({ type: user_response_dto_1.UserResponseDto }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({ type: user_response_dto_1.UserResponseDto }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map