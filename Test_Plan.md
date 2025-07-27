# Test Strategy: Full-Stack To-Do List Application

| **Prepared By:** | Fatima Fadel | **Date:**   | 27/7/2025 |
| :--------------- | :----------- | :---------- | :-------- |
| **Version:**     | 1.0          | **Project:** | Automation To-Do App |

### 1. Introduction & Objectives
This document outlines the testing strategy for a modified version of the [basic-react-todo-list](https://github.com/mbMosman/basic-react-todo-list) application. The primary objective is to verify the core business logic, security, and end-to-end user functionality of the application. The strategy employs a multi-layered approach, combining fast and stable backend API tests with user-centric frontend E2E tests to ensure comprehensive quality assurance.

### 2. What is Being Tested
The scope of this plan is focused on the primary user journey and the backend services that enable it. The core functionalities under test are:
*   **User Authentication Flow:** A user must be able to successfully register, log in, and receive a valid authentication token.
*   **Task Management (CRUD):** A logged-in user must be able to create, read, update, and delete their own tasks.
*   **Security and Data Isolation:** The API must protect all task-related endpoints, ensuring users can only access their own data.

### 3. Test Coverage & Tools
A "Testing Pyramid" approach is used to ensure robust quality. The majority of tests are fast, stable API tests, supplemented by focused E2E tests to verify the complete user experience.

*   **API Testing (Jest & Supertest):** This forms the foundation of our strategy. Located in `server/__tests__`, these tests run directly against the Node.js backend to validate business logic and security rules. They cover success cases, error handling (e.g., 400 Bad Request), and security (e.g., 401 Unauthorized).
    *   **Reason for choice:** Jest and Supertest are the industry standard for Node.js, providing a fast and reliable way to test API contracts.

*   **E2E UI Testing (Cypress):** Located in `cypress/e2e/`, these tests simulate a real user in a browser to validate critical user flows from start to finish. They confirm that the UI correctly interacts with the backend API.
    *   **Reason for choice:** Cypress is a modern, all-in-one framework known for its excellent developer experience and reliable E2E testing capabilities.

*   **Test Coverage Measurement:** API test effectiveness is measured using Jest's built-in coverage reporting. The current statement coverage is **61.41%**. While critical areas like authentication middleware are well-tested (91.66%), a key opportunity for improvement is increasing test coverage for the `category.router.js`.

### 4. How to Run the Tests
Tests are executed in a local development environment.
1.  **Start Application:** Run `npm run dev` in a terminal to start both the frontend and backend servers.
2.  **Run API Tests:** In a separate terminal, run `npm test`.
3.  **Run UI Tests:** In a third terminal, run `npx cypress open` to launch the Cypress Test Runner.

### 5. Assumptions & Limitations
*   **Assumptions:**
    *   A local PostgreSQL instance is running and accessible.
    *   The test database has been created and migrated with the correct schema.
    *   Node.js and npm are installed on the local machine.
*   **Limitations:**
    *   **Manual Execution:** Tests are run manually. A future enhancement is to set up a CI/CD pipeline (e.g., GitHub Actions) for automated execution.
    *   **No Performance Testing:** This plan does not include load or stress testing.
    *   **Limited Browser Scope:** E2E tests are validated on a single browser (Chrome-based) and do not cover comprehensive cross-browser compatibility.
