# Node.js Book Review Application

This Node.js application serves as a server-side online book review system, integrated with a secure REST API server utilizing authentication at the session level using JSON Web Tokens (JWT). It includes features for creating APIs, performing CRUD (Create, Read, Update, Delete) operations, and testing the endpoints using Postman.

## Objectives

- Create APIs and perform CRUD operations on an Express server using session & JWT authentication.
- Use Async/Await or Promises with Axios in Node.js.
- Develop REST API endpoints and test them using Postman.

## Implementation Details

### Authentication

The application implements authentication at the session level using JSON Web Tokens (JWT). Users can securely log in using their username and password, and upon successful authentication, an access token is generated and stored in the session.

### Endpoints

1. **Login Endpoint**: Users can log in by sending a POST request to `/login`. The server verifies the provided username and password against the registered users' credentials. If the login is successful, an access token is generated and stored in the session.

2. **Book Review Endpoints**: Users can retrieve book details based on ISBN or author, add or modify book reviews, and obtain a list of all books available in the shop.

    - **Retrieve Book by ISBN**: Send a GET request to `/isbn/:isbn` to retrieve book details based on the ISBN.
    
    - **Retrieve Books by Author**: Send a GET request to `/author/:author` to retrieve book details based on the author.
    
    - **Add or Modify Book Review**: Send a PUT request to `/auth/review/:isbn` to add or modify a book review. Authentication with a valid access token is required.
    
    - **Retrieve All Books**: Send a GET request to `/` to retrieve a list of all books available in the shop.

### Testing

The application's functionality can be tested using Postman. Send requests to the defined endpoints with appropriate parameters to perform CRUD operations on book reviews, retrieve book details, and log in securely.

## Technologies Used

- Node.js
- Express.js
- JSON Web Tokens (JWT)
- Axios
- Postman (for testing)
