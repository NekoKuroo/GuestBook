    const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('notesList');
    let editNoteId = null ; // mode edit
    
    // render catatan dari server
    async function fetchNotes() {
      const res = await fetch ("/notes");
      const data = await res.json();
      renderNotes(data);
    }
    
    // render daftar catatan
    function renderNotes(notes) {
      notesList.innerHTML = ''; // kosongkan dulu
      
      notes.forEach((note) => {
      const noteCard = document.createElement("div");
      noteCard.className = "note-card";

      const title = document.createElement("h3");
      title.textContent = note.title;

      const content = document.createElement("p");
      content.textContent = note.content;

      const actions = document.createElement("div");
      actions.className = "note-actions";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => {
        document.getElementById("noteTitle").value = note.title;
        document.getElementById("noteContent").value = note.content;
        editNoteId = note.id; // simpan id yang sedang di-edit
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Hapus";
      deleteBtn.addEventListener("click", async () => {
        await fetch(`/notes/${note.id}`, { method: "DELETE" });
        fetchNotes();
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      noteCard.appendChild(title);
      noteCard.appendChild(content);
      noteCard.appendChild(actions);

      notesList.appendChild(noteCard);
  });
    }

    // tambah/edit catatan
    noteForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const title = document.getElementById('noteTitle').value.trim();
      const content = document.getElementById('noteContent').value.trim();

      if (!title || !content) return;

      if(editNoteId){
        //mode edit
        await fetch(`/notes/${editNoteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({ title, content }),
        });
        editNoteId = null;
      } else {
        // mode tambah
        await fetch("/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({ title, content }),
        });
      }
      noteForm.reset();
      fetchNotes(); 
  });
    // awal render (kosong)
    fetchNotes();
