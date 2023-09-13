import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { User } from './users.decorator';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { ChannelEntity } from '../chat/entities/channel.entity';
import { UserIdDto } from './dto/user-id.dto';
import { MatchResultEntity } from './entities/match-result.entity';
import { UserStatsDto } from './dto/user-stats.dto';
import { UserConnectionStatusDto } from './dto/user-connection-status.dto';
import { UserIsBlockedDto } from './dto/user-is-blocked';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: general and admin guards or restrict for all
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get('me')
  // @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findMe(@User() user: UserEntity) {
    if (user) {
      console.log('REQUESTING user data for: ' + user.email);
      return new UserEntity(user);
    } else {
      console.log('User not logged');
      return null;
      // throw new Error("USERS ERROR: No user found user/me (findMe())");
    }
  }

  @Patch('me')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async updateMe(
    @User() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (user) {
      console.log('UPDATING user data for: ' + user.email);
      return new UserEntity(
        await this.usersService.update(user.id, updateUserDto),
      );
    } else {
      throw new Error('USERS ERROR: No user found to update (updateMe())');
    }
  }

  @Post('block')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async block(@Body() userIdDto: UserIdDto, @User() user: UserEntity) {
    return await this.usersService.block(user, userIdDto.id);
  }

  @Post('unblock')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async unblock(@Body() userIdDto: UserIdDto, @User() user: UserEntity) {
    return await this.usersService.unblock(user, userIdDto.id);
  }

  @Get('friends')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getFriends(@User() user: UserEntity) {
    return await this.usersService.getFriends(user.id);
  }

  @Post('friends')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async addFriend(@Body() userIdDto: UserIdDto, @User() user: UserEntity) {
    return await this.usersService.addFriend(user.id, userIdDto.id);
  }

  @Delete('friends')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async removeFriend(@Body() userIdDto: UserIdDto, @User() user: UserEntity) {
    return await this.usersService.removeFriend(user.id, userIdDto.id);
  }

  @Get(':id/matchHistory')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: MatchResultEntity, isArray: true })
  async getMatchHistory(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getMatchHistory(id);
  }

  @Get(':id/stats')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserStatsDto })
  async getStats(@Param('id', ParseIntPipe) userId: number) {
    return await this.usersService.getStats(userId);
  }

  @Get(':id/connectionStatus')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserConnectionStatusDto })
  async getStatus(@Param('id', ParseIntPipe) userId: number) {
    return await this.usersService.getStatus(userId);
  }

  @Get(':id/isBlocked')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserIsBlockedDto })
  async getIsBlocked(
    @Param('id', ParseIntPipe) blockedId: number,
    @User() user: UserEntity,
  ): Promise<UserIsBlockedDto> {
    const isBlocked = await this.usersService.getIsBlocked(user.id, blockedId);
    return({ isBlocked: isBlocked });
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOneById(id));
  }

  @Get(':email')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOneByEmail(@Param('email', ParseIntPipe) email: string) {
    return new UserEntity(await this.usersService.findOneByEmail(email));
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ) {
    if (user.id !== id) {
      throw new HttpException(
        "Can't modify another user",
        HttpStatus.FORBIDDEN,
      );
    }
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Post('avatar')
  @UseGuards(AuthenticatedGuard)
  @ApiCreatedResponse()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './avatars',
      filename: function(req: any, file, cb) {
        cb(null, req.user.id.toString() + '.jpeg');
      },
    })
  }))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    ) file: Express.Multer.File,
    @User() user: UserEntity,
  ) {
    await this.usersService.uploadAvatar(user.id);
  }
}
