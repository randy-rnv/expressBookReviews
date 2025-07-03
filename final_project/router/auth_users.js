const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password)=>{
    return users.filter((user) => user.username === username && user.password === password).length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    if (authenticatedUser(req.body.username, req.body.password)) {
        let accessToken = jwt.sign({
            data: req.body.username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken
        };

        return res.status(200).json({message: "login OK"});
    }
    return res.status(200).json({message: "login failed"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (req.body.review) {
        books[req.params.isbn].reviews[req.user] = req.body.review;

        return res.status(200).json({message: "New Review Added", book: books[req.params.isbn]});
    }

    return res.status(200).json({message: "No review to add"});
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    delete books[req.params.isbn].reviews[req.user];

    return res.status(200).json({message: `Review deleted for ${req.user}`, book: books[req.params.isbn]});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
