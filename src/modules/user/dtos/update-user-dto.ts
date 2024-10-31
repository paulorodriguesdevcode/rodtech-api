import { UserDTO } from './user-dto';

export class UpdateUserDTO {
  id: string;
  user: Partial<UserDTO>;
}
