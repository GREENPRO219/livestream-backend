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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const register_dto_1 = require("./dto/register.dto");
const confirm_code_dto_1 = require("./dto/confirm-code.dto");
const send_code_dto_1 = require("./dto/send-code.dto");
const public_decorator_1 = require("./decorators/public.decorator");
const sms_service_1 = require("./sms.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const login_dto_1 = require("./dto/login.dto");
const send_code_dto_2 = require("./dto/send-code.dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const memoryCache = new Map();
let AuthController = class AuthController {
    constructor(authService, smsService, cacheManager) {
        this.authService = authService;
        this.smsService = smsService;
        this.cacheManager = cacheManager;
    }
    async setCache(key, value, ttl = 300000) {
        try {
            await this.cacheManager.set(key, value, ttl);
        }
        catch (error) {
            const expiry = Date.now() + (ttl * 1000);
            memoryCache.set(key, { value, expiry });
        }
    }
    async getCache(key) {
        try {
            const value = await this.cacheManager.get(key);
            return value;
        }
        catch (error) {
            const item = memoryCache.get(key);
            if (item && item.expiry > Date.now()) {
                return item.value;
            }
            else if (item) {
                memoryCache.delete(key);
            }
            return undefined;
        }
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async confirmCode(confirmCodeDto) {
        if (!confirmCodeDto.code) {
            throw new common_1.UnauthorizedException('Verification code is required');
        }
        const user = await this.authService.validateUser(confirmCodeDto.phone, confirmCodeDto.code);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
    async getProfile(req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        return req.user;
    }
    async sendCode(sendCodeDto) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const cacheKey = `sms_code:${sendCodeDto.phone}`;
        await this.setCache(cacheKey, code);
        const sent = await this.smsService.sendCode(sendCodeDto.phone, code);
        if (sent) {
            return { message: 'Code sent', code };
        }
        else {
            throw new common_1.InternalServerErrorException('Failed to send SMS');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiCreatedResponse)({ type: user_response_dto_1.UserResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('confirm-code'),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm SMS verification code and login user',
        description: 'Verify SMS code and login user'
    }),
    (0, swagger_1.ApiOkResponse)({ type: login_dto_1.AuthResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_code_dto_1.ConfirmCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmCode", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiOkResponse)({ type: user_response_dto_1.UserResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('send-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Send verification code via SMS' }),
    (0, swagger_1.ApiOkResponse)({ type: send_code_dto_2.SendCodeResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_code_dto_1.SendCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendCode", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        sms_service_1.SmsService, Object])
], AuthController);
//# sourceMappingURL=auth.controller.js.map