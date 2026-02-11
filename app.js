const express = require("express");
const app = express();
const PORT = 3000;
const db = require("./db");
const { error } = require("node:console");

app.use(express.json());

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
app.get("/api/games/:id", (req, res) => {
  const game_id = req.params.id;

  const query = "SELECT * FROM games WHERE game_id = ?";

  db.query(query, [game_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(results);
  });
});
//POST will be used for inserting new records
app.post(`/api/games`, (req, res) => {
  const { game_id, name, category, summary } = req.body;
  const query =
    "Insert into games(game_id,name,category,summary) values (?,?,?,?)";
  db.execute(query, [game_id, name, category, summary], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(201).json({ message: "Game added", id: game_id });
    }
  });
});
app.put("/api/games/:id", (req, res) => {
  const { name, category, summary } = req.body;
  const sql =
    "Update games set name = ?, category = ?, summary = ? where game_id = ? ";
  db.execute(sql, [name, category, summary, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Game not found" });
    } else {
      res.json({ message: "Game Updated" });
    }
  });
});
app.delete("/api/games/:id", (req, res) => {
  const sql = "delete from games where game_id = ? ";
  db.execute(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Game not found" });
    } else {
      res.json({ message: "Game's Gone" });
    }
  });
});
app.listen(PORT, () => {
  console.log(`Active on http:localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Active on http:localhost:${PORT}`);
});
