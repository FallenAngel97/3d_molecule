require('dotenv').config()
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/student', (req,res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.post('/addToDb', (req,res)=>{
  let pgp = require("pg-promise")()
  let db = pgp(process.env.DATABASE_URL);
  db.none("CREATE TABLE IF NOT EXISTS reactions (id SERIAL PRIMARY KEY, components VARCHAR(500), \"resultMolecule\" VARCHAR(500), \"reactionName\" VARCHAR(2000))")
  .then(data => {
    console.log('successfully created');
    db.one(`INSERT INTO reactions(components, "resultMolecule", "reactionName") VALUES ($1,$2,$3)`,[req.body.array, req.body.result, req.body.reactionName])
    .then(data => {
        console.log(data); // print new user id;
        db.$pool.end();
    })
    .catch(error => {
        console.log('ERROR:', error); // print error;
        db.$pool.end();
    });
  })
  .catch(error => {
      console.log(error);
      db.$pool.end();
  });
});

app.get("/getFormulas", (req, res)=> {
  let pgp = require("pg-promise")()
  let db = pgp(process.env.DATABASE_URL);
  db.any('SELECT * FROM reactions')
    .then(function(data) {
        res.send(JSON.stringify(data));
        db.$pool.end();
    })
    .catch(function(error) {
        console.log(error);
        db.$pool.end();

    });
});

app.get("/deleteFormula", (req, res) => {
  console.log(req.query.formulaId);
  let pgp = require("pg-promise")()
  let db = pgp(process.env.DATABASE_URL);
  let sql = `DELETE FROM reactions WHERE id=$1`;
  db.result(sql, req.query.formulaId)
  .then(result => {
    db.any('SELECT * FROM reactions')
    .then(function(data) {
        res.send(JSON.stringify(data));
        db.$pool.end();
    })
    .catch(function(error) {
        console.log(error);
        db.$pool.end();
    });
  })
  .catch(error => {
      console.log('ERROR:', error);
      db.$pool.end();
  });
});

var listener = app.listen(port, () => {
  console.log("Listening on port " + listener.address().port)
});