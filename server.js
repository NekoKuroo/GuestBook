const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// file JSON untuk simpan data(simulasi localstorage)
const DATA_FILE = path.join(__dirname, "notes.json");

// Cek apakah file json sudah dibuat, jika belum maka akan dibuatkan otomatis
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    console.log("notes.json dibuat otomatis");
}

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// fungsi helper baca/tulis file
function readNotes(){
    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch(err){
        return []; //kalau file masih kosong/belum ada
    }
}

function writeNotes(notes){
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

// GET semua catatan
app.get("/notes", (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

// POST tambah catatan
app.post ("/notes", (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: "Title dan content wajib diisi"});
    }
    const notes = readNotes();
    const newNote = { id: Date.now(), title, content };
    notes.push(newNote);
    writeNotes(notes);
    res.status(201).json(newNote);
});

// PUT edit catatan
app.put("/notes/:id", (req, res ) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const notes = readNotes();
    const noteIndex = notes.findIndex((n) => n.id == id);

    if (noteIndex === -1) {
        return res.status(404).json({ error: "Note tidak ditemukan " });
    }

    notes[noteIndex] = { ...notes[noteIndex], title, content };
    writeNotes(notes);
    res.json(notes[noteIndex]);
});

// DELETE hapus catatan
app.delete("/notes/:id", (req, res) => {
    const { id } = req.params;
    let notes = readNotes();
    notes = notes.filter((n) => n.id != id);
    writeNotes(notes);
    res.json({ message: "Note dihapus" });
});

// jalankan server
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});