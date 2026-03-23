const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/data', (req, res)=>{
    const query = "SELECT * FROM tabs ORDER BY tab_order ASC";
    db.query(query, (err, results)=>{
        if(err){
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    })
})

router.get('/objName/:tableName',(req,res)=>{
    const tableName = req.params.tableName;
    const query = `SELECT label FROM tabs WHERE api_name = ?`;
    db.query(query, [tableName], (err, results)=>{
        if(err){
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
        console.log(results);
    })
})

router.post('/data', (req, res)=>{
    const data = req.body;
    const query = `INSERT INTO tabs SET ?`;
    db.query(query,data, (err, results)=>{
        if(err) return res.status(500).json({ error: "Object creation failed" });
        res.json({ message: `Object created successfully` });
    })
})


router.get('/col', (req, res)=>{
    const tableName = req.params.tableName;
    const query = `DESCRIBE tabs`;
    db.query(query, (err, results)=>{
        if(err){
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    })
})

router.delete('/:tableName', (req, res)=>{
    const tableName = req.params.tableName;
    const colName = req.params.colName;
    const {key} = req.body;
    let query;
    if(key == 'MUL') query = `ALTER TABLE ?? DROP FOREIGN KEY fk_${tableName}_${colName}, DROP COLUMN ??;`
    else query = `ALTER TABLE ?? DROP COLUMN ??`
    db.query(query, [tableName, colName], (err, results)=>{
        if(err) return res.status(500).json({ error: "Error while deleting column"});
        res.json({ message: `${colName} deleted successfully`})
    })
})

module.exports = router;