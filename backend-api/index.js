const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'ajaya',
  password: 'password',
  database: 'ci'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// GET endpoint to fetch users
app.get('/exoplanets', (req, res) => {
  db.query('SELECT * FROM exoplanets', (err, results) => {
    if (err) {
      console.error('Error fetching exoplanet data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.get('/solar_flares', (req, res) => {
  db.query('SELECT * FROM solar_flares', (err, results) => {
    if (err) {
      console.error('Error fetching solar flare data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


app.get('/stars', (req, res) => {
  db.query('SELECT * FROM stars', (err, results) => {
    if (err) {
      console.error('Error fetching stars data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


app.get('/asteroids', (req, res) => {
  db.query('SELECT * FROM asteroids', (err, results) => {
    if (err) {
      console.error('Error fetching asteroids data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

