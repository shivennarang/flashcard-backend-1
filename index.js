// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
const myurl="mysql://root:NDnjbyUJBxYrZdbPWEdkoOvONmZeTgMw@mysql.railway.internal:3306/railway"
// MySQL connection
const db = mysql.createConnection(myurl);

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// Create database if not exists
db.query('CREATE DATABASE IF NOT EXISTS flashcards_db', (err) => {
  if (err) throw err;
});

// Create table if not exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS flashcards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL
)`;
db.query(createTableQuery, (err) => {
  if (err) throw err;
});

// Routes

// Get all flashcards
app.get('/', (req, res) => {
  db.query('SELECT * FROM flashcards', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new flashcard
app.post('/flashcards', (req, res) => {
  const { question, answer } = req.body;
  const query = 'INSERT INTO flashcards (question, answer) VALUES (?, ?)';
  db.query(query, [question, answer], (err, results) => {
    if (err) throw err;
    res.json({ id: results.insertId, question, answer });
  });
});

// Update a flashcard
app.put('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  const query = 'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?';
  db.query(query, [question, answer, id], (err) => {
    if (err) throw err;
    res.json({ id, question, answer });
  });
});

// Delete a flashcard
app.delete('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM flashcards WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) throw err;
    res.json({ id });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
