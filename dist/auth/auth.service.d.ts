import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Cache } from 'cache-manager';
export declare class AuthService {
    private usersService;
    private jwtService;
    private cacheManager;
    constructor(usersService: UsersService, jwtService: JwtService, cacheManager: Cache);
    validateUser(phone: string, code: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            fullname: any;
            phone: any;
        };
    }>;
    register(userData: any): Promise<import("../users/entities/user.entity").User>;
}
