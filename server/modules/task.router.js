// server/modules/task.router.js
const express = require('express');
const router = express.Router();
const pool = require('../modules/pool'); // Using your correct path for the pool

// GET tasks ONLY for the logged-in user
router.get('/', (req, res) => {
  if (!req.user || !req.user.id) return res.status(401).send('Authentication Error');
  const userId = req.user.id;
  const queryText = `
    SELECT 
      task.id, 
      task.description, 
      task.complete,
      task.due AS "due",
      category.name AS "category_name" 
    FROM task
    JOIN category ON task.category_id = category.id
    WHERE task.user_id = $1
    ORDER BY task.id ASC;
  `;
  pool.query(queryText, [userId])
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.error('Error in GET /api/task', error);
      res.sendStatus(500);
    });
});

// POST a new task for the logged-in user
router.post('/', (req, res) => {
    if (!req.user || !req.user.id) return res.status(401).send('Authentication Error');
    const newTask = req.body;
    const userId = req.user.id;
    const queryText = `INSERT INTO task ("description", "category_id", "due", "user_id") VALUES ($1, $2, $3, $4);`;
    const queryValues = [newTask.description, newTask.category, newTask.due, userId];
    pool.query(queryText, queryValues)
        .then(() => res.sendStatus(201))
        .catch((error) => {
            console.error('Error in POST /api/task', error);
            res.sendStatus(500);
        });
});

// --- THIS PUT ROUTE IS MODIFIED TO HANDLE BOTH COMPLETION AND DESCRIPTION EDITS ---
router.put('/:id', (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).send('Authentication Error');
    }

    const taskIdToUpdate = req.params.id;
    const userId = req.user.id;
    const { description, complete } = req.body; // Destructure description and complete from the request

    let queryText;
    let queryValues;

    // Check if the 'description' field was sent in the request
    if (description !== undefined) {
        // If yes, build a query to update the task's description
        queryText = `UPDATE task SET "description" = $1 WHERE "id" = $2 AND "user_id" = $3;`;
        queryValues = [description, taskIdToUpdate, userId];
    } 
    // Otherwise, check if the 'complete' field was sent
    else if (complete !== undefined) {
        // If yes, build a query to update the task's completion status
        queryText = `UPDATE task SET "complete" = $1 WHERE "id" = $2 AND "user_id" = $3;`;
        queryValues = [complete, taskIdToUpdate, userId];
    } 
    // If neither field was sent, it's a bad request
    else {
        return res.status(400).send('Invalid request. Must provide "description" or "complete" to update.');
    }

    pool.query(queryText, queryValues)
        .then((result) => {
            // Check if any row was actually updated. If not, the user is not authorized.
            if (result.rowCount === 0) {
                return res.sendStatus(403); // Forbidden
            }
            res.sendStatus(200); // OK
        })
        .catch((error) => {
            console.error('Error in PUT /api/task/:id', error);
            res.sendStatus(500);
        });
});
// ---------------------------------------------------------------------------------

// DELETE a task ONLY if it belongs to the logged-in user
router.delete('/:id', (req, res) => {
    if (!req.user || !req.user.id) return res.status(401).send('Authentication Error');
    const taskIdToDelete = req.params.id;
    const userId = req.user.id;
    const queryText = `DELETE FROM task WHERE "id" = $1 AND "user_id" = $2;`;
    pool.query(queryText, [taskIdToDelete, userId])
        .then((result) => {
            if (result.rowCount === 0) return res.sendStatus(403); // Forbidden
            res.sendStatus(204); // No Content
        })
        .catch((error) => {
            console.error('Error in DELETE /api/task', error);
            res.sendStatus(500);
        });
});

module.exports = router;