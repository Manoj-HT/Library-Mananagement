import { Book } from "./book";

export type Person = {
  id: string;
  name: string;
  email: string;
  password: string;
  books: Book[];
  createdDate: Date;
  updatedDate: Date;
  lastLogin: Date;
  profilePicture: string;
  gender: 'male' | 'female' | 'other';
  role: Role;
};
export const usersList : Person[] =[]

export type Role = "admin" | "reader"