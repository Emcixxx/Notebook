async function generateKey() {
    return await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

async function addNote() {
    const noteInput = document.getElementById('noteInput').value;
    if (!noteInput) return;

    const key = await generateKey();
    const noteList = document.getElementById('noteList');
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');

    const noteCardContent = document.createElement('div');
    noteCardContent.classList.add('note-card-content');
    noteCardContent.textContent = noteInput;

    noteCard.appendChild(noteCardContent);
    noteList.appendChild(noteCard);

    saveNotes();
}

function saveNotes() {
    const noteList = document.getElementById('noteList');
    const notes = [];

    for (const noteCard of noteList.children) {
        const noteContent = noteCard.querySelector('.note-card-content').textContent;
        notes.push(noteContent);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
}
