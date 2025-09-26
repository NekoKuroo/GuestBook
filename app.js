const guestForm = document.getElementById('guestForm');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const messagesList = document.getElementById('messages');

let messages = JSON.parse(localStorage.getItem('messages')) || [];
let editIndex = null;

// function saveToLocal(){
//   localStorage.setItem('messages', JSON.stringify(messages));
// }

// render pesan dari server
async function fetchMessages() {
  const res = await fetch("/messages");
  const data = await res.json();
  render(data);
}

// function tambahBuku(nama, pesan){
//   if(!nama || !pesan ) return;
//   messages.push({ nama, pesan });
//   saveToLocal();
//   render();
// }

// function editBuku(index,nama,pesan){
//   if(messages[index] && nama && pesan){
//     messages[index] = { nama, pesan };
//     saveToLocal();
//     render()
//   }
// }

// async function hapusBuku(index){
//   await fetch(`/messages/${index}`, { method: "DELETE" });
//   fetchMessages();
// }
guestForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nama = nameInput.value.trim();
  const pesan = messageInput.value.trim(); 

  if(editIndex === null) {
    await fetch("/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify ({ nama, pesan }),
    });
  } else {
    await fetch(`/messages/${editIndex}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify ({ nama, pesan }),
    });
    editIndex = null
  }
  
  guestForm.reset();
  fetchMessages();
});

async function hapusBuku(index){
  await fetch(`/messages/${index}`, { method: "DELETE" });
  fetchMessages();
}

function render(messages){
  messagesList.innerHTML = "";

  messages.forEach((msg, index) => {
    const div = document.createElement('div');
    const li = document.createElement('li');

    const span = document.createElement('span');

    const strong = document.createElement('strong');
    strong.textContent = `Customer: ${msg.nama}`;

    const paraf = document.createElement('p');
    paraf.textContent = `Isi pesan: ${msg.pesan}`;

    const hapusBtn = document.createElement('button');
    hapusBtn.classList.add('hapusBtn');
    hapusBtn.textContent = 'Hapus';
    hapusBtn.addEventListener('click', () => hapusBuku(index));

    const editBtn = document.createElement('button');
    editBtn.classList.add('editBtn');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      nameInput.value = msg.nama;
      messageInput.value = msg.pesan;
      editIndex = index;
    });

    span.appendChild(strong);
    span.appendChild(paraf);
    li.appendChild(span);
    div.appendChild(li);
    div.appendChild(hapusBtn);
    div.appendChild(editBtn);
    messagesList.appendChild(div);
  });
}

// pertama kali load
fetchMessages();
