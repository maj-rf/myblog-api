# Blog-API

## Overview

The server for my Blog-Client Web App.

## REST API Endpoints

### Users

- GET `api/users/` => Get all users.

  Response:

  ```
  [
    {
      "_id": "644882c0d29b4d78865a0ec7",
      "username": "diantha08",
      "email": "diantha08@gmail.com",
      "createdAt": "2023-04-26T01:47:44.767Z",
      "updatedAt": "2023-04-26T01:47:44.767Z"
    }
  ]
  ```

- POST `api/users/register` => Create a user.

  Request Body Example & Response:

  ```
  // Req
  {
    "username": "rozeluxe",
    "email": "rozeluxe@gmail.com",
    "password": "rozeluxe",
    "confirm_pass": "rozeluxe"
  }
  // Res
  {
    "message": "Succesfully registered"
  }
  ```

- POST `api/users/login` => Log In to application.

  Request Body Example & Response:

  ```
  // Req
  {
    "email": "rozeluxe@gmail.com",
    "password": "rozeluxe"
  }
  // Res
  {
    "token": "yourGeneratedAccessToken",
    "username": "rozeluxe",
    "email": "rozeluxe@gmail.com"
  }
  ```

### Blogs

- GET `/api/blogs/` => Get all blogs made by users.

  Response:

  ```
  [
    {
      "_id": "644882d8d29b4d78865a0eca",
      "user": {
        "_id": "644882c0d29b4d78865a0ec7",
        "username": "diantha08"
      },
      "title": "ZZZZ Blog",
      "content": "random content",
      "published": false,
      "tags": [],
      "comments": [
        "644883733171a10ed91990bd",
        "644883bf3171a10ed91990c3",
        "6448840aa360295058af2a33"
      ]
    }
  ]
  ```

- POST `/api/blogs/` => Create a blog.

  Request Body Example & Response:

  ```
  // Req
  {
    "title": "Blog Title",
    "content":"random content"
  }
  // Res
  {
    "user": "644882c0d29b4d78865a0ec7",
    "title": "Blog Title",
    "content": "random content",
    "published": false,
    "tags": [],
    "comments": [],
    "_id": "64488cdac647a88c3d08e9b3"
  }
  ```

### Comments

- GET `/api/comments/:id` => Get comments from a specific blog.

  Response:

  ```
  [
    {
      "_id": "64488efa8298ed59c3ea7425",
      "content": "A Random Comment",
      "user": {
        "_id": "644882c0d29b4d78865a0ec7",
        "username": "diantha08"
      },
      "blog": "64488cdac647a88c3d08e9b3"
    }
  ]
  ```

- POST `/api/comments/:id` => Create a comment to a specific blog.

  Request Body Example & Response:

  ```
  // Req
  {
    "comment_content": "A Random Comment"
  }
  // Res
  {
    "content": "A Random Comment",
    "user": "644882c0d29b4d78865a0ec7",
    "blog": "64488cdac647a88c3d08e9b3",
    "_id": "64488efa8298ed59c3ea7425"
  }
  ```

### Error Response

- Cast Error => Wrong Blog ids from request.

  Response: `{ error: 'malformatted id' }`

- JsonWebTokenError => Unregistered user accessing protected API endpoints.

  Response: `{ error: 'Unauthorized User' }`

- TokenExpiredError => Accessing protected API endpoints when token is expired.

  Response: `{ error: 'token expired' }`

- Errors from validation via express-validator => Submitting empty required fields, wrong passwords, etc.

## Development

Technologies:

- ExpressJS
- TypeScript
- ts-node
- nodemon
- JWT
- bcrypt
- cors
- eslint
- prettier

## Installation and Running the Project Locally

- Go to root directory and run `npm install` to install dependencies.
- Create `.env` file and input your `MONGODB_URI`, `PORT`, and `SECRET_KEY`.
- Run `npm run dev` for development or `npm run build` for production.
