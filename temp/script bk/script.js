let editingNoteCard = null;

adjustTextareaHeight(document.getElementById('noteInput'));
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    textarea.style.height = (textarea.scrollHeight - lineHeight * 2) + 'px';
}

document.getElementById('categorySelect').addEventListener('change', function () {
    const customCategoryInput = document.getElementById('customCategoryInput');
    customCategoryInput.style.display = this.value === 'custom' ? 'block' : 'none';
});

/*ŁŁ 09.12
Dodałem focusowanie się na tekście*/
function formatText(command) {
    document.getElementById('noteInput').focus(); 
    document.execCommand(command, false, null);
}

function changeTextColor(color) {
    document.getElementById('noteInput').focus(); 
    document.execCommand('foreColor', false, color);
}

function applyBulletPoint() {
    document.getElementById('noteInput').focus(); 
    const selectedText = window.getSelection();
    const range = selectedText.getRangeAt(0);
    const bulletPointList = document.createElement('ul');
    const listItem = document.createElement('li');
    listItem.innerHTML = range.toString();
    bulletPointList.appendChild(listItem);
    range.deleteContents();
    range.insertNode(bulletPointList);
}

/*ŁŁ 09.12
Aktualizacja stanu paska narzędzi w oparciu o zaznaczony tekst
Aktualnie pobiera nawet formatowanie z zapisanych notatek, można poprawić*/
function updateToolbarState() {

    const noteInput = document.getElementById('noteInput');
    const selection = window.getSelection();
    const isWithinNoteInput = noteInput.contains(selection.anchorNode);

    //Jeśli zaznaczenie nie znajduje się w noteInput, to nie aktualizujemy toolbara
    if (!isWithinNoteInput) return;

    const isBold = document.queryCommandState('bold');
    const isItalic = document.queryCommandState('italic');
    const isUnderline = document.queryCommandState('underline');
    const isStrikeThrough = document.queryCommandState('strikeThrough');

    //W zależności od stanu przydzielana jest klasa active do podświetlania
    document.querySelector('[onclick="formatText(\'bold\')"]').classList.toggle('active', isBold);
    document.querySelector('[onclick="formatText(\'italic\')"]').classList.toggle('active', isItalic);
    document.querySelector('[onclick="formatText(\'underline\')"]').classList.toggle('active', isUnderline);
    document.querySelector('[onclick="formatText(\'strikeThrough\')"]').classList.toggle('active', isStrikeThrough);
}
//ŁŁ

function addOrUpdateNote() {
    const noteTitle = document.getElementById('noteTitle').value.trim();  //ŁŁ
    const noteInput = document.getElementById('noteInput').innerHTML;
    const categorySelect = document.getElementById('categorySelect');
    const customCategoryInput = document.getElementById('customCategoryInput');

    let category = categorySelect.value === 'custom' ? customCategoryInput.value.trim() : categorySelect.value;

    if (!noteInput) {
        alert("Nie wpisano tekstu notatki.");
        return;
    }

    if (!category) {
        alert("Proszę wybrać kategorię przed zapisaniem notatki.");
        return;
    }

    if (!noteTitle) {
        alert("Proszę wpisać tytuł notatki.");
        return;
    }

    const noteList = document.getElementById('noteList');

    if (editingNoteCard) {
        const noteCardTitle = editingNoteCard.querySelector('.note-card-title');
        const noteCardContent = editingNoteCard.querySelector('.note-card-content');
        const noteCardCategory = editingNoteCard.querySelector('.note-card-category');

        noteCardTitle.textContent = noteTitle;  //ŁŁ
        noteCardContent.innerHTML = noteInput;
        noteCardCategory.textContent = `Kategoria: ${category}`;

        editingNoteCard = null;
    } else {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');

        const noteCardTitle = document.createElement('div');
        noteCardTitle.classList.add('note-card-title');
        noteCardTitle.textContent = noteTitle;  //ŁŁ

        const noteCardContent = document.createElement('div');
        noteCardContent.classList.add('note-card-content');
        noteCardContent.innerHTML = noteInput;

        const noteCardCategory = document.createElement('div');
        noteCardCategory.classList.add('note-card-category');
        noteCardCategory.textContent = `Kategoria: ${category}`;

        const actionsContainer = createActionsContainer(noteCard);
        noteCard.appendChild(noteCardTitle);  //ŁŁ
        noteCard.appendChild(noteCardContent);
        noteCard.appendChild(noteCardCategory);
        noteCard.appendChild(actionsContainer);
        noteList.appendChild(noteCard);
    }

    // Resetowanie formularza
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteInput').innerHTML = '';
    customCategoryInput.value = '';
    categorySelect.value = 'Praca';
    customCategoryInput.style.display = 'none';
    saveNotes();
    adjustTextareaHeight(document.getElementById('noteInput'));
}

function createActionsContainer(noteCard) {
    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('note-card-actions');


    // BK
    // umozliwia uzytkownikowi przypiecie notatki za pomoca checkboxa
    // checkbox dodawany jest do kazdej tworzonej notatki
    const pinNoteContainer = document.createElement('label');
    pinNoteContainer.classList.add('note-card-pinned-status');

    const pinNoteCheckbox = document.createElement('input');
    pinNoteCheckbox.type = 'checkbox';
    pinNoteCheckbox.classList.add('note-card-pinned');
    pinNoteCheckbox.onchange = saveNotes;
    pinNoteCheckbox.checked = false; 

    pinNoteContainer.textContent = ' '; 
    pinNoteContainer.prepend(pinNoteCheckbox);
    // BK


    const checkButton = document.createElement('span');
    checkButton.classList.add('note-card-check');
    checkButton.textContent = '✔';
    checkButton.onclick = () => toggleDone(noteCard);

    const editButton = document.createElement('span');
    editButton.classList.add('note-card-edit');
    editButton.textContent = '✏️';
    editButton.onclick = () => editNote(noteCard);

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('note-card-delete');
    deleteButton.textContent = '❌';
    deleteButton.onclick = () => deleteNote(noteCard);

    actionsContainer.appendChild(pinNoteContainer);
    actionsContainer.appendChild(checkButton);
    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);

    return actionsContainer;
}

function clearNotes() {
    if (confirm("Czy na pewno chcesz usunąć wszystkie notatki?")) {
        document.getElementById('noteList').innerHTML = '';
        localStorage.removeItem('notes');
    }
}

function editNote(noteCard) {
    editingNoteCard = noteCard;
    const noteTitle = noteCard.querySelector('.note-card-title').textContent;
    const noteContent = noteCard.querySelector('.note-card-content').innerHTML.replace(/<br>/g, '\n');
    const noteCategory = noteCard.querySelector('.note-card-category').textContent.replace('Kategoria: ', '');

    document.getElementById('noteTitle').value = noteTitle; //ŁŁ 09.12
    document.getElementById('noteInput').innerHTML = noteContent.replace(/\n/g, '<br>');
    
    const categorySelect = document.getElementById('categorySelect');
    const customCategoryInput = document.getElementById('customCategoryInput');

    if (['Praca', 'Szkoła', 'Zakupy', 'Do zrobienia'].includes(noteCategory)) {
        categorySelect.value = noteCategory;
        customCategoryInput.style.display = 'none';
    } else {
        categorySelect.value = 'custom';
        customCategoryInput.value = noteCategory;
        customCategoryInput.style.display = 'block';
    }
    //ŁŁ 09.12 
    //Notatka okno inputu zachowywało poprzedni rozmiar, a nie dostosowywało
    //się do rozmiaru edytowanej notatki
    adjustTextareaHeight(document.getElementById('noteInput'));
}

function saveNotes() {
    const noteList = document.getElementById('noteList');
    const notes = [];

    for (const noteCard of noteList.children) {
        const noteTitle = noteCard.querySelector('.note-card-title').textContent;
        const noteContent = noteCard.querySelector('.note-card-content').innerHTML;
        const noteCategory = noteCard.querySelector('.note-card-category').textContent.replace('Kategoria: ', '');
        const isChecked = noteCard.querySelector('.note-card-pinned-status input').checked;
        const isDone = noteCard.querySelector('.note-card-content').classList.contains('note-card-done');
        notes.push({ title: noteTitle, content: noteContent.replace(/<br>/g, '\n'), category: noteCategory, checked: isChecked, done: isDone });
    }

    localStorage.setItem('notes', JSON.stringify(notes));
}

window.onload = function () {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteList = document.getElementById('noteList');

    for (const note of storedNotes) {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');

        const noteCardTitle = document.createElement('div');
        noteCardTitle.classList.add('note-card-title');
        noteCardTitle.textContent = note.title;

        const noteCardContent = document.createElement('div');
        noteCardContent.classList.add('note-card-content');
        noteCardContent.innerHTML = note.content.replace(/\n/g, '<br>');
        if (note.done) noteCardContent.classList.add('note-card-done');

        const noteCardCategory = document.createElement('div');
        noteCardCategory.classList.add('note-card-category');
        noteCardCategory.textContent = `Kategoria: ${note.category}`;

        const actionsContainer = createActionsContainer(noteCard);

        const checkbox = actionsContainer.querySelector('.note-card-pinned');
        checkbox.checked = note.checked;

        noteCard.appendChild(noteCardTitle);  //ŁŁ
        noteCard.appendChild(noteCardContent);
        noteCard.appendChild(noteCardCategory);
        noteCard.appendChild(actionsContainer);
        noteList.appendChild(noteCard);
    }
};

// BK
// Logika sortowania notatek zapisanych w notatniku
function sortNotes(criteria) {
    const noteList = document.getElementById('noteList');
    const notes = Array.from(noteList.children);

    notes.sort((a, b) => {
        // Sortowanie alfabetycznie A-Z wedlug tytulow notatek
        if (criteria === 'title') {
            return a.querySelector('.note-card-title').textContent.localeCompare(
                b.querySelector('.note-card-title').textContent
            );
        // Sortowanie alfabetycznie A-Z wedlug nazw kategorii    
        } else if (criteria === 'category') {
            return a.querySelector('.note-card-category').textContent.localeCompare(
                b.querySelector('.note-card-category').textContent
            );
        // Sortowanie gdzie 'przypiete' wyswietlane sa jako pierwsze
        } else if (criteria === 'checked') {
            const aChecked = a.querySelector('.note-card-pinned-status input').checked;
            const bChecked = b.querySelector('.note-card-pinned-status input').checked;

            // Sortuje przypiete jako pierwsze
            if (aChecked !== bChecked) {
                return bChecked - aChecked;
            }


            // Sortuje notatki ze statusem przypiete, alfabetycznie po tytule
            return a.querySelector('.note-card-title').textContent.localeCompare(
                b.querySelector('.note-card-title').textContent
            );
        }
    });

    // Ponowne dodanie notatek do listy, teraz posortowanych w wybrany sposob
    noteList.innerHTML = '';
    for (const note of notes) {
        noteList.appendChild(note);
    }
}
// BK


function toggleDone(noteCard) {
    const noteContent = noteCard.querySelector('.note-card-content');
    noteContent.classList.toggle('note-card-done');
    saveNotes();
}

function deleteNote(noteCard) {
    noteCard.remove();
    saveNotes();
}
/*ŁŁ 09.12*/
document.addEventListener('selectionchange', updateToolbarState);
