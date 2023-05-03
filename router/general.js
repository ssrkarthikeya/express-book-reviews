const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  if (books) {
    return res.status(200).json(books);
  } else return res.status(200).json({ message: "No books found" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  var book = books[req.params.isbn];
  if (book) {
    return res.status(200).json(book);
  } else return res.status(200).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  var listOfBooks = [];

  for (let [key, value] of Object.entries(books)) {
    if (value.author.includes(req.params.author)) {
      listOfBooks.push(value);
    }
  }
  if (listOfBooks.length > 0) {
    return res.status(200).json(listOfBooks);
  } else return res.status(200).json({ message: "No books found" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  var listOfBooks = [];

  for (let [key, value] of Object.entries(books)) {
    if (value.title.includes(req.params.title)) {
      listOfBooks.push(value);
    }
  }
  if (listOfBooks.length > 0) {
    return res.status(200).json(listOfBooks);
  } else return res.status(200).json({ message: "No books found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  var book = books[req.params.isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else return res.status(200).json({ message: "Book not found" });
});

public_users.get("/books", function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.status(200).send(books));
  });

  get_books.then(() => console.log("Complete"));
});

public_users.get("/book/isbn/:isbn", function (req, res) {
  var book = books[req.params.isbn];
  if (book) {
    const getBooks = new Promise((resolve, reject) => {
      resolve(res.status(200).send(book));
    });
    getBooks.then(() => console.log("Complete"));
  } else return res.status(200).json({ message: "Book not found" });
});

public_users.get("/book/title/:title", function (req, res) {
  var listOfBooks = [];

  for (let [key, value] of Object.entries(books)) {
    if (value.title.includes(req.params.title)) {
      listOfBooks.push(value);
    }
  }
  if (listOfBooks.length > 0) {
    const getTitle = new Promise((resolve, reject) => {
      resolve(res.status(200).json(listOfBooks));
    });
    getTitle.then(() => console.log("Complete"));
  } else return res.status(200).json({ message: "No books found" });
});

public_users.get("/book/review/:isbn", function (req, res) {
  var book = books[req.params.isbn];
  if (book) {
    const getReview = new Promise((resolve, reject) => {
      resolve(res.status(200).json(book.reviews));
    });
    getReview.then(() => console.log("Complete"));
  } else return res.status(200).json({ message: "Book not found" });
});

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports.general = public_users;
