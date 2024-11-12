let editingNoteCard = null;

function adjustTextareaHeight(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

function addOrUpdateNote() {
  const noteInput = document.getElementById('noteInput').value;
  if (!noteInput) return;

  const noteList = document.getElementById('noteList');

  if (editingNoteCard) {
    const noteCardContent = editingNoteCard.querySelector('.note-card-content');
    noteCardContent.innerHTML = noteInput.replace(/\n/g, '<br>');
    editingNoteCard = null;
  } else {
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');

    const noteCardContent = document.createElement('div');
    noteCardContent.classList.add('note-card-content');
    noteCardContent.innerHTML = noteInput.replace(/\n/g, '<br>');

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('note-card-delete');
    deleteButton.textContent = 'X';
    deleteButton.onclick = function() { deleteNote(noteCard); };

    const editButton = document.createElement('span');
    editButton.classList.add('note-card-edit');
    editButton.textContent = '✎';
    editButton.onclick = function() { editNote(noteCard, noteInput); };

    noteCard.appendChild(noteCardContent);
    noteCard.appendChild(editButton);
    noteCard.appendChild(deleteButton);
    noteList.appendChild(noteCard);
  }

  document.getElementById('noteInput').value = '';
  adjustTextareaHeight(document.getElementById('noteInput'));
  saveNotes();
}

function editNote(noteCard, currentContent) {
  editingNoteCard = noteCard;
  document.getElementById('noteInput').value = currentContent.replace(/<br>/g, '\n');
  adjustTextareaHeight(document.getElementById('noteInput'));
}

function deleteNote(noteCard) {
  noteCard.remove();
  saveNotes();
}

function clearNotes() {
  const confirmation = confirm("Czy na pewno chcesz usunąć wszystkie notatki?");
  if (confirmation) {
    const noteList = document.getElementById('noteList');
    noteList.innerHTML = '';
    localStorage.removeItem('notes');
  }
}

function saveNotes() {
  const noteList = document.getElementById('noteList');
  const notes = [];

  for (const noteCard of noteList.children) {
    const noteContent = noteCard.querySelector('.note-card-content').innerHTML;
    notes.push(noteContent.replace(/<br>/g, '\n'));
  }

  localStorage.setItem('notes', JSON.stringify(notes));
}

window.onload = function() {
  const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];

  for (const note of storedNotes) {
    const noteList = document.getElementById('noteList');
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');

    const noteCardContent = document.createElement('div');
    noteCardContent.classList.add('note-card-content');
    noteCardContent.innerHTML = note.replace(/\n/g, '<br>');

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('note-card-delete');
    deleteButton.textContent = 'X';
    deleteButton.onclick = function() { deleteNote(noteCard); };

    const editButton = document.createElement('span');
    editButton.classList.add('note-card-edit');
    editButton.textContent = '✎';
    editButton.onclick = function() { editNote(noteCard, note); };

    noteCard.appendChild(noteCardContent);
    noteCard.appendChild(editButton);
    noteCard.appendChild(deleteButton);
    noteList.appendChild(noteCard);
  }
};
