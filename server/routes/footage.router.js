const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * GET all user footage
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    const queryString = `SELECT * FROM "user_footage";`;
    pool.query(queryString)
      .then((result) => {res.send(result.rows)
    //  console.log(result.rows)  
    })    
      .catch((error) => {res.sendStatus(500);
        console.log(error);
      });    
});

/**
 * POST new row to user_footage
 */
router.post('/', rejectUnauthenticated, (req, res) => {
    const queryString =  `INSERT INTO "user_footage"
    ("user_skill_id", "url", "added_by", "notes")
    VALUES($1, $2, $3, $4)` 
    const postArray = [
        req.body.user_skill_id,
        req.body.url,
        req.body.added_by,
        req.body.notes,
    ] 
    pool.query(queryString, postArray)
    .then(()=>{res.sendStatus(201)})
    .catch((error)=>{
     res.sendStatus(500)
     console.log(error);
   }) 
});

//DELETE a row from user_footage
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  const queryText = `DELETE FROM "user_footage"
  WHERE id = $1`;
  pool.query(queryText, [req.params.id])
  .then(() => {res.sendStatus(200) 
})    
  .catch((error) => {res.sendStatus(500);
    console.log(error);
  });

});


module.exports = router;