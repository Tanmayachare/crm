const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/:tableName', (req, res)=>{
    const tableName = req.params.tableName;
    const query = `SELECT * FROM ??`;
    db.query(query, [tableName], (err, results)=>{
        if(err) return res.status(500).json({ error: "Database query failed" });
        res.json(results);
    })
})

router.post('/:tableName', (req, res)=>{
    const tableName = req.params.tableName;
    const data = req.body;
    const query = 'INSERT INTO ?? SET ?';
    db.query(query, [tableName, data], (err, results)=>{
        if(err) return res.status(500).json({ error: "Data insertion failed" });
        res.json({ message: `Data inserted into ${tableName} successfully` });
    })
})

router.delete('/:tableName/:id',(req, res)=>{
    const tableName = req.params.tableName;
    const Id = req.params.id;
    const query = `DELETE FROM ${tableName} WHERE id = ?`;
    db.query(query, [Id], (err, results) => {
      if(err){
        return res.status(500).json({ error: "Database deletion failed" });
      }
      res.json({ message: `Data deleted from ${tableName} successfully` });
    });
})

router.put('/:tableName/:id',(req, res)=>{
    const {tableName, id} = req.params;
    const data = req.body;
    delete data.id;
    delete data.created_at;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const tamp = columns.map(c=> `${c} = ?`).join(',');
    const query = `UPDATE ?? SET ${tamp} WHERE id = ?`;
    db.query(query, [tableName, ...values, id], (err, results)=>{
        if(err){
            return res.status(500).json({ error: "Database updation failed" });
        }
        res.json({ messagge : 'good job my boi' });
    })

});

// router.put('/:tableName/:id', (req, res)=>{
//     const tableName = req.params.tableName;
//     const ID = req.params.id;
// })
module.exports = router;