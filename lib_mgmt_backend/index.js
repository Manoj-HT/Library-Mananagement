const express = require("express");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require("cors");
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

let people = JSON.parse(fs.readFileSync("people.json", "utf-8"));
let books = JSON.parse(fs.readFileSync("books.json", "utf-8"));
let collections = JSON.parse(fs.readFileSync("collections.json", "utf-8"));

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

function writeToPeople() {
  fs.writeFileSync("people.json", JSON.stringify(people));
}

function writeToBook() {
  fs.writeFileSync("books.json", JSON.stringify(books));
}

function writeToCollection() {
  fs.writeFileSync("collections.json", JSON.stringify(collections));
}

app.post("/login", (req, res) => {
  const cred = {
    email: req.body.email,
    password: req.body.password,
  };
  let person = people.find(
    (person) => person.email === cred.email && person.password === cred.password
  );
  if (people == undefined) {
    res.send({ message: "user not present" });
  } else {
    let data = {
      time: Date(),
      userId: person.id,
    };
    const token = jwt.sign(data, jwtSecretKey);
    res.send({
      ...person,
      token,
    });
  }
});

app.put("/update-login-status", authMiddleware, (req, res) => {
  let id = req.query.id;
  let person = people.find((person) => String(person.id) === String(id));
  if (person != undefined) {
    person = {
      ...person,
      lastLogin: new Date(),
    };
    writeToPeople();
    res.send({ message: "last login registered" });
  } else {
    res.statusCode(401);
    res.send({ message: "unauthorised" });
  }
});

app.post("/create-user", authMiddleware, (req, res) => {
  let person = req.body;
  person = {
    ...person,
    id: people.length,
    createdDate: new Date(),
    updatedDate: new Date(),
    lastLogin: new Date(),
  };
  people.push(person);
  writeToPeople();
  res.send(person);
});

app.get("/users-list", authMiddleware, (req, res) => {
  res.send(people);
});

app.get("/admin-list", authMiddleware, (req, res) => {
  let adminList = people.filter((person) => person.role === "admin");
  res.send(adminList);
});

app.get("/user", authMiddleware, (req, res) => {
  let person = people.find((person) => {
    return String(person.id) === String(req.query.id);
  });
  if (people == undefined) {
    res.send({ message: `${req.query.id} not present` });
  } else {
    res.send(person);
  }
});

app.put("/update-user", authMiddleware, (req, res) => {
  let id = req.query.id;
  let personId = people.findIndex((person) => String(person.id) === id);
  let body = req.body;
  if (personId == -1) {
    res.send("user not present");
  } else {
    people[personId] = {
      ...people[personId],
      ...body,
      updatedDate: new Date(),
    };
    writeToPeople();
    res.send(people[personId]);
  }
});

app.delete("/user", authMiddleware, (req, res) => {
  let id = req.query.id;
  let personId = people.findIndex((person) => String(person.id) === id);
  people.splice(personId, 1);
  writeToPeople();
  res.send({ message: "deleted" });
});

app.post("/create-book", authMiddleware, (req, res) => {
  let book = req.body;
  book = {
    ...book,
    id: books.length,
    createdDate: new Date(),
    updatedDate: new Date(),
    pages: [],
    borrowedBy: [],
    offShelf: false,
  };
  books.push(book);
  writeToBook();
  res.send(book);
});

app.get("/books-list", authMiddleware, (req, res) => {
  res.send(books);
});

app.get("/book", authMiddleware, (req, res) => {
  let id = req.query.id;
  let bookId = books.findIndex((book) => String(book.id) === String(id));
  res.send(books[bookId]);
});

app.get("/partial-search-by-name", authMiddleware, (req, res) => {
  let book = books.filter();
});

app.put("/update-book", authMiddleware, (req, res) => {
  let id = req.query.id;
  let bookId = books.findIndex((book) => String(book.id) === String(id));
  let body = req.body;
  if (bookId != -1) {
    books[bookId] = {
      ...books[bookId],
      ...body,
    };
  } else {
    res.send("No book present");
  }
  writeToBook();
  res.send(books[bookId]);
});

app.delete("/book", authMiddleware, (req, res) => {
  let id = req.query.id;
  let bookId = books.findIndex((book) => String(book.id) === String(id));
  books.splice(bookId, 1);
  writeToBook();
  res.send({ message: "Deleted Successfully" });
});

app.get("/book-content", authMiddleware, (req, res) => {
  let id = req.query.id;
  let book = books.find((book) => String(book.id) === String(id));
  let text = book.pages.join(" ");
  res.send({ text });
});

app.put("/update-book-content", authMiddleware, (req, res) => {
  let request = {
    id: req.body.id,
    text: req.body.text,
  };
  let bookId = books.findIndex(
    (book) => String(book.id) === String(request.id)
  );
  let pages = splitContentIntoChunks(request.text);
  books[bookId] = {
    ...books[bookId],
    pages,
  };
  writeToBook();
  res.send({ message: "updated successfull" });
});

function splitContentIntoChunks(text) {
  let textArr = text.split(" ");
  let finalArray = [];
  do {
    let splicedArray = textArr.splice(0, 149);
    let text = splicedArray.join(" ");
    finalArray.push(text);
  } while (textArr.length != 0);
  return finalArray;
}

app.get("/book-by-page-number", authMiddleware, (req, res) => {
  let query = {
    bookId: req.query.bookId,
    firstPage: req.query.firstPage,
    secondPage: req.query.secondPage,
  };
  let book = books.find((book) => String(book.id) === String(query.bookId));
  let pages = book.pages;
  let response = {
    page1: pages[query.firstPage],
    page2: pages[query.secondPage],
  };
  res.send(response);
});

app.post("/create-collection", authMiddleware, (req, res) => {
  let collection = {
    ...req.body,
    id: collections.length,
  };
  collections.push(collection);
  writeToCollection();
  res.send({ message: "created succesfully" });
});

app.get("/collections-list", authMiddleware, (req, res) => {
  res.send(collections);
});

app.get("/collection", authMiddleware, (req, res) => {
  let id = req.query.id;
  let collection = collections.find(
    (collection) => String(collection.id) === String(id)
  );
  res.send(collection);
});

app.put("/update-collection", authMiddleware, (req, res) => {
  let id = req.query.id;
  let collectionData = req.body;
  let collectionId = collections.findIndex(
    (collection) => String(collection.id) === String(id)
  );
  collections[collectionId] = {
    ...collections[collectionId],
    ...collectionData,
  };
  writeToCollection();
  res.send({ message: "collection updated successfully" });
});

app.delete("/collection", authMiddleware, (req, res) => {
  let id = req.query.id;
  let collectionId = collections.findIndex(
    (collection) => String(collection.id) === String(id)
  );
  collections.splice(collectionId, 1);
  writeToCollection();
  res.send({ message: "deleted succesfully" });
});

app.get("/partial-search-name", authMiddleware, (req, res) => {
  let bookTitle = req.query.search;
  let bookArr = books.filter((book) => book.title.includes(bookTitle));
  res.send(bookArr);
});

app.get("/map-book-to-user", authMiddleware, (req, res) => {
  const userId = req.query.userId;
  const bookId = req.query.bookId;
  const bookIndex = books.findIndex(
    (book) => String(book.id) === String(bookId)
  );
  const userIndex = people.findIndex(
    (person) => String(person.id) === String(userId)
  );
  let book = JSON.parse(JSON.stringify(books[bookIndex]));
  let user = JSON.parse(JSON.stringify(people[userIndex]));
  const bookBorrowedIndex = book.borrowedBy.findIndex(
    (person) => String(person.id) === userId
  );
  if (bookBorrowedIndex == -1) {
    book.studiedState = 0;
    book.borrowedBy.push(JSON.parse(JSON.stringify(user)));
  } else {
    book.studiedState = 0;
    book.borrowedBy.splice(bookBorrowedIndex, 1);
    book.borrowedBy.push(JSON.parse(JSON.stringify(user)));
  }
  const personBorrowedIndex = user.books.findIndex(
    (book) => String(book.id) === String(bookId)
  );
  console.log("p", personBorrowedIndex);
  if (personBorrowedIndex == -1) {
    user.books.push(JSON.parse(JSON.stringify(book)));
  } else {
    user.books.splice(personBorrowedIndex, 1);
    user.books.push(JSON.parse(JSON.stringify(book)));
  }
  book.offShelf = true;
  console.log(book);
  console.log(user);
  books[bookIndex] = book;
  people[userIndex] = user;
  writeToBook();
  writeToPeople();
  res.send(book);
});

app.listen(port, () => {
  console.log("server Running");
});
