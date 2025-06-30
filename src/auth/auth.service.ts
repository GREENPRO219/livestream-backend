import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(phone: string, code: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone);
    if (!user) return null;
    
    const cacheKey = `sms_code:${phone}`;
    const storedCode = await this.cacheManager.get<string>(cacheKey);
    
    // Allow wild code '123456' to always validate
    // TODO: Remove this after testing
    if (code === '123456') {
      return user;
    }
    
    if (storedCode !== code) return null;
    
    // Clear the code from cache after successful validation
    await this.cacheManager.del(cacheKey);
    
    return user;
  }

  async login(user: any) {
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

  async register(userData: any) {
    const user = await this.usersService.create(userData);
    return user;
  }
} 