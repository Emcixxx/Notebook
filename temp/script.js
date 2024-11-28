let editingNoteCard = null;
adjustTextareaHeight(document.getElementById('noteInput'));

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    textarea.style.height = (textarea.scrollHeight - lineHeight * 2) + 'px';
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

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('note-card-actions');

    const checkboxContainer = document.createElement('label');
    checkboxContainer.classList.add('note-card-checkbox');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('note-card-checked');
    checkbox.onchange = saveNotes; 

    checkboxContainer.textContent = '';
    checkboxContainer.prepend(checkbox); 

    actionsContainer.appendChild(checkboxContainer); 
    noteCard.appendChild(noteCardContent);
    noteCard.appendChild(actionsContainer); 
    noteList.appendChild(noteCard);
    
    const checkButton = document.createElement('span');
    checkButton.classList.add('note-card-check');
    checkButton.textContent = '✔';
    checkButton.onclick = function() { toggleDone(noteCard); };

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('note-card-delete');
    deleteButton.textContent = 'X';
    deleteButton.onclick = function() { deleteNote(noteCard); };

    const editButton = document.createElement('span');
    editButton.classList.add('note-card-edit');
    editButton.textContent = '✎';
    editButton.onclick = function() { editNote(noteCard, noteInput); };

    const actions = document.createElement('div');
    actions.classList.add('note-card-actions');
    actions.appendChild(checkButton);
    actions.appendChild(deleteButton);
    actions.appendChild(editButton);

    noteCard.appendChild(noteCardContent);
    noteCard.appendChild(actions);

    noteList.appendChild(noteCard);
  }

  document.getElementById('noteInput').value = '';
  saveNotes();
  adjustTextareaHeight(document.getElementById('noteInput'));
}

function toggleDone(noteCard) {
  noteCard.querySelector('.note-card-content').classList.toggle('note-card-done');
}

function deleteNote(noteCard) {
  noteCard.remove();
}

function clearNotes() {
  const confirmation = confirm("Czy na pewno chcesz usunąć wszystkie notatki?");
  if (confirmation) {
    const noteList = document.getElementById('noteList');
    noteList.innerHTML = ''; 
    localStorage.removeItem('notes'); 
  }
}

function editNote(noteCard, originalText) {
  editingNoteCard = noteCard;
  document.getElementById('noteInput').value = originalText;
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

    //ŁŁ 26.11
    //kontener akcji na przyciski główne
    const noteCardActions = document.createElement('div');
      noteCardActions.classList.add('note-card-actions');
    //ŁŁ

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('note-card-delete');
    deleteButton.textContent = '❌';
    deleteButton.onclick = function() { deleteNote(noteCard); };

    const editButton = document.createElement('span');
    editButton.classList.add('note-card-edit');
    editButton.textContent = '✏️';
    editButton.onclick = function() { editNote(noteCard, note); };

    //ŁŁ 25.11
    // Dodawanie przycisków do kontenera akcji
    noteCardActions.appendChild(editButton);
    noteCardActions.appendChild(deleteButton);

    // Dodawanie elementów do notatki
    noteCard.appendChild(noteCardContent);
    noteCard.appendChild(noteCardActions);
      noteList.appendChild(noteCard);
    //ŁŁ
  }
};
