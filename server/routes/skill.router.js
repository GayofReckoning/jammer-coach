const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET all skills
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT * FROM "skill"
      ORDER BY "title" ASC;`;
    pool.query(queryText)
      .then((result) => {res.send(result.rows)
     // console.log(result.rows)  
    })    
      .catch((error) => {res.sendStatus(500);
       // console.log(error);
      });
});

/**
 * GET skills of a specific category (by category id)
 */
router.get('/category:id', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT * FROM "skill" 
    JOIN skill_category  on skill.id = skill_category.skill_id
    WHERE skill_category.category_id = $1
    ORDER BY "skill"."id" ASC;`;
    pool.query(queryText, [req.params.id])
    .then((result) => {res.send(result.rows)
   // console.log(result.rows)  
  })    
    .catch((error) => {res.sendStatus(500);
      console.log(error);
    });

});

//this post route uses postgreSql transactions to allow a simultaneous
//insert into the skill title and a new row for each of the categories
//inserted in to the category_skill table
router.post('/', rejectUnauthenticated, async (req, res) =>  {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const queryText = `INSERT INTO "skill"("title", "url", "author", "description") 
     VALUES($1, $2, $3, $4) RETURNING "id";`
    const result = await client.query(queryText, [req.body.title,
         req.body.url,
         req.body.author,
         req.body.description])
    const insertText = `INSERT INTO "skill_category" ("skill_id", "category_id")
              VALUES($1 , $2);`
    for (let i =0; i<req.body.categories.length; i++ ){
      await client.query(insertText, [result.rows[0].id, req.body.categories[i].id])
    }
    await client.query('COMMIT')
    res.sendStatus(201)
  } catch (error) {
    await client.query('ROLLBACK')
    console.log(error)
    res.sendStatus(500);
  } finally {
    client.release()
  }
})

/**
 * UPDATE a skill from edit component
 */
router.put('/', rejectUnauthenticated, (req, res) => {
  const queryText = 
  `UPDATE "skill"
  SET "title" = $1,
    "url" = $2,
    "author" = $3,
    "description" = $4
  WHERE "id" = $5;`;
  const queryInput = [
    req.body.title,
    req.body.url,
    req.body.author,
    req.body.description,
    req.body.id,
  ];
  //to do: switch id to params
  pool.query(queryText, queryInput)
  .then(() => res.sendStatus(201))
  .catch((error) => {res.sendStatus(500);
    console.log(error);
    //console.log(req.body)
  });
});


//transactional post into skill_category to allow multiple
//rows added simultaneously from edit view
router.post('/cat/', rejectUnauthenticated, async (req, res) =>  {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const insertText = `INSERT INTO "skill_category" ("skill_id", "category_id")
              VALUES($1 , $2);`
    for (let i =0; i<req.body.categories.length; i++ ){
      await client.query(insertText, [req.body.id, req.body.categories[i].id])
    }
    await client.query('COMMIT')
    res.sendStatus(201)
  } catch (error) {
    await client.query('ROLLBACK')
    console.log(error)
    res.sendStatus(500);
  } finally {
    client.release()
  }
})

//transactional delete multiple rows from skill_category from edit component
router.delete('/cat/', rejectUnauthenticated, async (req, res) =>  {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const insertText = `DELETE FROM "skill_category" 
    WHERE "skill_id" = $1 AND "category_id"= $2;`
    for (let i =0; i<req.body.categories.length; i++ ){
      await client.query(insertText, [req.body.id, req.body.categories[i].id])
    }
    await client.query('COMMIT')
    res.sendStatus(201)
  } catch (error) {
    await client.query('ROLLBACK')
    console.log(error)
    res.sendStatus(500);
  } finally {
    client.release()
  }
})

//delete a skill
//this also deletes the dependant rows in skill_category before 
//deleting the skill itself from the skill table
router.delete('/:id', rejectUnauthenticated, async (req, res)=>{
    const client = await pool.connect()
    const queryText = `
    DELETE FROM "skill_category"
    WHERE "skill_id" = $1;`
    const query2 = `DELETE FROM "skill" 
    WHERE "id" = $1;`;
    try{
      await client.query('BEGIN')
      await client.query(queryText, [req.params.id])
      await client.query (query2, [req.params.id])
      await client.query('COMMIT')
      res.sendStatus(201)
    } catch (error) {
      await client.query('ROLLBACK')
      console.log(error)
      res.sendStatus(500);
    } finally {
      client.release()
    }
 
})


module.exports = router;