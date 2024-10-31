import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { IAuth } from '../dto/IAuth';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(200)
  login(@Body() user: IAuth) {
    return this.authService.login(user);
  }
}
