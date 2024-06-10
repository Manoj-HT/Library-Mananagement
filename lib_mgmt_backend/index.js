const express = require("express");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { DataStore } = require("./dataStore");
const app = express();
const port = process.env.PORT;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const peopleStore = new DataStore("people.json");
const bookStore = new DataStore("books.json");
const collectionStore = new DataStore("collections.json");

const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authorizationHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const apis = {
  login: "/login",
  updateLoginStatus: "/update-login-status",
  createUser: "/create-user",
  usersList: "/users-list",
  adminList: "/admin-list",
  user: "/user",
  usersByIdList : "/users-by-id-list",
  updateUser: "/update-user",
  createBook: "/create-book",
  booksList: "/books-list",
  book: "/book",
  booksByIdList : "/books-by-id-list",
  partialSearchByName: "/partial-search-by-name",
  updateBook: "/update-book",
  bookContent: "/book-content",
  updateBookContent: "/update-book-content",
  bookByPageNumber: "/book-by-page-number",
  singlePageByPageNumber : "/single-page-by-page-number",
  createCollection: "/create-collection",
  collectionsList: "/collections-list",
  collection: "/collection",
  updateCollection: "/update-collection",
  mapBookToUser: "/map-book-to-user",
};

function prepareBookToSend(book) {
  let borrowedBy = peopleStore.getByIdList(book.borrowedBy);
  for (let person of borrowedBy) {
    delete person.books;
  }
  return {
    ...book,
    borrowedBy,
  };
}

function preparePersonToSend(person) {
  let books = bookStore.getByIdList(...person.books);
  for (let book of books) {
    delete book.pages;
    delete book.borrowedBy;
    delete book.bookmarks
  }
  return {
    ...person,
    books,
  };
}

app.post(apis.login, (req, res) => {
  const cred = {
    email: req.body.email,
    password: req.body.password,
  };
  let usersArray = peopleStore.getAllInArray();
  let person = usersArray.find(
    (person) => person.email === cred.email && person.password === cred.password
  );
  if (person == undefined) {
    res.send({ message: "user not present" });
  } else {
    let data = {
      time: Date(),
      userId: person.id,
    };
    const token = jwt.sign(data, jwtSecretKey);
    res.send({
      ...preparePersonToSend(person),
      token,
    });
  }
});

app.put(apis.updateLoginStatus, authMiddleware, (req, res) => {
  let id = req.query.id;
  let person = peopleStore.getById(id);
  if (person != undefined) {
    person = {
      ...person,
      lastLogin: new Date(),
    };
    peopleStore.save();
    res.send({ message: "last login registered" });
  } else {
    res.statusCode(401);
    res.send({ message: "unauthorised" });
  }
});

app.post(apis.createUser, authMiddleware, (req, res) => {
  let person = req.body;
  let id = peopleStore.getSize();
  person = {
    ...person,
    id,
    createdDate: new Date(),
    updatedDate: new Date(),
    lastLogin: new Date(),
    books: []
  };
  peopleStore.create(id, person);
  peopleStore.save();
  res.send(person);
});

app.get(apis.usersList, authMiddleware, (req, res) => {
  let peopleArray = peopleStore.getAllInArray()
  for(let person of peopleArray){
    person = {
      ...preparePersonToSend(person)
    }
  }
  res.send(peopleArray);
});

app.get(apis.adminList, authMiddleware, (req, res) => {
  let usersArray = peopleStore.getAllInArray();
  let adminList = usersArray.filter((person) => person.role === "admin");
  for(let admin of adminList){
    admin = {...preparePersonToSend(admin)}
  }
  res.send(adminList);
});

app.get(apis.user, authMiddleware, (req, res) => {
  let id = res.query.id;
  let person = peopleStore.getById(id);
  if (person == undefined) {
    res.send({ message: `${req.query.id} not present` });
  } else {
    res.send(preparePersonToSend(person));
  }
});

app.put(apis.updateUser, authMiddleware, (req, res) => {
  let id = req.query.id;
  let person = peopleStore.getById(id);
  let body = req.body;
  if (!person) {
    res.send("user not present");
  } else {
    peopleStore.update(id, {
      ...person,
      ...body,
      updatedDate: new Date(),
    });
    peopleStore.save();
    res.send(preparePersonToSend(person));
  }
});

app.delete(apis.user, authMiddleware, (req, res) => {
  let id = req.query.id;
  peopleStore.delete(id);
  peopleStore.save();
  res.send({ message: "deleted" });
});

app.post(apis.createBook, authMiddleware, (req, res) => {
  let book = req.body;
  let id = bookStore.getSize();
  bookStore.create(id, {
    ...book,
    id,
    createdDate: new Date(),
    updatedDate: new Date(),
    pages: [],
    borrowedBy: [],
    offShelf: false,
    borrowedDate : "",
    studiedState : "",
    bookmarks : [],
    views : 0
  });
  bookStore.save();
  res.send(book);
});

app.get(apis.booksList, authMiddleware, (req, res) => {
  let bookArray = bookStore.getAllInArray();
  for(let book of bookArray){
    book = {
      ...prepareBookToSend(book)
    }
  }
  res.send(bookArray);
});

app.get(apis.book, authMiddleware, (req, res) => {
  let id = req.query.id;
  let book = bookStore.getById(id);
  res.send(book);
});

app.post(apis.booksByIdList, authMiddleware, (req, res) => {
  let idList = req.body.idList
  let bookArray = bookStore.getByIdList(...idList)
  for(let book of bookArray){
    book = {
      ...prepareBookToSend(book)
    }
  }
  res.send(bookArray)
})

app.post(apis.usersByIdList, authMiddleware, (req, res) => {
  let idList = req.body.idList
  let peopleArray = peopleStore.getByIdList(...idList)
  for(let person in peopleArray){
    person = {
      ...preparePersonToSend(person)
    }
  }
  res.send(peopleArray)
})

app.put(apis.updateBook, authMiddleware, (req, res) => {
  let id = req.query.id;
  let book = bookStore.getById(id);
  let body = req.body;
  if (book) {
    bookStore.update(id, {
      ...book,
      ...body,
    });
  } else {
    res.send("No book present");
  }
  bookStore.save();
  res.send(prepareBookToSend(book));
});

app.delete(apis.book, authMiddleware, (req, res) => {
  let id = req.query.id;
  bookStore.delete(id);
  res.send({ message: "Deleted Successfully" });
  bookStore.save();
});

app.get(apis.bookContent, authMiddleware, (req, res) => {
  let id = req.query.id;
  let book = bookStore.getById(id);
  let text = book.pages.join(" ");
  res.send({ text });
});

app.put(apis.updateBookContent, authMiddleware, (req, res) => {
  let request = {
    id: req.body.id,
    text: req.body.text,
  };
  let book = bookStore.getById(request.id);
  bookStore.update(request.id, {
    ...book,
    pages: request.text,
  });
  res.send({ message: "updated successfully" });
  bookStore.save();
});

function splitContentIntoChunks(text, size) {
  let textArr = text.split(" ");
  let finalArray = [];
  do {
    let splicedArray = textArr.splice(0, size ? size : 149);
    let text = splicedArray.join(" ");
    finalArray.push(text);
  } while (textArr.length != 0);
  return finalArray;
}

app.get(apis.bookByPageNumber, authMiddleware, (req, res) => {
  let query = {
    bookId: req.query.bookId,
    firstPage: req.query.firstPage,
    secondPage: req.query.secondPage,
    size: req.query.size,
  };
  let book = bookStore.getById(query.bookId);
  let pages = splitContentIntoChunks(book.pages, query.size);
  let response = {
    page1: pages[query.firstPage],
    page2: pages[query.secondPage],
  };
  res.send(response);
});

app.get(apis.singlePageByPageNumber, authMiddleware, (req, res) => {
  let query = {
    bookId: req.query.bookId,
    pageNumber: req.query.firstPage,
    size: req.query.size,
  };
  let book = bookStore.getById(query.bookId);
  let pages = splitContentIntoChunks(book.pages, query.size);
  let response = {
    pageContent: pages[query.pageNumber],
  };
  res.send(response);
});

app.post(apis.createCollection, authMiddleware, (req, res) => {
  let collection = req.body;
  let id = collectionStore.getSize();
  collectionStore.create(id, { id, ...collection });
  res.send({ message: "created succesfully" });
  collectionStore.save();
});

app.get(apis.collectionsList, authMiddleware, (req, res) => {
  let collectionArray = collectionStore.getAllInArray();
  for(let collection of collectionArray){
    let books = bookStore.getByIdList(collection.books)
    for(let book of books){
      book = {
        ...prepareBookToSend(book)
      }
    }
    collection = {
      ...collection,
      books
    }
  }
  res.send(collectionArray);
});

app.get(apis.collection, authMiddleware, (req, res) => {
  let id = req.query.id;
  let collection = collectionStore.getById(id);
  let books = bookStore.getByIdList(collection.books)
    for(let book of books){
      book = {
        ...prepareBookToSend(book)
      }
    }
    collection = {
      ...collection,
      books
    }
  res.send(collection);
});

app.put(apis.updateCollection, authMiddleware, (req, res) => {
  let id = req.query.id;
  let collectionData = req.body;
  let collection = collectionStore.getById(id);
  collectionStore.update(id, { ...collection, ...collectionData });
  collectionStore.save();
  res.send({ message: "collection updated successfully" });
});

app.delete(apis.collection, authMiddleware, (req, res) => {
  let id = req.query.id;
  collectionStore.delete(id);
  collectionStore.save();
  res.send({ message: "deleted succesfully" });
});

app.get(apis.partialSearchByName, authMiddleware, (req, res) => {
  let bookTitle = req.query.search;
  let bookArr = bookStore
    .getAllInArray()
    .filter((book) => book.title.includes(bookTitle));
  res.send(bookArr);
});

app.get(apis.mapBookToUser, authMiddleware, (req, res) => {
  const personId = req.query.userId;
  const bookId = req.query.bookId;
  let book = bookStore.getById(bookId);
  let person = bookStore.getById(personId);
  book = {
    ...book,
    borrowedBy: [...book.borrowedBy, personId],
    offShelf: true,
    borrowedDate: new Date(),
    studiedState: 0,
    views: book.views + 1,
  };
  person = {
    ...person,
    books: [...person.books, bookId],
  };
  bookStore.update(bookId, book);
  peopleStore.update(personId, person);
  res.send(prepareBookToSend(book));
  bookStore.save();
  peopleStore.save();
});

app.listen(port, () => {
  console.log("server Running");
});
