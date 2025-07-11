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
  password: 'rootcory',
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

// Input: partial string
// Output: List of planet names that match on that partial string
// Order by lexicography
app.get('/exoplanets/search/:planet', (req, res) => {
  let substring = req.params.planet;
  let n = 20;
  if (req.query.n != undefined) {
    n = Number.parseInt(req.query.n);
  }
  let query = `SELECT DISTINCT(pl_name) FROM exoplanets WHERE pl_name LIKE '%${substring}%' ORDER BY pl_name LIMIT ${n}`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error getting similar planets', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

/* Returns information about an asteroid and a list of similar
   asteroids.
*/
app.get('/asteroids/:asteroidid', (req, res) => {
  let query = 'SELECT * FROM asteroids';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching asteroid data:', err);
      res.status(500).send('Server error');
      return;
    }
    var obj = {}; // our asteroid
    let found = false;
    for (let asteroid of results) {
      if (asteroid.id == req.params.asteroidid) {
        obj = asteroid;
        found = true;
      }
    }
    if (!found) {
      res.status(404).send('Asteroid not found');
      return;
    }
    let n = 20;
    if (req.query.n != undefined) {
      n = Number.parseInt(req.query.n);
    }
    let x = req.query.x;
    let y = req.query.y;
    if ((x != undefined && obj[x] == undefined) ||
      (y != undefined && obj[y] == undefined) 
    ) {
      res.status(400).send('bad request');
      return;
    }
    let oned = req.query.oned;

    if (oned != undefined) {
      if (x != undefined || y == undefined) {
        res.status(400).send('bad request');
        return;
      }
      // compute 1d similarity
      let similarAsteroids = compute1DSimilarity(results, obj, y, n, (obj1, obj2) => obj1.id == obj2.id);

      res.send({asteroid: obj, similar_asteroids: similarAsteroids});
      return;
    }

    if (x == undefined && y == undefined) {
      res.send({asteroid: obj});
      return;
    } else if (x == undefined || y == undefined) {
      res.status(400).send('bad request');
      return;
    }

    let similarAsteroids = computeSimilarity(results, obj, x, y, n, (obj1, obj2) => obj1.id == obj2.id);

    res.json({asteroid: obj, similar_asteroids: similarAsteroids});
  });
});


/*
  Given an exoplanet, we want to return information about it
  and the closest 20 planets.

*/
app.get('/exoplanets/:planetname', (req, res) => {
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
    let n = 20;
    if (req.query.n != undefined) {
      n = Number.parseInt(req.query.n);
    }
    let x = req.query.x;
    let y = req.query.y;
    if ((x != undefined && obj[x] == undefined) ||
      (y != undefined && obj[y] == undefined) 
    ) {
      res.status(400).send('bad request');
      return;
    }
    let oned = req.query.oned;

    if (oned != undefined) {
      if (x != undefined || y == undefined) {
        res.status(400).send('bad request');
        return;
      }
      // compute 1d similarity
      let similarPlanets = compute1DSimilarity(results, obj, y, n, (obj1, obj2) => obj1.pl_name == obj2.pl_name);

      res.send({planet: obj, similar_planets: similarPlanets});
      return;
    }

    if (x == undefined && y == undefined) {
      res.send({planet: obj});
      return;
    } else if (x == undefined || y == undefined) {
      res.status(400).send('bad request');
      return;
    }

    let similarPlanets = computeSimilarity(results, obj, x, y, n, (obj1, obj2) => obj1.pl_name == obj2.pl_name);

    res.json({planet: obj, similar_planets: similarPlanets});
  });
});

function compute1DSimilarity(items, inputItem, attr, n, isSame) {
  let distances = [];
  for (let i = 0; i < items.length; i++) {
    let planet = items[i];
    if (isSame(planet, inputItem)) {
      continue;
    }
    let similarity = Math.abs(inputItem[attr] - planet[attr]);
    distances.push({idx: i, similarity: similarity})
  }
  distances.sort((d1, d2) => d1.similarity - d2.similarity)
  if (n > distances.length) {
    n = distances.length;
  }
  let rv = [];
  for (let i = 0; i < n; i++) {
    rv.push(items[distances[i].idx]);
  }
  return rv;
}

function computeSimilarity(items, inputItem, attrX, attrY, n, isSame) {
  let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
  for (let item of items) {
    if (item[attrX] < xmin) {
      xmin = item[attrX];
    }
    if (item[attrX] > xmax) {
      xmax = item[attrX];
    }
    if (item[attrY] < ymin) {
      ymin = item[attrY];
    }
    if (item[attrY] > ymax) {
      ymax = item[attrY];
    }
  }
  let distances = [];
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (isSame(item, inputItem)) {
      continue;
    }
    let similarity =
      Math.sqrt(
        Math.pow((inputItem[attrX] - item[attrX])/(xmax - xmin), 2) + 
        Math.pow((inputItem[attrY] - item[attrY])/(ymax - ymin), 2)
      );
    distances.push({idx: i, similarity: similarity});
  }
  distances.sort((d1, d2) => d1.similarity - d2.similarity);
  if (n > distances.length) {
    n = distances.length;
  }
  let rv = [];
  for (let i = 0; i < n; i++) {
    rv.push(items[distances[i].idx]);
  }
  return rv;
}

// 
app.get('/solarsystems', (req, res) => {
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

