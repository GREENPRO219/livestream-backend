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
        const existingCode = await this.getCache(cacheKey);
        await this.setCache(cacheKey, code);
        const storedCode = await this.getCache(cacheKey);
        const sent = await this.smsService.sendCode(sendCodeDto.phone, code);
        if (sent) {
            return { message: 'Code sent', code };
        }
        else {
            throw new common_1.InternalServerErrorException('Failed to send SMS');
        }
    }
    async testCacheGet(key) {
        const value = await this.getCache(key);
        return { key, value, exists: value !== undefined };
    }
    async testCacheSet(key, body) {
        const { value, ttl = 300 } = body;
        try {
            await this.setCache(key, value, ttl);
            const storedValue = await this.getCache(key);
            return {
                key,
                value,
                stored: storedValue,
                success: storedValue === value
            };
        }
        catch (error) {
            return {
                key,
                value,
                stored: null,
                success: false,
                error: error.message
            };
        }
    }
    async cacheHealth() {
        const testKey = 'health-test';
        const testValue = 'test-value-' + Date.now();
        try {
            await this.setCache(testKey, testValue, 60);
            const retrievedValue = await this.getCache(testKey);
            const canSet = true;
            const canGet = retrievedValue === testValue;
            return {
                status: canGet ? 'healthy' : 'unhealthy',
                canSet,
                canGet,
                testKey,
                testValue,
                retrievedValue,
            };
        }
        catch (error) {
            return {
                status: 'error',
                canSet: false,
                canGet: false,
                error: error.message,
            };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully' }),
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
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User logged in successfully',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                        username: { type: 'string', example: 'johndoe' },
                        fullname: { type: 'string', example: 'John Doe' },
                        phone: { type: 'string', example: '+1234567890' },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_code_dto_1.ConfirmCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmCode", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('send-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Send verification code via SMS' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification code sent successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Code sent' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Failed to send SMS',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Failed to send SMS' },
                error: { type: 'string', example: 'Internal Server Error' },
                statusCode: { type: 'number', example: 500 },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_code_dto_1.SendCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendCode", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('test-cache/:key'),
    (0, swagger_1.ApiOperation)({ summary: 'Test cache functionality - Get value' }),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Cache key to retrieve', example: 'sms_code:+1234567890' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cache value retrieved',
        schema: {
            type: 'object',
            properties: {
                key: { type: 'string', example: 'sms_code:+1234567890' },
                value: { type: 'string', example: '123456' },
                exists: { type: 'boolean', example: true },
            },
        },
    }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testCacheGet", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('test-cache/:key'),
    (0, swagger_1.ApiOperation)({ summary: 'Test cache functionality - Set value' }),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Cache key to set', example: 'sms_code:+1234567890' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cache value set successfully',
        schema: {
            type: 'object',
            properties: {
                key: { type: 'string', example: 'sms_code:+1234567890' },
                value: { type: 'string', example: '123456' },
                stored: { type: 'string', example: '123456' },
                success: { type: 'boolean', example: true },
            },
        },
    }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testCacheSet", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('cache-health'),
    (0, swagger_1.ApiOperation)({ summary: 'Check cache health and functionality' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cache health check result',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'healthy' },
                canSet: { type: 'boolean', example: true },
                canGet: { type: 'boolean', example: true },
                testKey: { type: 'string', example: 'health-test' },
                testValue: { type: 'string', example: 'test-value' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "cacheHealth", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        sms_service_1.SmsService, Object])
], AuthController);
//# sourceMappingURL=auth.controller.js.map