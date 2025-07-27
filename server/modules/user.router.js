// server/modules/user.router.js
const express = require('express');
const router = express.Router();
const pool = require('./pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registration route - unchanged
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
  }
  try {
    const userCheck = await pool.query('SELECT * FROM "users" WHERE "username" = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserQuery = `INSERT INTO "users" ("username", "password") VALUES ($1, $2) RETURNING "id", "username"`;
    const newUser = await pool.query(newUserQuery, [username, hashedPassword]);
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error('SERVER ERROR IN /api/user/register:', err);
    res.status(500).send('Server error');
  }
});


// Login route with corrected status codes
router.post('/login', async (req, res) => {
  // Removing the console.logs for a cleaner final version
  const { username, password } = req.body;

  try {
    const userQuery = 'SELECT * FROM "users" WHERE "username" = $1';
    const userResult = await pool.query(userQuery, [username]);

    // --- FIX #1: USER NOT FOUND ---
    // If the user doesn't exist, it's an authentication failure. Send 401.
    if (userResult.rows.length === 0) {
      return res.status(401).json({ msg: 'Invalid credentials' }); // <-- CHANGED FROM 400
    }

    const user = userResult.rows[0];

    if (!user.password) {
        console.error('[LOGIN_ERROR] User in database has no password. Cannot compare.');
        return res.status(500).send('Server error: User record is corrupt.');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    // --- FIX #2: PASSWORD DOES NOT MATCH ---
    // If the password doesn't match, it's also an authentication failure. Send 401.
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' }); // <-- CHANGED FROM 400
    }

    // --- SUCCESS CASE ---
    const payload = {
      user: {
        id: user.id,
        username: user.username
      },
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
            console.error('[LOGIN_ERROR] JWT signing failed:', err);
            throw err;
        }
        res.json({ token });
      }
    );

  } catch (err) {
    console.error('--- LOGIN ROUTE CRASHED ---');
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;