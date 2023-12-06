const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 4000;

// MySQL database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'charan_local',
    password: 'Charan@123',
    database: 'locations_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


app.use(express.json());

app.post('/insertLocations', (req, res) => {
    const { sourcename,destname, sourcelat,sourcelong,destlat,destlong } = req.body;

    const insertQuery = 'INSERT INTO locations (sourcename,destname, sourcelat,sourcelong,destlat,destlong) VALUES (?, ?)';
    db.query(insertQuery, [sourcename,destname, sourcelat,sourcelong,destlat,destlong], (err, results) => {
        if (err) {
            console.error('Error executing insert query:', err);
            res.status(500).send('Error inserting data into the database');
            return;
        }

        console.log('Inserted new user with ID:', results.insertId);
        res.status(200).send('Data inserted successfully');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
