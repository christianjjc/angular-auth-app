import { UserI } from './user.interface';

export interface CheckTokenResponseI {
  user: UserI;
  token: string;
}
