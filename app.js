const express = require("express");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());

//create our first endpoint:

app.get("/api/games", (req, res) => {
  //set a limit, determine start and end values
  const { start = 0, end = 200, search } = req.query; //if start and/or end are passed in defaults will be overwritten
  const limit = Math.min(end - start, 200); //this makes sure that we don't try to get more than 200 records
  const args = [parseInt(start), parseInt(limit)];
  let query;
  if (search) {
    //add search to the front of the array
    args.splice(0, 0, search);
    query = "Select * from games where name like concat('%',?,'%') Limit ?,?";
  } else {
    query = "Select * from games Limit ?,?";
  }
  console.log(query);
  //query takes the query string, a list of arguments for the "?", and a callback (err, results)
  db.query(query, args, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "DB Error" });
    } else {
      const response = {
        start: start,
        limit: limit,
        num_records: results.length,
        records: results,
      };
      res.send(response);
    }
  });
});
