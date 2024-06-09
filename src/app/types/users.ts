export interface User {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  password: string;
  avatar: string;
}

export interface TeamMember extends User {
  userType: string;
  role: string;
  team: string;
  experience: string;
  position?: string;
  id?: string;
}