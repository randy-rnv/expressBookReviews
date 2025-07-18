const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const doesExist = (username) => {
    return users.filter(user => user.username === username).length > 0;
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let book = books[req.params.isbn];

    return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let book = Object.entries(books).filter(([isbn, book]) => book.author === req.params.author).map(([isbn, book]) => book);

    return res.status(200).json(book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let book = Object.entries(books).filter(([isbn, book]) => book.title === req.params.title).map(([isbn, book]) => book);

    return res.status(200).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let review = books[req.params.isbn].reviews;

    return res.status(200).json(review);
});

//  TEST
public_users.get('/test',function (req, res) {
    getAllBooks();
    getBookFromIsbn(3);
    getBookFromAuthor('Samuel Beckett');
    getBookFromTitle('The Divine Comedy');

    return res.status(200).json({message: 'ok'});
});

const getAllBooks = () => {
    axios.get('http://localhost:5000').then(response => {
        console.log(response.data);
    }).catch(err => {
        console.log(err.toString())
    });
}

const getBookFromIsbn = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`).then(response => {
        console.log(response.data);
    }).catch(err => {
        console.log(err.toString())
    });
}

const getBookFromAuthor = (author) => {
    axios.get(`http://localhost:5000/author/${author}`).then(response => {
        console.log(response.data);
    }).catch(err => {
        console.log(err.toString())
    });
}

const getBookFromTitle = (title) => {
    axios.get(`http://localhost:5000/title/${title}`).then(response => {
        console.log(response.data);
    }).catch(err => {
        console.log(err.toString())
    });
}

module.exports.general = public_users;
