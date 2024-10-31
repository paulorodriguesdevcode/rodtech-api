import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/user/services';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        const user = await this.userService.findOneByEmail(decoded.email);
        req['user'] = user;
      } catch (error) {
        console.error(error);
      }
    }
    next();
  }
}
