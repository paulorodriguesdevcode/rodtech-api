import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UsersService } from './services';
import { UserRepository } from './repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../config/database/schemas/user';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UsersService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
