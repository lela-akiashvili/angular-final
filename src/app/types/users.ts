export interface User {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  password: string;
  src?: string;
  userType: 'regularUser'|'TeamMember';
  role?: string;
  team: string;
  experience?: string;
  position?: string;
  id?: string;
  favorites?:string[];
}
