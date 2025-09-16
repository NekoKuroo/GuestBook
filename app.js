const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('notesList');
    let notes = []; // array penampung catatan

    // render daftar catatan
    function renderNotes() {
      notesList.innerHTML = ''; // kosongkan dulu
      notes.forEach((note, index) => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <div class="note-actions">
            <button class="edit" onclick="editNote(${index})">Edit</button>
            <button class="delete" onclick="deleteNote(${index})">Hapus</button>
          </div>
        `;
        notesList.appendChild(noteCard);
      });
    }

    // tambah catatan
    noteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('noteTitle').value.trim();
      const content = document.getElementById('noteContent').value.trim();

      if (title && content) {
        notes.push({ title, content });
        renderNotes();
        noteForm.reset();
      }
    });

    // hapus catatan
    function deleteNote(index) {
      notes.splice(index, 1);
      renderNotes();
    }

    // edit catatan
    function editNote(index) {
      const note = notes[index];
      document.getElementById('noteTitle').value = note.title;
      document.getElementById('noteContent').value = note.content;

      // hapus catatan lama, nanti simpan ulang setelah submit
      notes.splice(index, 1);
      renderNotes();
    }

    // awal render (kosong)
    renderNotes();