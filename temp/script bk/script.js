let editingNoteCard = null;

// Adjust textarea height dynamically
adjustTextareaHeight(document.getElementById('noteInput'));
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    textarea.style.height = (textarea.scrollHeight - lineHeight * 2) + 'px';
}

// Add or update a note
function addOrUpdateNote() {
    const noteInput = document.getElementById('noteInput').value;
    if (!noteInput) return;

    const noteList = document.getElementById('noteList');

    if (editingNoteCard) {
        // Update existing note
        const noteCardContent = editingNoteCard.querySelector('.note-card-content');
        noteCardContent.innerHTML = noteInput.replace(/\n/g, '<br>');
        editingNoteCard = null;
    } else {
        // Create a new note
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');

        const noteCardContent = document.createElement('div');
        noteCardContent.classList.add('note-card-content');
        noteCardContent.innerHTML = noteInput.replace(/\n/g, '<br>');

        const actionsContainer = createActionsContainer(noteCard);
        noteCard.appendChild(noteCardContent);
        noteCard.appendChild(actionsContainer);
        noteList.appendChild(noteCard);
    }

    // Clear input and save notes
    document.getElementById('noteInput').value = '';
    saveNotes();
    adjustTextareaHeight(document.getElementById('noteInput'));
}

// Create action buttons and checkbox for a note
function createActionsContainer(noteCard) {
    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('note-card-actions');

    // Checkbox for "pinned" functionality
    const checkboxContainer = document.createElement('label');
    checkboxContainer.classList.add('note-card-checkbox');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('note-card-checked');
    checkbox.onchange = saveNotes;
    checkbox.checked = false; // Default to unchecked for new notes

    checkboxContainer.textContent = ''; // Ensure label doesn't have extra text
    checkboxContainer.prepend(checkbox);
    actionsContainer.appendChild(checkboxContainer);

    // Add "done", "edit", and "delete" buttons
    const checkButton = document.createElement('span');
    checkButton.classList.add('note-card-check');
    checkButton.textContent = '✔';
    checkButton.onclick = () => toggleDone(noteCard);

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('note-card-delete');
    deleteButton.textContent = '❌';
    deleteButton.onclick = () => deleteNote(noteCard);

    const editButton = document.createElement('span');
    editButton.classList.add('note-card-edit');
    editButton.textContent = '✏️';
    editButton.onclick = () => editNote(noteCard);

    // Append buttons to the actions container
    actionsContainer.appendChild(checkButton);
    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);

    return actionsContainer;
}

// Clear all notes
function clearNotes() {
    const confirmation = confirm("Czy na pewno chcesz usunąć wszystkie notatki?");
    if (confirmation) {
        const noteList = document.getElementById('noteList');
        noteList.innerHTML = '';
        localStorage.removeItem('notes');
    }
}

// Edit a note
function editNote(noteCard) {
    editingNoteCard = noteCard;
    const noteContent = noteCard.querySelector('.note-card-content').innerHTML.replace(/<br>/g, '\n');
    document.getElementById('noteInput').value = noteContent;
}

// Save notes to localStorage
function saveNotes() {
    const noteList = document.getElementById('noteList');
    const notes = [];

    for (const noteCard of noteList.children) {
        const noteContent = noteCard.querySelector('.note-card-content').innerHTML;
        const isChecked = noteCard.querySelector('.note-card-checkbox input').checked; // Save checkbox status
        const isDone = noteCard.querySelector('.note-card-content').classList.contains('note-card-done'); // Save "done" status
        notes.push({ content: noteContent.replace(/<br>/g, '\n'), checked: isChecked, done: isDone });
    }

    localStorage.setItem('notes', JSON.stringify(notes));
}

// Load notes on page refresh
window.onload = function () {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteList = document.getElementById('noteList');

    for (const note of storedNotes) {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');

        const noteCardContent = document.createElement('div');
        noteCardContent.classList.add('note-card-content');
        noteCardContent.innerHTML = note.content.replace(/\n/g, '<br>');
        if (note.done) noteCardContent.classList.add('note-card-done'); // Restore "done" status

        const actionsContainer = createActionsContainer(noteCard);

        // Restore checkbox state
        const checkbox = actionsContainer.querySelector('.note-card-checked');
        checkbox.checked = note.checked;

        noteCard.appendChild(noteCardContent);
        noteCard.appendChild(actionsContainer);
        noteList.appendChild(noteCard);
    }
};

// Toggle note as "done"
function toggleDone(noteCard) {
    const noteContent = noteCard.querySelector('.note-card-content');
    noteContent.classList.toggle('note-card-done');
    saveNotes();
}

// Delete a note
function deleteNote(noteCard) {
    noteCard.remove();
    saveNotes();
}
