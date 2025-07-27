# Full-Stack To-Do List Automation Application

This is a full-stack to-do list application that demonstrates a robust, multi-layered testing strategy. The project began as a foundational React/Node.js application, which I then enhanced by adding new features (such as task editing) and implementing a comprehensive testing suite from the ground up.

The current application features user registration, JWT-based authentication, full CRUD functionality for tasks, and is validated by backend API tests (Jest/Supertest) and frontend End-to-End tests (Cypress).

## Core Technologies

*   **Frontend:** React, Redux, Redux-Saga
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **Authentication:** JSON Web Tokens (JWT), bcrypt
*   **Testing:** Cypress (E2E), Jest & Supertest (API)

## Prerequisites

Before you begin, ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (which includes npm)
*   [PostgreSQL](https://www.postgresql.org/download/)

## Quick Start: Setup

Follow these steps to get the application and its test suites running locally.

### 1. Database Setup

You only need to do this once.

1.  Create a new database in PostgreSQL. You can name it whatever you like (e.g., `todo_app`).
2.  Run the provided `database_tables.sql` file against your new database. This will create the necessary `users`, `category`, and `task` tables.

### 2. Project Installation & Configuration

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-folder>
    ```

2.  **Install dependencies:**
3.  This single command will install all necessary packages for the application (like React and Express) as well as all testing frameworks (like Cypress, Jest, and Supertest).
    ```bash
    npm install
    ```

4.  **Configure the Database Connection:**
    *   Navigate to and open the file: `server/modules/pool.js`.
    *   Find the `const config` object near the top of the file.
    *   Update the `user`, `password`, and `database` properties to match your local PostgreSQL setup.
      ```javascript
      // Example from server/modules/pool.js
      const config = {
        user: 'YOUR_POSTGRES_USERNAME',     // <-- EDIT THIS
        password: 'YOUR_POSTGRES_PASSWORD', // <-- EDIT THIS
        host: 'localhost',
        port: 5432,
        database: 'YOUR_DATABASE_NAME',     // <-- EDIT THIS
      };
      ```

5.  **Configure the Authentication Secret:**
    *   In the **root directory** of the project, create a new file named `.env`.
    *   Add the following line to this new file. Be sure to create your own unique and secret phrase.
      ```
      # .env file
      JWT_SECRET=CHOOSE_A_LONG_RANDOM_SECRET_KEY_HERE
      ```

### 3. Running the Application

This single command starts both the backend and frontend servers concurrently.

*   **Start the application:**
    ```bash
    npm run dev
    ```
*   The backend server will be running on `http://localhost:5000`.
*   The React application will open automatically in your browser at `http://localhost:3000`.

## Running the Test Suites

### API Tests (Jest & Supertest)

These tests run directly against your backend API.

> **Important Note:** The test suite is designed to first **delete all data** from the `users`, `category`, and `task` tables and then seed them with specific data. This is intentional and ensures a clean, reproducible test environment. Do not run these tests against a database containing important data.
> 
*   **Execute the API test suite:**
    ```bash
    npm test
    ```
*   To run with coverage reporting:
    ```bash
    npm test -- --coverage
    ```

### End-to-End UI Tests (Cypress)

These tests simulate a real user in the browser and require the application to be running.

1.  **Start the application first (if not already running):**
    ```bash
    npm run dev
    ```

2.  **In a new, separate terminal, open the Cypress Test Runner:**
    ```bash
    npx cypress open
    ```
This will open the Cypress interface, where you can click to run individual tests or all tests at once.
