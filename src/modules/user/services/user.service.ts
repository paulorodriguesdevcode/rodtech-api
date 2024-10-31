import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UtilsService } from '../../../common';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDTO, UserDTO } from '../dtos';
import { User } from 'src/config/database/schemas/user';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<any[]> {
    const users = await this.userRepository.findAll();
    return users.map(this.toUserDTO);
  }

  async findOne(id: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findOneById(id);
    return this.toUserDTO(user);
  }

  findOneByEmail(email: string): Promise<any> {
    return this.userRepository.findOneByEmail(email);
  }

  async create(user: UserDTO): Promise<UserDTO | null> {
    const userAlreadyExists = await this.userRepository.findOneByEmail(
      user.email,
    );

    if (userAlreadyExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    user.password = UtilsService.generateHash(user.password);

    const resp = await this.userRepository.create(user);

    return this.toUserDTO(resp);
  }

  async update(dto: UpdateUserDTO): Promise<UserDTO | null> {
    const user = await this.userRepository.update(dto);
    return this.toUserDTO(user);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }

  toUserDTO(user: User | null): UserDTO | null {
    return user && new UserDTO(user.id, user.name, user.email, user.roles);
  }
}
