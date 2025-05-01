const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3001;

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
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

// GET endpoint to fetch exoplanets
app.get('/exoplanets', (req, res) => {
  let query = 'SELECT * FROM exoplanets WHERE default_flag=1 ';

  // default hostname
  if (req.query.hostname == undefined) {
    req.query.hostname = 'HD 10180';
  }

  query += "AND hostname = '" + req.query.hostname + "'";

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching exoplanet data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

/*

*/
app.get('/exoplanets/:planetname', (req, res) => {
  /*
  - get all exoplanets
  - get our exoplanet object
  - compute exoplanet object distance with every other object
  - return object with our exoplanet and list of planets
  */
  // let query = "SELECT * FROM exoplanets WHERE default_flag=1 AND pl_name = '" + req.query.planetname + "'";
  let query = "SELECT * FROM exoplanets WHERE default_flag=1";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching exoplanet data:', err);
      res.status(500).send('Server error');
      return;
    }
    var obj = {}; // our exoplanet
    let found = false;
    for (let planet of results) {
      if (planet.pl_name == req.params.planetname) {
        obj = planet;
        found = true;
      }
    }
    if (!found) {
      res.status(404).send('Planet not found');
      return;
    }
    // set x and y 
    let x = req.query.x;
    let y = req.query.y;
    if (x == undefined || y == undefined) {
      res.send({planet: obj});
      return;
    }

    // find max values for normalization

    // res.json(results);
  });
  // res.json({data: req.params.planetname})
  // compute distance


  // db.query(query,)
});

// 
app.get('/exoplanets/solarsystems', (req, res) => {
  db.query('select distinct(hostname) from exoplanets;', (err, results) => {
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
  let query = 'SELECT * FROM asteroids WHERE 1=1';
  const { columns, values, limit } = req.query;

  const finalLimit = limit ? parseInt(limit) : 30;

  if (columns && values) {
    const columnsList = columns.split(',');
    const valuesList = values.split(',');

    if (columnsList.length !== valuesList.length) {
      return res.status(400).send('Columns and values length mismatch');
    }

    for (let i = 0; i < columnsList.length; i++) {
      const col = columnsList[i];
      const val = valuesList[i];

      if (val.startsWith('>=')) {
        query += ` AND ${col} >= ${val.slice(2)}`;
      } else if (val.startsWith('<=')) {
        query += ` AND ${col} <= ${val.slice(2)}`;
      } else {
        query += ` AND ${col} = '${val}'`;
      }
    }
  }

  query += ' LIMIT ' + finalLimit;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching asteroids data:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});



// app.get('/asteroids', (req, res) => {
//   db.query('SELECT * FROM asteroids', (err, results) => {
//     if (err) {
//       console.error('Error fetching asteroids data:', err);
//       res.status(500).send('Server error');
//       return;
//     }
//     res.json(results);
//   });
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

