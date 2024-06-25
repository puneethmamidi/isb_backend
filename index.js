const config = require('./config/environment');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const mysql2 = require('mysql');
const app = express();
app.use(express.json());

const options = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'test',
    ssl: process.env.DB_ENABLE_SSL === 'true' ? {
       minVersion: 'TLSv1.2',
       ca: process.env.DB_CA_PATH ? fs.readFileSync(process.env.DB_CA_PATH) : undefined
    } : null,
 }


const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const db = mysql2.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    ssl:{
        ca:''
    }
   
});

// Checking Database Connection
db.connect((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Database connected!');

});
// Vercel
app.get("/", (req, res) => res.send("Express on Vercel"));

app.get('/object/:id', (req, res) => {
    const id = parseInt(req.params.id); // Ensure id is parsed as an integer
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID parameter' });
      return;
    }
  
    const sql = "SELECT * FROM words WHERE id = ?";
    
    db.query(sql,[id], (err, rows) => {
      if (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      
      if (!rows.length) {
        res.status(404).json({ error: 'Object not found' });
        return;
      }
      
      const result = {
        id: rows[0].id,
        word: rows[0].word
      };
  
      res.json(result);
    });
  });
  


app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });