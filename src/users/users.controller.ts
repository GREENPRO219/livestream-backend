import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException, ForbiddenException, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [UserResponseDto] })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: UserResponseDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('avatar')
  @ApiOperation({ summary: 'Set user avatar from uploaded media' })
  @ApiBody({
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
  })
  @ApiOkResponse({ type: UserResponseDto })
  async setAvatar(@Request() req, @Body('avatar') avatar: string) {
    if (!req.user?.id) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!avatar || typeof avatar !== 'string') {
      throw new BadRequestException('Valid avatar URL is required');
    }

    // Basic URL validation
    if (!avatar.startsWith('/uploads/')) {
      throw new BadRequestException('Invalid avatar URL format');
    }

    const updatedUser = await this.usersService.update(req.user.id, { avatar });
    return updatedUser;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: UserResponseDto })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    // Only allow users to update their own profile
    if (req.user?.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: UserResponseDto })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req
  ) {
    // Only allow users to delete their own account
    if (req.user?.id !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    
    return this.usersService.remove(id);
  }
} 