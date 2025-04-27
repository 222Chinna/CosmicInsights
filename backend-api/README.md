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
