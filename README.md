# Installation Procedure

Installing Cosmic Insights is a three-step process. First, you set up the database layer, then the backend server, and then the frontend server.

## Setting up the database

This section deals with installing MySQL and running the seeder SQL and Python scripts to clean, parse, and load the CSV cosmic data into the database. Steps:

1. Install MySQL and set up a local account. ([This link](https://dev.mysql.com/doc/mysql-getting-started/en/) might help.)                                                  
2. From the `db` directory, enter a MySQL shell and run `source seeder.sql`.                                                                                                 
3. Then, modify your local MySQL username and password in `seeder.py`. (The `user` and `password` named arguments to `mysql.connector.connect`.)                             
4. Run `seeder.py` from the `db` directory.                                                                                                                                  
5. All the data should now be available in your MySQL database. Run a query such as `SElECT pl_name FROM exoplanets` to confirm.

## Setting up the backend server

This sections detals with setting up the backend server that interacts with the MySQL database and processes and returns cosmic data on requests to it.

Steps:

1. Navigate to `backend-api/` and run `npm install express mysql2`                                                       
2. Modify your local MySQL username and password in `index.js`, in the `mysql.createConnection` invocation.
3. Start the backend server by running `node index.js`                       
4. Visit `localhost:3001/exoplanets` or `localhost:3001/solar_flares` or `localhost:3001/asteroids` or `localhost:3001/stars` to confirm that the server is up and running.

## Setting up the front-end server

This section sets up the server that returns HTML, JavaScript, and CSS for the front-end.

Steps:

1. Navigate to `frontend/` and run `npm install`. This will install all the dependencies that the front-end needs.
2. Run `npm start`.
3. Go to `localhost:3000` (it should open automatically) and start exploring Cosmic Insights!
