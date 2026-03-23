const express = require('express');
const db = require('../config/db');
const router = express.Router();

// router.get('/tabs', (req, res)=>{
//     const query = "SELECT * FROM tabs ORDER BY tab_order ASC";
//     db.query(query, (err, results)=>{
//         if(err){
//             return res.status(500).json({ error: "Database query failed" });
//         }
//         res.json(results);
//     })
// })

router.get('/objects', (req, res)=>{
    const query = "SHOW TABLES";
    db.query(query, (err, results)=>{
        if(err){
            return res.status(500).json({ error: "Database query failed" });
        }
        const tables = results.map(row => Object.values(row)[0]);
        res.json(tables);
    })
})

router.post('/objects', (req, res)=>{
    const tableName = req.body.tableName;
    const query = `Create table ${tableName} (id int primary key auto_increment, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    db.query(query, (err, results)=>{
        if(err) return res.status(500).json({ error: "Object creation failed" });
        res.json({ message: `Object ${tableName} created successfully` });
    })
})


router.get('/objects/:tableName/fields', (req, res)=>{
    const tableName = req.params.tableName;
    const query = `DESCRIBE ${tableName}`;
    db.query(query, (err, results)=>{
        if(err){
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    })
})

router.post('/objects/:tableName/fields', (req, res)=>{
    const tableName = req.params.tableName;
    const { fieldName, fieldType, refObj } = req.body;
    let query;
    if(fieldType == 'LOOKUP'){
        query = `ALTER TABLE ${tableName}
        ADD COLUMN ${fieldName} INT,
        ADD CONSTRAINT fk_${tableName}_${fieldName}
        FOREIGN KEY (${fieldName})
        REFERENCES ${refObj}(id)`;
    }
    else{
        query = `ALTER TABLE ${tableName} ADD COLUMN ${fieldName} ${fieldType}`;
        console.log(query);
    }
    db.query(query, (err, results)=>{
        if(err) return res.status(500).json({ error: "Field creation failed", err });
        res.json({ message: `Field ${fieldName} added to ${tableName} successfully` });
    })
})

router.delete('/objects/:tableName/:colName', (req, res)=>{
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