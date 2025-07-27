// server/server.js
require('dotenv').config();
const express = require('express');
const app = express();

// --- DO NOT EXPORT HERE ---
// module.exports = app; // <-- This was the problem

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import auth middleware
const auth = require('./modules/auth.middleware');

// Static files
app.use(express.static('build'));

// Setup routers
const taskRouter = require('./modules/task.router');
const categoryRouter = require('./modules/category.router');
const userRouter = require('./modules/user.router'); // Import user router

// Public routes (login/register)
app.use('/api/user', userRouter);

// Protected routes (tasks/categories)
// Any request to /api/task or /api/category must have a valid token
app.use('/api/task', auth, taskRouter);
app.use('/api/category', auth, categoryRouter);

const PORT = process.env.PORT || 5000;

// This conditionally starts the server. It will NOT run when Jest is testing.
// Jest and Supertest will start the server on their own.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, function () {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

// --- THIS IS THE CORRECT PLACE TO EXPORT ---
// All middleware and routes are now attached to 'app' before it's exported.
module.exports = app;