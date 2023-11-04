const express = require("express");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

const bookPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(books);
  }, 40000);
});

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

public_users.get("/", async function (req, res) {
  const result = await bookPromise;

  return res.json({ result });
});

public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;

  const result = await bookPromise;
  const book = result[isbn];

  if (book) {
    return res.json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});

public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;

  const result = await bookPromise;
  const filteredBooks = Object.values(result).filter(
    (book) => book.author === author,
  );

  return res.json(filteredBooks);
});

public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;

  const result = await bookPromise;

  const filteredBooks = Object.values(result).filter(
    (book) => book.title === title,
  );

  return res.json(filteredBooks);
});

public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  const book = books[isbn];

  if (book) {
    return res.json(book.reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
