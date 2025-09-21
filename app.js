const guestForm = document.getElementById('guestForm');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const messagesList = document.getElementById('messages');

let messages = JSON.parse(localStorage.getItem('messages')) || [];
let editIndex = null;

function saveToLocal(){
  localStorage.setItem('messages', JSON.stringify(messages));
}

function tambahBuku(nama, pesan){
  if(!nama || !pesan ) return;
  messages.push({ nama, pesan });
  saveToLocal();
  render();
}

function editBuku(index,nama,pesan){
  if(messages[index] && nama && pesan){
    messages[index] = { nama, pesan };
    saveToLocal();
    render()
  }
}

function hapusBuku(index){
  if(messages[index]){
    messages.splice(index,1);
    saveToLocal();
    render();
  }
}

function render(){
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
  })
}

guestForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nama = nameInput.value.trim();
  const pesan = messageInput.value.trim(); 

  if(editIndex === null) {
    tambahBuku(nama,pesan);
  } else {
    editBuku(editIndex, nama, pesan);
    editIndex = null;
  }
  
  guestForm.reset();
});
render();
