const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/',(req,res)=>{
  const query = "SELECT * FROM leads";
  db.query(query, (err, results) => {
    if (err){
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
})

router.post('/',(req, res)=>{
  const {name, company, value, status} = req.body;
  const query = "INSERT INTO leads (name, company, value, status) VALUES (?, ?, ?, ?)";
  db.query(query, [name, company, value, status], (err, results) => {
    if(err){
      return res.status(500).json({ error: "Database insertion failed" });
    }
    res.json({
      message: "Lead added successfully",
      id: results.insertId
    })
  })
})

router.delete('/:id',(req, res)=>{
  const leadId = req.params.id;
  const query = "DELETE FROM leads WHERE id = ?";
  db.query(query, [leadId], (err, results) => {
    if(err){
      return res.status(500).json({ error: "Database deletion failed" });
    }
    res.json({ message: "Lead deleted successfully" });
  });
})

router.put('/:id',(req, res)=>{
  const leadId = req.params.id;
  const status = req.body.status;
  const query = "UPDATE leads SET status = ? WHERE id = ?";
  db.query(query, [status, leadId], (err, results) => {
    if(err){
      return res.status(500).json({ error: "Database update failed" });
    }
    res.json({ message: "Lead updated successfully" });
  });
})


module.exports = router;