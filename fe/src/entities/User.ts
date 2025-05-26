export interface User {
  id: number;
  username: string;
  email: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
}