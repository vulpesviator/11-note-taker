const express = require("express");
const path = require("path");

const uuid = require('./helpers/uuid');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static("public"));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add note`);

    const { title, text, note_id} = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);
    } else {
        res.json(`There was a problem adding the note`);
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});