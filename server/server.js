const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');


const db = require('./config/db'); 
const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/leads', require('./routes/leads'));
app.use('/api/schema', require('./routes/schema'));
app.use('/api/data', require('./routes/data'));
app.use('/api/tab', require('./routes/tabs'));

app.get('/api/dashboard-status1',(req, res)=>{
  const query = 'select count(*) as total_leads, sum(value) as total_value from leads';
  db.query(query, (err, results)=>{
    if(err){
      return res.status(500).json({ error: "Database query failed" });
    }
    return res.json(results[0]);
  })
})

app.get('/api/dashboard-status2',(req, res)=>{
  const query = 'select count(*) as total_objects from information_schema.tables where table_schema = "crm_db"';
  db.query(query, (err, results)=>{
    if(err){
      return res.status(500).json({ error: "Database query failed" });
    }
    return res.json(results[0]);
  })
})

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`🚀 Server running on ${PORT}`);
});