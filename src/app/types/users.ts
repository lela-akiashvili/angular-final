import { News } from "./news";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  password: string;
  avatar?: string;
  userType: string;
  role?: string;
  team?: string;
  experience?: string;
  position?: string;
  id?: string;
  favourites:News[];
}
