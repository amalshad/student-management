# Student Management System

A Student Management System built using TypeScript, Node.js, Express, and MongoDB. The application follows a layered architecture (Controller → Service → Repository) to provide a clean and maintainable codebase while implementing CRUD (Create, Read, Update, Delete) operations for student records.

## Features

* Create new student records
* Retrieve all students
* Retrieve a student by ID
* Update student information
* Delete student records
* Search Functionality
* Filter Functionality
* Type-safe development with TypeScript
* MongoDB database integration
* RESTful API architecture
* Layered project structure using Repository Pattern

## Tech Stack

* TypeScript
* Node.js
* Express.js
* MongoDB
* Mongoose
* REST API

## Project Structure

```text
student-management/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── style.js
│
├── src/
│   ├── controllers/
│   │   └── student.controller.ts
│   │
│   ├── services/
│   │   └── student.service.ts
│   │
│   ├── repositories/
│   │   └── student.repository.ts
│   │
│   ├── models/
│   │   └── student.model.ts
│   │
│   ├── interfaces/
│   │   └── student.interface.ts
│   │
│   ├── routes/
│   │   └── student.routes.ts
│   │
│   ├── utils/
│   │   └── apiResponse.ts
│   │
│   ├── config/
│   │   └── db.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── package.json
└── tsconfig.json
```

## Architecture

The application follows a layered architecture:

```text
Client
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
MongoDB
```

### Responsibilities

* **Routes** → Define API endpoints
* **Controllers** → Handle HTTP requests and responses
* **Services** → Contain business logic
* **Repositories** → Interact with MongoDB
* **Models** → Define database schema
* **Interfaces** → Provide TypeScript type safety
* **Utils** → Reusable helper functions and API response handlers

## Installation

### Clone the Repository

```bash
git clone https://github.com/amalshad/student-management.git
cd student-management
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## API Endpoints

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| POST   | /students     | Create a student  |
| GET    | /students     | Get all students  |
| GET    | /students/:id | Get student by ID |
| PUT    | /students/:id | Update student    |
| DELETE | /students/:id | Delete student    |

## Sample Student Object

```json
{
  "name": "John Doe",
  "age": 20,
  "email": "john@example.com",
}
```

## Learning Objectives

This project demonstrates:

* TypeScript fundamentals
* REST API development
* Express.js routing
* MongoDB integration
* Repository Pattern
* Layered Architecture
* Interface-driven development
* Error handling and response management
* CRUD operations

## Future Improvements

* Authentication & Authorization (JWT)
* Request Validation
* Pagination and Filtering
* Unit & Integration Testing
* Docker Support
* API Documentation using Swagger

## Author

Amal Shad

GitHub: https://github.com/amalshad

## License

This project is intended for learning and educational purposes.
