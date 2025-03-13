# This file "seeds" the database with exoplanet and solar flare data.
# The Data Definition Language (DDL) component is handled by a SQL
# file.

# Install:
# mysql-connector-python3

import csv
import mysql.connector
import sys
from datetime import datetime

try:
    # Modify connection parameters as needed. Run seeder.sql before running this file.
    # My local MySQL database has a "root" user with no password.
    conn = mysql.connector.connect(
        host="localhost",  # e.g., "localhost"
        user="root",
        password="",
        database="ci"
    )
    print("connected")
except:
    print("Couldn't connect to database. Make sure your MySQL server is up and running with the 'right' configuration.")

prepared_statement = """
INSERT INTO exoplanets
VALUES
  ("""
for i in range(92):
    if i == 91:
        prepared_statement += "%s)"
    else:
        prepared_statement += "%s, "

cursor = conn.cursor()

# Open the CSV file
with open('exoplanet.csv', mode='r', newline='', encoding='utf-8') as file:
    reader = csv.reader(file)
    
    # Process each row
    for idx, row in enumerate(reader):
        if idx == 0:
            continue
        print(idx)
        for i, item in enumerate(row):
            if item == "":
                row[i] = None
        try:
            cursor.execute(prepared_statement, row)
        except mysql.connector.errors.IntegrityError:
            # this should eliminate duplicate rows
            continue

prepared_statement = """
INSERT INTO solar_flares
VALUES
  ("""
for i in range(10):
    if i == 9:
        prepared_statement += "%s)"
    else:
        prepared_statement += "%s, "

# Open the CSV file
with open('solar_flares.csv', mode='r', newline='', encoding='utf-8') as file:
    reader = csv.reader(file)
    
    # Process each row
    for idx, row in enumerate(reader):
        if idx == 0:
            continue
        for i, item in enumerate(row):
            if item == "":
                row[i] = None
            elif i == 1 or i == 2 or i == 3: # convert dates into something that mysql understands
                # YYYY-MM-DDThh:mmZ to YYYY-MM-DD hh:mm:ss
                dt = datetime.strptime(row[i], "%Y-%m-%dT%H:%MZ")
                row[i] = dt.strftime("%Y-%m-%d %H:%M:%S") 
        try:
            cursor.execute(prepared_statement, row)
        except mysql.connector.errors.IntegrityError:
            # this should eliminate duplicate rows
            continue

# Code added by Charan
prepared_statement = """
INSERT INTO stars
VALUES
  ("""
for i in range(45):
    if i == 44:
        prepared_statement += "%s)"
    else:
        prepared_statement += "%s, "

cursor = conn.cursor()

# Open the CSV file
with open('stars.csv', mode='r', newline='', encoding='utf-8') as file:
    reader = csv.reader(file)
    
    # Process each row
    for idx, row in enumerate(reader):
        if idx == 0:
            continue
        print(idx)
        for i, item in enumerate(row):
            if item == "":
                row[i] = None
        try:
            cursor.execute(prepared_statement, row)
        except mysql.connector.errors.IntegrityError:
            continue

prepared_statement = """
INSERT INTO asteroids
VALUES
  ("""
for i in range(24):
    if i == 23:
        prepared_statement += "%s)"
    else:
        prepared_statement += "%s, "

# Open the CSV file
with open('asteroid_orbital_data.csv', mode='r', newline='', encoding='utf-8') as file:
    reader = csv.reader(file)
    
    # Process each row
    for idx, row in enumerate(reader):
        if idx == 0:
            continue
        for i, item in enumerate(row):
            if item == "":
                row[i] = None
        try:
            cursor.execute(prepared_statement, row)
        except mysql.connector.errors.IntegrityError:
            continue

#end

conn.commit()
cursor.close()
conn.close()
