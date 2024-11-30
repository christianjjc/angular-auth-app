import { UserI } from './user.interface';

export interface LoginResponseI {
  user: UserI;
  token: string;
}
