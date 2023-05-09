# Blog-API

## Overview

The server for my Blog-Client Web App.

## REST API Endpoints

### Users

| Description              | Method | URL                 |
| ------------------------ | ------ | ------------------- |
| Register                 | POST   | /api/users/register |
| Login                    | POST   | /api/users/login    |
| Logout                   | POST   | /api/users/logout   |
| Search Users             | GET    | /api/users          |
| Get Current User Profile | GET    | /api/users/profile  |

### Blogs

| Description      | Method | URL            |
| ---------------- | ------ | -------------- |
| Create Blog Post | POST   | /api/blogs     |
| Get Blog Posts   | GET    | /api/blogs     |
| Get a Blog Post  | GET    | /api/blogs/:id |
| Update Blog Post | PUT    | /api/blogs/:id |
| Delete Blog Post | DELETE | /api/blogs/:id |

### Comments

| Description              | Method | URL               |
| ------------------------ | ------ | ----------------- |
| Create Comment to a Blog | POST   | /api/comments/:id |
| Get Comments of Blog     | GET    | /api/comments/:id |

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
- MongoDB
- TypeScript
- JWT for Auth
- Jest & Supertest for testing

## Installation and Running the Project Locally

1. Go to root directory and run `npm install` to install dependencies.
2. Create `.env` file and add your configs.
3. Run `npm run dev` for development or `npm run build` for production.
4. Run tests using `npm run dev`. This creates a testing MONGODB database .

## Setup for ENV variables

- MONGO_URI=<URI used to connect to a production MongoDB database>
- TEST_MONGO_URI=<URI used to connect to a test MongoDB database>
- PORT=<Your server port, ex: 3003>
- ACCESS_TOKEN_SECRET=<Secret for your access tokens>
- REFRESH_TOKEN_SECRET=<Secret for your refresh tokens>
