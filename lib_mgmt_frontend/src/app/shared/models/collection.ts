import { Book } from "./book";

export type Collection = {
    id : string,
    name : string;
    books : Book[]
}