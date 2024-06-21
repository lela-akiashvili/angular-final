import { Timestamp } from "firebase/firestore";

export interface News {
  src: string | null;
  about: string[] | null;
  text: string | null;
  date: Date|Timestamp;
  title: string | null;
  id?: string | null;
  userId: string|null;
}
