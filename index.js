const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("datenbank/tiere.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tiere (
    id INTEGER PRIMARY KEY,
    tierart VARCHAR(50),
    name VARCHAR(50),
    krankheit VARCHAR(100),
    age INT,
    gewicht REAL);`);
  // db.run(
  //   `INSERT INTO tiere(tierart,name,krankheit,age,gewicht) VALUES ("Hund","Bello","husten",5,12.4), ("Katze", "Mino", "Rechtes Auge Blind", 5, 8.7)`
  // );

  selectAllTiereQuery = `SELECT * FROM tiere`;
  db.all(selectAllTiereQuery, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
    }
  });
  process.on("exit", () => {
    db.close();
  });
});

app.use(express.json()); // Ermöglicht Express Json aus einem Body auszulesen
app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.send("Die API funktioniert!");
// });

app.get("/tiere", (req, res) => {
  const { tierart, name, krankheit, age, gewicht } = req.query;

  let query = "SELECT * FROM tiere";
  let conditions = [];
  let values = [];

  if (tierart) {
    conditions.push("tierart LIKE ?");
    values.push(`%${tierart}%`);
  }

  if (name) {
    conditions.push("name LIKE ?");
    values.push(`%${name}%`);
  }

  if (krankheit) {
    conditions.push("krankheit LIKE ?");
    values.push(`%${krankheit}%`);
  }

  if (age) {
    conditions.push("age = ?");
    values.push(age);
  }

  if (gewicht) {
    conditions.push("gewicht = ?");
    values.push(gewicht);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  db.all(query, values, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Fehler bei der Abfrage" });
    }

    res.json(rows);
  });
});

app.post("/tiere", (req, res) => {
  const { tierart, name, krankheit, age, gewicht } = req.body;
  db.run(
    `INSERT INTO tiere (tierart,name,krankheit,age,gewicht) VALUES(?,?,?,?,?)`,
    [tierart, name, krankheit, age, gewicht]
  );
  res.status(201).send("Tier wurde erfolgreich hinzugefügt");
});

app.get("/tiere/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM tiere WHERE id = ?";

  db.all(query, [id], (err, rows) => {
    if (err) {
      res.status(404).send("Fehler in deiner Query Anfrage");
    } else {
      res.json(rows);
    }
  });
});

app.put("/tiere/:id", (req, res) => {
  const id = req.params.id;
  const { tierart, name, krankheit, age, gewicht } = req.body;

  let updates = [];
  let values = [];

  if (tierart) {
    updates.push("tierart = ?");
    values.push(tierart);
  }

  if (name) {
    updates.push("name = ?");
    values.push(name);
  }

  if (krankheit) {
    updates.push("krankheit = ?");
    values.push(krankheit);
  }

  if (age) {
    updates.push("age = ?");
    values.push(age);
  }

  if (gewicht) {
    updates.push("gewicht = ?");
    values.push(gewicht);
  }

  if (updates.length === 0) {
    return res
      .status(400)
      .json({ error: "Es wurden keine Daten zum ändern mitgeschickt!" });
  }

  const query = `UPDATE tiere SET ${updates.join(", ")} WHERE id = ?`;
  values.push(id);

  db.run(query, values, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Fehler in deiner Query Anfrage");
    }

    db.get("SELECT * FROM tiere WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send("Fehler beim Abrufen des geänderten Eintrags");
      }

      return res.json(row);
    });
  });
});

app.delete("/tiere/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM tiere WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Fehler beim Abrufen des Eintrags" });
    }

    if (!row) {
      return res.status(404).json({ error: "Eintrag nicht gefunden" });
    }

    db.run("DELETE FROM tiere WHERE id = ?", [id], (err) => {
      if (err) {
        return res.status(500).json({ error: "Fehler beim Löschen" });
      }

      res.json({
        message: "Eintrag wurde gelöscht",
        deleted: row,
      });
    });
  });
});

app.listen(3000);
