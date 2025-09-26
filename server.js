const express = require("express");
const fs = require("fs");
// const { load } = require("mime");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "messages.json");
// Cek apakah file json sudah dibuat, jika belum maka akan dibuatkan otomatis
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    console.log("messages.json dibuat otomatis");
}
// middleware
app.use(express.json());
app.use(express.static("public"));



// baca data dari file
function loadMessages() {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// simpan data ke file
function saveMessages(messages) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

// GET semua pesan
app.get("/messages", (req, res) => {
    res.json(loadMessages());
});

// POST tambah pesan
app.post("/messages", (req, res) => {
    const { nama, pesan } = req.body;
    if(!nama || !pesan) return res.status(400).json({ error: "Nama & pesan wajib diisi" });

    const messages = loadMessages();
    messages.push({ nama, pesan });
    saveMessages(messages);
    res.json({ success: true });
});

// PUT edit pesan
app.put("/messages/:index", (req, res) => {
    const { index } = req.params;
    const { nama, pesan } = req.body;
    const messages = loadMessages();

    if(!messages[index]) return res.status(404).json({ error: "Pesan tidak ditemukan" });
    
    messages[index] = { nama, pesan };
    saveMessages(messages);
    res.json({ success: true });
});

// DELETE hapus pesan
app.delete("/messages/:index", (req, res) => {
    const { index } = req.params;
    const messages = loadMessages();

    if (!messages[index]) {
        return res.status(404).json({ error : "Pesan tidak ditemukan" });
    }
    
    messages.splice(index, 1);
    saveMessages(messages);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
})
