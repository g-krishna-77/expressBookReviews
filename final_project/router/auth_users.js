const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// =============================
// Helper Functions
// =============================

// ✅ Task Utility: Check if username exists
const isValid = (username) => {
  // Returns true if a username already exists in users array
  return users.some((user) => user.username === username);
};

// ✅ Task Utility: Check if user is authenticated
const authenticatedUser = (username, password) => {
  // Returns true if username and password match any user in users array
  return users.some((user) => user.username === username && user.password === password);
};

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing credentials" });
  
    if (users.some(u => u.username === username)) return res.status(400).json({ message: "User already exists" });
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  });
  
// =============================
// TASK 7: User Login
// =============================
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT Token
    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: '1h' });

    // Store authorization in session
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User successfully logged in", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// =============================
// TASK 8: Add or Modify a Book Review
// =============================
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Add or update review
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully" });
});

// =============================
// TASK 9: Delete Book Review
// =============================
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  let book = books[isbn];

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "No review found for this user to delete" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
