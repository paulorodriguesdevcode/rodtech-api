export class UserDTO {
  id?: string;
  name: string;
  email: string;
  roles: string[];
  password: string;

  constructor(id: string, name: string, email: string, roles: string[]) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.roles = roles;
  }
}
