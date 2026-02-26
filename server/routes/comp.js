const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/:tableName/:compName', (req, res)=>{
    const {tableName, compName} = req.params;
    const query = 'SELECT * FROM ?? where name = ?' ;
    db.query(query, [tableName, compName], (err, result) => {
        if(err){
            alert('Error while fetching data',err)
        }
        res.json( results );
    })
})

module.exports = router;