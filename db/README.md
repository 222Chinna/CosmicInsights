# Data Setup

Steps:

1. Install MySQL and set up a local account. ([This link](https://dev.mysql.com/doc/mysql-getting-started/en/) might help.)
2. From the `db` directory, enter a MySQL shell and run `source seeder.sql`.
3. Then, modify your local MySQL username and password in `seeder.py`. (The `user` and `password` named arguments to `mysql.connector.connect`.)
4. Run `seeder.py` from the `db` directory.
5. All the data should now be available in your MySQL database. Run a query such as `SElECT pl_name FROM exoplanets` to confirm.
