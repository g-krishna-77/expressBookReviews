const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// =========================
// Task 6: Register a new user
// =========================
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate credentials
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add new user
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. You can now log in." });
});

// =========================
// Task 1: Get all books
// =========================
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// =========================
// Task 2: Get book details based on ISBN
// =========================
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

// =========================
// Task 3: Get book details based on author
// =========================
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const filteredBooks = [];

  bookKeys.forEach(key => {
    if (books[key].author === author) {
      filteredBooks.push(books[key]);
    }
  });

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: `No books found for author ${author}` });
  }
});

// =========================
// Task 4: Get all books based on title
// =========================
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const filteredBooks = [];

  bookKeys.forEach(key => {
    if (books[key].title === title) {
      filteredBooks.push(books[key]);
    }
  });

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: `No books found with title ${title}` });
  }
});

// =========================
// Task 5: Get book review
// =========================
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

const axios = require('axios'); // Add at top if not present

// =========================
// TASK 10: Get all books using async/await
// =========================
public_users.get('/async/books', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) resolve(books);
        else reject("Unable to fetch books");
      });
    };

    const result = await getBooks();
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.toString() });
  }
});

// =========================
// TASK 11: Get book details by ISBN using async/await
// =========================
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) resolve(book);
        else reject("Book not found");
      });
    };

    const result = await getBookByISBN();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// =========================
// TASK 12: Get book details by Author using async/await
// =========================
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author === author);
        if (filteredBooks.length > 0) resolve(filteredBooks);
        else reject("Author not found");
      });
    };

    const result = await getBooksByAuthor();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// =========================
// TASK 13: Get book details by Title using async/await
// =========================
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.title === title);
        if (filteredBooks.length > 0) resolve(filteredBooks);
        else reject("Title not found");
      });
    };

    const result = await getBooksByTitle();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});


module.exports.general = public_users;
