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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { User } from './users.decorator';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

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
      console.log("REQUESTING user data for: " + user.email);
      return user;
    } else {
      // console.log('User not logged')
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
    @Body() updateUserDto: UpdateUserDto
  ) {
    if (user) {
      console.log("UPDATING user data for: " + user.email);
      return new UserEntity(await this.usersService.update(user.id, updateUserDto));
    } else {
      throw new Error("USERS ERROR: No user found to update (updateMe())");
    }
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
  ) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }
}
