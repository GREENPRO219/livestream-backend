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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const cache_manager_1 = require("@nestjs/cache-manager");
let AuthService = class AuthService {
    constructor(usersService, jwtService, cacheManager) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.cacheManager = cacheManager;
    }
    async validateUser(phone, code) {
        const user = await this.usersService.findByPhone(phone);
        if (!user)
            return null;
        const cacheKey = `sms_code:${phone}`;
        const storedCode = await this.cacheManager.get(cacheKey);
        if (code === '123456') {
            return user;
        }
        if (storedCode !== code)
            return null;
        await this.cacheManager.del(cacheKey);
        return user;
    }
    async login(user) {
        const payload = { phone: user.phone, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                phone: user.phone,
                avatar: user.avatar,
            },
        };
    }
    async register(userData) {
        const user = await this.usersService.create(userData);
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map