# Library Management System

## Overview
This is a Library Management System built using the **PERN stack** (PostgreSQL, Express.js, React.js, and Node.js). It provides two main roles:

- **Admin**: Manages books and users.
- **User**: Searches, borrows, and returns books.

## Features

### Admin Section
- **Book Management**: Add, update, and delete books from the library.
- **User Management**: View and manage registered users.
- **Track Borrowed Books**: View details of borrowed books and their borrowers.
- **Overdue Management**: Send notifications for overdue books.

### User Section
- **Book Search**: Search for books by title, author, or category.
- **Book Borrowing**: Borrow available books.
- **Borrowing History**: View and manage borrowing history.
- **Profile Management**: Update profile information.

## Tech Stack

### Frontend
- **React.js**: Frontend framework for building the user interface.
- **Tailwind CSS**: For styling the application.

### Backend
- **Node.js** with **Express.js**: Handles server-side operations and API routing.
- **PostgreSQL**: For storing all data related to books, users, and transactions.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/library-management-system.git
    ```

2. Install dependencies for both frontend and backend:
    ```bash
    npm install
    ```

3. Set up the PostgreSQL database:
    - Create a new database and update the connection string in `.env` file.

4. Run the backend server:
    ```bash
    cd Backend
    npm run dev
    ```

5. Run the frontend development server:
    ```bash
    cd Frontend
    npm start
    ```

## Database Schema

### Users Table
| Column        | Type       | Description               |
| ------------- | ---------- | ------------------------- |
| id            | SERIAL     | Primary key                |
| name          | VARCHAR    | Name of the user           |
| email         | VARCHAR    | Email of the user          |
| password      | VARCHAR    | Hashed password            |
| role          | VARCHAR    | 'admin' or 'user'          |

### Books Table
| Column        | Type       | Description               |
| ------------- | ---------- | ------------------------- |
| id            | SERIAL     | Primary key                |
| title         | VARCHAR    | Title of the book          |
| author        | VARCHAR    | Author of the book         |
| genre         | VARCHAR    | Genre of the book          |
| available     | BOOLEAN    | Availability status        |

### Transactions Table
| Column        | Type       | Description               |
| ------------- | ---------- | ------------------------- |
| id            | SERIAL     | Primary key                |
| user_id       | INTEGER    | Foreign key (Users table)  |
| book_id       | INTEGER    | Foreign key (Books table)  |
| borrowed_date | TIMESTAMP  | When the book was borrowed |
| return_date   | TIMESTAMP  | When the book is due       |


## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue if you find bugs or want to request new features.


