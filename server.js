const express = require("express");
const path = require("path");
const fs = require('fs');

const uniqid = require('uniqid');

const PORT = process.env.PORT || 3001;
const app = express();

/* Express middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

/* API Routes */
app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request for notes`);
    const notes = pullNotes();
    res.json(notes);
});

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uniqid(),
        };

        const notes = pullNotes();
        notes.push(newNote);
        addNote(notes);

        res.json(newNote);

    } else {
        res.json(`There was a problem adding the note`);
    }
});

app.delete("/api/notes/:id", (req, res) => {
    console.info(`${req.method} delete note request made`);

    const noteId = req.params.id;
    let notes = pullNotes();
    const updateNotes = notes.filter((note) => notes.note_id !== noteId);

    if (notes.length === updateNotes.length) {
        res.json(error);
    } else {
        addNote(updateNotes);
        res.json('Note removed')
    }
});

/* notes.html */
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

/* index.html */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

/* fucntions for reading/writing notes */
function pullNotes() {
    const data = fs.readFileSync(path.join(__dirname, "./db/db.json"));
    return JSON.parse(data);
}

function addNote (notes) {
    fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(notes, null, 4))
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});