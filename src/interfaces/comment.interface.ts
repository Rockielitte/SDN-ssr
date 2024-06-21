import { Member } from "./member.interface";

export interface Comment {
  rating: number;
  content: string;
  author: string | Member;
}