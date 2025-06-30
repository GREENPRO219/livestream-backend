import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { SmsService } from './sms.service';
import { Cache } from 'cache-manager';
export declare class AuthController {
    private authService;
    private smsService;
    private cacheManager;
    constructor(authService: AuthService, smsService: SmsService, cacheManager: Cache);
    private setCache;
    private getCache;
    register(registerDto: RegisterDto): Promise<import("../users/entities/user.entity").User>;
    confirmCode(confirmCodeDto: ConfirmCodeDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            fullname: any;
            phone: any;
            avatar: any;
        };
    }>;
    getProfile(req: any): Promise<any>;
    sendCode(sendCodeDto: SendCodeDto): Promise<{
        message: string;
        code: string;
    }>;
}
