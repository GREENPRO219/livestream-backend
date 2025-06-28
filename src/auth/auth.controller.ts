import { Controller, Post, Body, Get, Request, UnauthorizedException, InternalServerErrorException, Inject, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiParam, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { Public } from './decorators/public.decorator';
import { SmsService } from './sms.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthResponseDto } from './dto/login.dto';
import { SendCodeResponseDto } from './dto/send-code.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

// Simple in-memory cache fallback
const memoryCache = new Map<string, { value: any; expiry: number }>();

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private smsService: SmsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Helper method to use fallback cache if main cache fails
  private async setCache(key: string, value: any, ttl: number = 300000): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      const expiry = Date.now() + (ttl * 1000); // Convert ttl from seconds to milliseconds
      memoryCache.set(key, { value, expiry });
    }
  }

  private async getCache(key: string): Promise<any> {
    try {
      const value = await this.cacheManager.get(key);
      return value;
    } catch (error) {
      const item = memoryCache.get(key);
      if (item && item.expiry > Date.now()) {
        return item.value;
      } else if (item) {
        memoryCache.delete(key); // Remove expired item
      }
      return undefined;
    }
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('confirm-code')
  @ApiOperation({ 
    summary: 'Confirm SMS verification code and login user',
    description: 'Verify SMS code and login user'
  })
  @ApiOkResponse({ type: AuthResponseDto })
  async confirmCode(@Body() confirmCodeDto: ConfirmCodeDto) {
    // Code is required for login
    if (!confirmCodeDto.code) {
      throw new UnauthorizedException('Verification code is required');
    }
    
    // Verify code and login
    const user = await this.authService.validateUser(confirmCodeDto.phone, confirmCodeDto.code);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  async getProfile(@Request() req) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return req.user;
  }

  @Public()
  @Post('send-code')
  @ApiOperation({ summary: 'Send verification code via SMS' })
  @ApiOkResponse({ type: SendCodeResponseDto })
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const cacheKey = `sms_code:${sendCodeDto.phone}`;
    
    // Test cache before storing
    const existingCode = await this.getCache(cacheKey);
    
    // Store the code
    await this.setCache(cacheKey, code);
    
    // Verify the code was stored immediately
    const storedCode = await this.getCache(cacheKey);
    
    const sent = await this.smsService.sendCode(sendCodeDto.phone, code);
    
    if (sent) {
      return { message: 'Code sent', code };
    } else {
      throw new InternalServerErrorException('Failed to send SMS');
    }
  }

  @Public()
  @Get('test-cache/:key')
  @ApiOperation({ summary: 'Test cache functionality - Get value' })
  @ApiParam({ name: 'key', description: 'Cache key to retrieve', example: 'sms_code:+1234567890' })
  async testCacheGet(@Param('key') key: string) {
    const value = await this.getCache(key);
    
    return { key, value, exists: value !== undefined };
  }

  @Public()
  @Post('test-cache/:key')
  @ApiOperation({ summary: 'Test cache functionality - Set value' })
  @ApiParam({ name: 'key', description: 'Cache key to set', example: 'sms_code:+1234567890' })
  async testCacheSet(@Param('key') key: string, @Body() body: { value: string; ttl?: number }) {
    const { value, ttl = 300 } = body;
    
    try {
      await this.setCache(key, value, ttl);
      
      // Verify it was stored
      const storedValue = await this.getCache(key);
      
      return { 
        key, 
        value, 
        stored: storedValue,
        success: storedValue === value 
      };
    } catch (error) {
      return { 
        key, 
        value, 
        stored: null,
        success: false,
        error: error.message 
      };
    }
  }

  @Public()
  @Get('cache-health')
  @ApiOperation({ summary: 'Check cache health and functionality' })
  async cacheHealth() {
    const testKey = 'health-test';
    const testValue = 'test-value-' + Date.now();
    
    try {
      // Test set
      await this.setCache(testKey, testValue, 60);
      
      // Test get
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
    } catch (error) {
      return {
        status: 'error',
        canSet: false,
        canGet: false,
        error: error.message,
      };
    }
  }
} 