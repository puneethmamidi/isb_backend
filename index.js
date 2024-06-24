const config = require('./config/environment');
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());


const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;



const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
  });


// Checking Database Connection
db.connect((err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Database Connected');
}); 


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