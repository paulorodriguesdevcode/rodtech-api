import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDTO, UserDTO } from '../dtos';
import { User, UserDocument } from 'src/config/database/schemas/user';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findAll(): Promise<User[]> {
    return await this.userModel
      .find()
      .sort({ name: 1 })
      .lean()
      .select('-password')
      .exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).lean().exec();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').lean().exec();
  }

  async create(createUserDto: UserDTO): Promise<User> {
    return new this.userModel(createUserDto).save();
  }

  async update(dto: UpdateUserDTO): Promise<User> {
    const { id, user } = dto;

    const existingUser = await this.userModel.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(existingUser, user);
    return existingUser.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ id }).lean().exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
