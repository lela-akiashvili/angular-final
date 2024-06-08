export interface User {
  firstName: string;
  lastName:string;
  age: number;
  password: string;
  email: string;
  id: number;
  avatar: string;
}
export interface TeamMember extends User {
  team: string;
  role:string;
  position: string;
  experience: number;
}
