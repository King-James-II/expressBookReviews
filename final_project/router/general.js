const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const URL = "https://jamesccraig-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/"



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Wrap the operation in a promise
    const getBooksData = new Promise((resolve, reject) => {
        try {
            const books_json = JSON.stringify(books, null, 4);
            resolve(books_json);
        } catch (error) {
            reject(error);
        }
    });

    // Handle the promise
    getBooksData.then((books_json) => {
        // Send the books data as the response
        res.status(200).send(books_json);
    }).catch((error) => {
        // Handle any errors
        console.error("Error retrieving books data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Wrap the operation in a promise
    const getBookByISBN = new Promise((resolve, reject) => {
        try {
            const isbn = req.params.isbn;
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        } catch (error) {
            reject(error);
        }
    });

    // Handle the promise
    getBookByISBN.then((book) => {
        // Send the book data as the response
        res.status(200).json(book);
    }).catch((error) => {
        // Handle any errors
        console.error("Error retrieving book data:", error);
        res.status(404).json({ message: error.message });
    });
});
  
// Get book details based on author using async await
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(URL); // Assuming your API endpoint for fetching books data is 'http://your-api-url/books'
        const books = response.data;
        
        const filtered_books = Object.values(books).filter(book => book.author === author);
        const filtered_books_json = JSON.stringify(filtered_books, null, 4);
        
        return res.status(200).send(filtered_books_json);
    } catch (error) {
        console.error("Error retrieving books data:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    try{
        const title = req.params.title
        const response = await axios.get(URL); // Assuming your API endpoint for fetching books data is 'http://your-api-url/books'
        const books = response.data;
        
        const filtered_books = Object.values(books).filter(book => book.title === title);
        const filtered_books_json = JSON.stringify(filtered_books, null, 4)

        return res.status(200).send(filtered_books_json)
    }catch(error){
        console.error("Error retrieving books data:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const reviews = books[isbn].reviews
    const reviews_json = JSON.stringify(reviews, null, 4)

    return res.status(200).send(reviews_json);
});

module.exports.general = public_users;
