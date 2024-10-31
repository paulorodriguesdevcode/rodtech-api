import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guards';
import { UserDTO } from '../dtos';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

@Controller('users')
@Roles('administrator')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<UserDTO[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDTO | null> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: UserDTO): Promise<any> {
    return this.usersService.update({ id, user });
  }

  @Post()
  create(@Body() user: UserDTO): Promise<UserDTO | null> {
    return this.usersService.create(user);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
