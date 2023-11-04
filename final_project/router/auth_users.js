const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Please enter an username" });
  }

  if (!password) {
    return res.status(400).json({ message: "Please enter a password" });
  }

  const user = users.find(
    (user) => user.username === username && user.password === password,
  );

  if (user) {
    const token = jwt.sign({ username, password }, "secret"); // Replace with your actual JWT secret key.
    req.session.token = token;
    return res.json({ message: "Login successful", token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username } = req.user;
  const { isbn } = req.params;
  const { review } = req.body;

  if (!username) {
    return res.status(500);
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "book not found" });
  }

  book.reviews[username] = review;

  return res.json({ review: book.reviews[username] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username } = req.user;
  const { isbn } = req.params;

  if (!username) {
    return res.status(500);
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "book not found" });
  }

  delete book.reviews[username];

  return res.status(200).json({ message: "review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
