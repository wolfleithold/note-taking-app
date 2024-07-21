const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.json());
// route that gets all notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading db.json file:", err);
      return res.status(500).json({ error: "Failed to read notes data" });
    }
    res.json(JSON.parse(data));
  });
});
// route that adds new notes
app.post("/api/notes", (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading db.json file:", err);
      return res.status(500).json({ error: "Failed to read notes data" });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.error("Error writing to db.json file:", err);
        return res.status(500).json({ error: "Failed to save note" });
      }
      res.json(newNote);
    });
  });
});
// delete route by id
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading db.json file:", err);
      return res.status(500).json({ error: "Failed to read notes data" });
    }
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err) => {
      if (err) {
        console.error("Error writing to db.json file:", err);
        return res.status(500).json({ error: "Failed to delete note" });
      }
      res.json({ msg: "Note deleted" });
    });
  });
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});
// a catch all get route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
