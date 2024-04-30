const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
        accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization && req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review modified successfully" });
    } else {
        // Create a new review
        if (books[isbn]) {
            // If the book exists, but no review from the current user exists, add a new review for that user
            books[isbn].reviews[username] = review;
            return res.status(200).json({ message: "New review added successfully" });
        } else {
            // If the book doesn't exist, return an error message
            return res.status(404).json({ message: "Book not found" });
        }
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization && req.session.authorization.username;
    const isbn = req.params.isbn;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        if (books[isbn]) {
            return res.status(200).json({ message: "No Review found for this user" });
        } else {
            // If the book doesn't exist, return an error message
            return res.status(404).json({ message: "Book not found" });
        }
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
