const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Please provide an username" });
  }

  if (!password) {
    return res.status(400).json({ message: "Please provide a password" });
  }

  const checkUser = Object.values(users).filter(
    (user) => user.username === username,
  );

  if (checkUser.length) {
    return res.status(400).json({ message: "User already exists" });
  }

  // normally we would encrypt the password with bcrypt
  users.push({ username, password });

  return res.status(200).json({ message: "Registration success!" });
});

public_users.get("/", function (req, res) {
  return res.json(books);
});

public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;

  const book = books[isbn];

  if (book) {
    return res.json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});

public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;

  const filteredBooks = Object.values(books).filter(
    (book) => book.author === author,
  );

  return res.json(filteredBooks);
});

public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  console.log(title);

  const filteredBooks = Object.values(books).filter(
    (book) => book.title === title,
  );

  return res.json(filteredBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  const book = books[isbn];

  if (book) {
    return res.json(book.reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
