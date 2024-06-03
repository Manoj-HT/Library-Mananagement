import { Person } from './person';

export type Book = {
  title: string;
  author: Person;
  coverImage: string;
  offShelf: boolean;
  createdDate: string;
  updatedDate: string;
  borrowedDate: string;
  studiedState: number;
  id: string;
  borrowedBy: Person[];
  pages: string[];
  bookmarks: number[];
  views: number;
  genre: string;
  shortDescription: string;
};
export const booksList: Book[] = [];

export const usersData = [];
