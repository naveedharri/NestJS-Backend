# NestJS Backend Developer Take-Home Test

All tasks have been completed, please find the order and setup steps

## Local Setup

#### The below steps should setup all the required services for testing the apis

NOTE : Migrations are not created I have used the typeorm sync functinoality to sync the database changes in dev

Clone the project

```bash
  git clone https://github.com/naveedharri/NestJS-Backend.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
 npm run start:dev

```

Start Postgres Database

```bash
docker-compose up -d
```

Everything should be good and running at this point!

`NOTE`: If you dont use docker you can create a `.env` file form the `example.env` file for the connection

## API Reference

#### Get All Users

```http
  GET /users
```

API response

```
{
    "message": "Users retrieved successfully!",
    "status": 1,
    "result": [
        {
            "userId": "af4d91ea-d630-401d-b1c1-862ff24f0fed",
            "name": "Naveed",
            "email": "naveed@gmail.com",
            "age": 2,
            "status": "active",
            "createdAt": "2024-12-04T05:12:07.807Z",
            "updatedAt": "2024-12-04T05:12:07.807Z"
        },
        {
            "userId": "f8be24fd-08b6-4ddb-b292-dceebc54bd7b",
            "name": "Naveed",
            "email": "fdsf@gmail.com",
            "age": 2,
            "status": "active",
            "createdAt": "2024-12-04T05:24:06.672Z",
            "updatedAt": "2024-12-04T05:24:06.672Z"
        },
        {
            "userId": "1c7e4712-d49d-458c-bb20-94b2d8a7c906",
            "name": "Naveed",
            "email": "dsfds@gmail.com",
            "age": 2,
            "status": "active",
            "createdAt": "2024-12-04T05:24:11.493Z",
            "updatedAt": "2024-12-04T05:24:11.493Z"
        }
    ]
}
```

#### Create USER

```http
  POST /users
```

| Parameter | Type     | Description       |
| :-------- | :------- | :---------------- |
| `name`    | `string` | Name of the user  |
| `email`   | `string` | Email of the user |
| `age`     | `int`    | Age of the user   |

API response

```
{
    "message": "Users retrieved successfully!",
    "status": 1,
    "result": [
        {
            "userId": "af4d91ea-d630-401d-b1c1-862ff24f0fed",
            "name": "Naveed",
            "email": "naveed@gmail.com",
            "age": 2,
            "status": "active",
            "createdAt": "2024-12-04T05:12:07.807Z",
            "updatedAt": "2024-12-04T05:12:07.807Z"
        },
        {
            "userId": "f8be24fd-08b6-4ddb-b292-dceebc54bd7b",
            "name": "Naveed",
            "email": "fdsf@gmail.com",
            "age": 2,
            "status": "active",
            "createdAt": "2024-12-04T05:24:06.672Z",
            "updatedAt": "2024-12-04T05:24:06.672Z"
        },
        {
            "userId": "1c7e4712-d49d-458c-bb20-94b2d8a7c906",
            "name": "Naveed",
            "email": "dsfds@gmail.com",
            "age": 2,
            "status": "active",
            "createdAt": "2024-12-04T05:24:11.493Z",
            "updatedAt": "2024-12-04T05:24:11.493Z"
        }
    ]
}
```

# Task 2: Database Schema and Optimization

Explanation of Optimizations
`idx_users_name`: This index speeds up the ORDER BY name ASC operation, especially for large datasets, by avoiding a full table sort.

idx_users_age: This index improves the WHERE age > 18 condition by narrowing down the search range using the index instead of scanning all rows.

Combined Index (Optional): If the query frequently combines age filtering and name sorting, a multi-column index could be used:

sql
Copy code
CREATE INDEX idx_users_age_name ON Users(age, name);
This combined index can cover both the filter and sort operations in a single step for better performance.

Query Execution Plan Analysis: Use EXPLAIN to analyze the query execution plan and ensure the indexes are being used effectively.

### Design the PostgreSQL Schema

```

-- Create the Users table
CREATE TABLE Users (
    userId SERIAL PRIMARY KEY, -- Unique identifier for each user, auto-incrementing
    name VARCHAR(100) NOT NULL, -- User's full name
    email VARCHAR(150) UNIQUE NOT NULL, -- Email must be unique
    age INT CHECK (age >= 0) -- Age must be a non-negative integer
);

```

### Query to Retrieve Users Over the Age of 18

```
-- Retrieve users over the age of 18, sorted by name
SELECT *
FROM Users
WHERE age > 18
ORDER BY name ASC;

```

### Indexes and Optimizations

```

-- Index to optimize sorting by name
CREATE INDEX idx_users_name ON Users(name);

-- Index to optimize filtering by age
CREATE INDEX idx_users_age ON Users(age);

```

# Task 3: Message Queue Integration

This application uses Redis as a message queue to handle user sign-up events and simulate sending a "Welcome" email.

`Publisher`: The UserService publishes a user:welcome message to
Redis when a new user is created.
`Subscriber`: The WelcomeSubscriber listens to the user:welcome channel and processes messages in real-time (e.g., logs the welcome email action).
RedisService: Manages publisher and subscriber Redis connections.

## How to Test

Trigger a user sign-up via an API call or manually publish a message to Redis:

POST `http://localhost:3000/users`

Subscribed to user:welcome channel

`Welcome email sent to: testuser@example.com`

This demonstrates the seamless publishing and consumption of messages.

# Task 4: API Performance and Security Enhancements

## Performance Optimizations

1. **Database Optimization**: Indexing has been added to critical database columns for faster query performance, e.g., `CREATE INDEX user_email_idx ON users(email);`.
2. **Caching**: I will implement Redis caching to optimize frequently accessed endpoints and query results.
3. **Pagination and Lazy Loading**: I will incorporate pagination to handle large datasets efficiently using an offset and limit strategy.
4. **Compression**: I will configure middleware for payload compression using tools like `compression`.
5. **Load Balancing**: I will configure a load balancer like NGINX to evenly distribute traffic across instances.

## Security Measures

1. **Request Validation**: I have enforced strict validation for incoming requests using `class-validator` and DTOs.
2. **Rate Limiting**: I will set up `rate-limiter-flexible` to prevent abuse by limiting excessive requests.
3. **Authentication and Authorization**: I will implement JWT-based authentication and role-based access control to ensure secure access.
4. **Input Sanitization**: I will sanitize all user inputs to prevent SQL injection and XSS attacks.
5. **HTTPS Enforcement**: I will configure HTTPS to secure communication across the API.
