1. `npm install express mysql2`
2. `node index.js`
3. Visit `localhost:3000/exoplanets` or `localhost:3000/solar_flares` or `localhost:3000/asteroids` or `localhost:3000/stars`
4. or try `curl http://localhost:3000/<dataset>`

# API Information

1. `/exoplanets/solarsystems` for a list of solar systems
   ```
   [{"hostname":"11 Com"},{"hostname":"11 UMi"},{"hostname":"14 And"},{"hostname":"14 Her"}]
   ```
2. `/exoplanets/` for a list of exoplanets.
   Query parameters:
   - `hostname`: Returns exoplanets with the passed hostname.
   - `limit`: If no `hostname`, this limits the number of exoplanets returned.
  
3. `/asteroids/` for a list of asteroids with optional filtering and limiting.
   Query parameters:
   - `columns`: Comma-separated list of column names to filter on.
   - `values` : Comma-separated list of values to match with the specified columns.
                Supports exact values, >= (greater than or equal), and <= (less than or equal).
   - `limit`:  Limits the number of results returned. Default is 30.

   Examples:
   Asteroids without any filtering
   `/asteroids/` - Returns the first 30 asteroids

   Asteroids without any filtering but only the first 10
   `/asteroids/?limit=10`

   Asteroids with range filtering (less than or equal)
   `/asteroids/?columns=eccentricity&values=<=0.3`

   Asteroids with multiple filters
   `/asteroids/?columns=minimum_orbit_intersection,eccentricity&values=0.05,0.3`
