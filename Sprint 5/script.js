let editingNoteCard = null;

/**
 * Aktualizuje stan paska narzędzi na podstawie bieżącego zaznaczenia tekstu.
 */
document.addEventListener('selectionchange', updateToolbarState);
editingNoteCard = null;

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

/**
 * Funkcja formatuje tekst w edytorze notatki.
 * 
 * Umożliwia zastosowanie formatowania tekstu (np. pogrubienie, kursywa, itp.) w edytorze 
 * Funkcja wykonuje odpowiednią komendę formatowania na zaznaczonym fragmencie tekstu
 * w edytorze, który jest polem o identyfikatorze `noteInput`.
 * 
 * @param {string} command - Komenda formatowania do wykonania np. pogrubienia, kursywy
 */
function formatText(command) {
    // Ustawienie fokusu na pole edycji notatki (noteInput)
    document.getElementById('noteInput').focus(); 
    // Wykonanie komendy formatowania na zaznaczonym fragmencie tekstu
    document.execCommand(command, false, null);
}

/**
 * Zmienia kolor wybranego tekstu na wskazany kolor.
 * @param {string} color - Kolor, który ma zostać zastosowany do wybranego tekstu.
*/
function changeTextColor(color) {
    document.getElementById('noteInput').focus(); 
    document.execCommand('foreColor', false, color);
}
/**
 * Opakowuje wybrany tekst w punkt listy (bullet point).
 * Tworzy nową listę nieuporządkowaną (<ul>) i wstawia wybrany tekst do elementu <li>.
 */
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

/**
 * Funkcja aktualizuje stan paska narzędzi w oparciu o aktualnie zaznaczony tekst w edytorze.
 * 
 * Funkcja sprawdza, czy zaznaczenie tekstu znajduje się w polu edycji notatki (`noteInput`). 
 * Jeśli tak, to na podstawie aktualnego formatowania tekstu (np. pogrubienie, kursywa, podkreślenie, przekreślenie),
 * aktualizowane są przyciski narzędzi na pasku narzędziowym, przypisując im klasę `active`, jeśli dany styl jest aktywny.
 * Dzięki temu użytkownik widzi, które style są aktualnie zastosowane na zaznaczonym fragmencie tekstu.
 *
 * @returns {void}
 */

function updateToolbarState() {

    // Pobranie elementu edytora notatki
    const noteInput = document.getElementById('noteInput');
    
    // Pobranie zaznaczenia użytkownika
    const selection = window.getSelection();
    
    // Sprawdzanie, czy zaznaczenie znajduje się w obrębie elementu 'noteInput'
    const isWithinNoteInput = noteInput.contains(selection.anchorNode);

    // Jeśli zaznaczenie nie jest w 'noteInput', nie aktualizujemy stanu paska narzędzi
    if (!isWithinNoteInput) return;

    // Sprawdzenie stanu formatowania zaznaczonego tekstu
    const isBold = document.queryCommandState('bold');         
    const isItalic = document.queryCommandState('italic');     
    const isUnderline = document.queryCommandState('underline'); 
    const isStrikeThrough = document.queryCommandState('strikeThrough'); 

    // Aktualizacja paska narzędzi - dodanie lub usunięcie klasy 'active' w zależności od stanu formatowania
    document.querySelector('[onclick="formatText(\'bold\')"]').classList.toggle('active', isBold);
    document.querySelector('[onclick="formatText(\'italic\')"]').classList.toggle('active', isItalic);
    document.querySelector('[onclick="formatText(\'underline\')"]').classList.toggle('active', isUnderline);
    document.querySelector('[onclick="formatText(\'strikeThrough\')"]').classList.toggle('active', isStrikeThrough);
}


/**
 * Funkcja dodaje nową notatkę lub aktualizuje istniejącą notatkę.
 * 
 * W przypadku, gdy użytkownik edytuje istniejącą notatkę, jej tytuł, treść i kategoria zostaną zaktualizowane.
 * W przypadku tworzenia nowej notatki, zostanie ona dodana do listy notatek.
 */
function addOrUpdateNote() {
    // Pobranie wartości tytułu notatki z pola tekstowego
    const noteTitle = document.getElementById('noteTitle').value.trim();  // Ładowanie tytułu
    // Pobranie zawartości notatki z edytowalnego pola
    const noteInput = document.getElementById('noteInput').innerHTML;
    // Pobranie wybranej kategorii z listy rozwijanej
    const categorySelect = document.getElementById('categorySelect');
    const customCategoryInput = document.getElementById('customCategoryInput');

    // Ustalenie kategorii notatki: jeśli użytkownik wybrał 'custom', używamy wartości z pola tekstowego
    let category = categorySelect.value === 'custom' ? customCategoryInput.value.trim() : categorySelect.value;

    // Sprawdzenie, czy zawartość notatki jest pusta
    if (!noteInput) {
        alert("Nie wpisano tekstu notatki.");
        return;
    }

    // Sprawdzenie, czy wybrano kategorię
    if (!category) {
        alert("Proszę wybrać kategorię przed zapisaniem notatki.");
        return;
    }

    // Sprawdzenie, czy tytuł notatki jest pusty
    if (!noteTitle) {
        alert("Proszę wpisać tytuł notatki.");
        return;
    }

    // Pobranie listy notatek, do której dodamy nową notatkę lub zaktualizujemy istniejącą
    const noteList = document.getElementById('noteList');

    // Sprawdzenie, czy edytujemy istniejącą notatkę
    if (editingNoteCard) {
        // Zaktualizowanie tytułu, treści i kategorii istniejącej notatki
        const noteCardTitle = editingNoteCard.querySelector('.note-card-title');
        const noteCardContent = editingNoteCard.querySelector('.note-card-content');
        const noteCardCategory = editingNoteCard.querySelector('.note-card-category');

        // Ustawienie nowych wartości dla tytułu, treści i kategorii notatki
        noteCardTitle.textContent = noteTitle;  // Ładowanie tytułu
        noteCardContent.innerHTML = noteInput;
        noteCardCategory.textContent = `Kategoria: ${category}`;

        // Po zakończeniu edycji, resetowanie zmiennej `editingNoteCard`
        editingNoteCard = null;
    } else {
        // Tworzenie nowej notatki, jeśli nie edytujemy istniejącej
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');

        // Tworzenie i ustawianie tytułu nowej notatki
        const noteCardTitle = document.createElement('div');
        noteCardTitle.classList.add('note-card-title');
        noteCardTitle.textContent = noteTitle;  // Ładowanie tytułu

        // Tworzenie i ustawianie treści nowej notatki
        const noteCardContent = document.createElement('div');
        noteCardContent.classList.add('note-card-content');
        noteCardContent.innerHTML = noteInput;

        // Tworzenie i ustawianie kategorii nowej notatki
        const noteCardCategory = document.createElement('div');
        noteCardCategory.classList.add('note-card-category');
        noteCardCategory.textContent = `Kategoria: ${category}`;

        // Tworzenie kontenera akcji dla notatki
        const actionsContainer = createActionsContainer(noteCard);

        // Dodanie wszystkich elementów (tytuł, treść, kategoria, akcje) do nowej notatki
        noteCard.appendChild(noteCardTitle);  // Ładowanie tytułu
        noteCard.appendChild(noteCardContent);
        noteCard.appendChild(noteCardCategory);
        noteCard.appendChild(actionsContainer);

        // Dodanie nowej notatki do listy notatek
        noteList.appendChild(noteCard);
    }

    // Resetowanie formularza: czyszczenie pól tytułu, treści, kategorii i ustawienie domyślnej wartości kategorii
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteInput').innerHTML = '';
    customCategoryInput.value = '';
    categorySelect.value = 'Praca';
    customCategoryInput.style.display = 'none';

    // Zapisanie notatek (np. w localStorage lub w innym miejscu)
    saveNotes();

    // Dostosowanie wysokości pola edycji notatki, aby pasowała do zawartości
    adjustTextareaHeight(document.getElementById('noteInput'));
}

/**
 * Funkcja tworzy kontener akcji dla notatki, umożliwiający przypinanie, edytowanie, oznaczanie jako wykonane oraz usuwanie notatki.
 */
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

/**
 * Funkcja umożliwia usunięcie wszystkich notatek.
 * 
 * Po wywołaniu tej funkcji użytkownik zostanie zapytany o potwierdzenie usunięcia wszystkich notatek.
 * Jeśli użytkownik potwierdzi, wszystkie notatki zostaną usunięte.
 */
function clearNotes() {
    // Wyświetlenie okna dialogowego z zapytaniem o potwierdzenie usunięcia wszystkich notatek
    if (confirm("Czy na pewno chcesz usunąć wszystkie notatki?")) {
        // Usunięcie wszystkich elementów w kontenerze notatek
        document.getElementById('noteList').innerHTML = '';
        
        // Usunięcie danych notatek zapisanych w localStorage
        localStorage.removeItem('notes');
    }
}


/**
 * Funkcja umożliwia edytowanie istniejącej notatki.
 * Po wywołaniu tej funkcji, zawartość wybranej notatki zostaje wczytana do formularza edycji, aby użytkownik mógł ją zmodyfikować.
 * @param {HTMLElement} noteCard - Element notatki, którą użytkownik chce edytować.
 */
function editNote(noteCard) {
    // Ustawienie zmiennej `editingNoteCard`, która przechowuje odniesienie do edytowanej notatki
    editingNoteCard = noteCard;

    // Pobranie tytułu notatki z elementu HTML i przypisanie go do pola edycji
    const noteTitle = noteCard.querySelector('.note-card-title').textContent;

    // Pobranie zawartości notatki (z zachowaniem linii przerwy) i przypisanie jej do pola edycji
    const noteContent = noteCard.querySelector('.note-card-content').innerHTML.replace(/<br>/g, '\n'); // Zamiana <br> na \n

    // Pobranie kategorii notatki i usunięcie prefiksu "Kategoria: "
    const noteCategory = noteCard.querySelector('.note-card-category').textContent.replace('Kategoria: ', '');

    // Ustawienie tytułu i zawartości notatki w formularzu edycji
    document.getElementById('noteTitle').value = noteTitle;  // Ustawienie tytułu w polu tekstowym
    document.getElementById('noteInput').innerHTML = noteContent.replace(/\n/g, '<br>');  // Ustawienie treści w polu edycji (z powrotem zamiana \n na <br>)

    // Pobranie elementów formularza kategorii
    const categorySelect = document.getElementById('categorySelect');
    const customCategoryInput = document.getElementById('customCategoryInput');

    // Sprawdzenie, czy kategoria jest standardowa, czy niestandardowa
    if (['Praca', 'Szkoła', 'Zakupy', 'Do zrobienia'].includes(noteCategory)) {
        // Jeśli kategoria jest standardowa, ustawić odpowiednią kategorię w formularzu i ukryć pole dla niestandardowej kategorii
        categorySelect.value = noteCategory;
        customCategoryInput.style.display = 'none';
    } else {
        // Jeśli kategoria jest niestandardowa, ustawić kategorię na 'custom' i pokazać pole do wprowadzenia własnej kategorii
        categorySelect.value = 'custom';
        customCategoryInput.value = noteCategory;
        customCategoryInput.style.display = 'block';
    }

    // Dostosowanie wysokości pola edycji notatki, aby pasowała do zawartości
    adjustTextareaHeight(document.getElementById('noteInput'));
}

/**
 * Funkcja zapisuje wszystkie notatki w lokalnej pamięci przeglądarki (localStorage).
 * Przechodzi przez wszystkie notatki wyświetlane na stronie, zbiera ich dane (tytuł, treść, kategoria, status przypięcia, status wykonania),
 * a następnie zapisuje je w `localStorage` w formacie JSON, aby zachować notatki po odświeżeniu strony.
 */
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

/**
 * Funkcja wykonuje się po załadowaniu strony i wczytuje zapisane notatki z localStorage.
 * 
 * Jeśli w localStorage znajdują się zapisane notatki, funkcja tworzy elementy HTML reprezentujące każdą notatkę,
 * a następnie dodaje je do listy notatek wyświetlanej na stronie.
 */
window.onload = function () {
    // Pobranie zapisanych notatek z localStorage. Jeśli brak zapisanych notatek, inicjalizujemy pustą tablicę.
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    
    // Pobranie kontenera, w którym będą wyświetlane notatki
    const noteList = document.getElementById('noteList');

    // Iteracja po zapisanych notatkach
    for (const note of storedNotes) {
        // Tworzenie elementu HTML dla notatki
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');

        // Tworzenie i ustawianie tytułu notatki
        const noteCardTitle = document.createElement('div');
        noteCardTitle.classList.add('note-card-title');
        noteCardTitle.textContent = note.title;

        // Tworzenie i ustawianie treści notatki
        const noteCardContent = document.createElement('div');
        noteCardContent.classList.add('note-card-content');
        noteCardContent.innerHTML = note.content.replace(/\n/g, '<br>');  
        
        // Jeśli notatka jest oznaczona jako wykonana, dodajemy odpowiednią klasę
        if (note.done) noteCardContent.classList.add('note-card-done');

        // Tworzenie i ustawianie kategorii notatki
        const noteCardCategory = document.createElement('div');
        noteCardCategory.classList.add('note-card-category');
        noteCardCategory.textContent = `Kategoria: ${note.category}`;

        // Tworzenie kontenera akcji (przypięcie, edycja, usuwanie)
        const actionsContainer = createActionsContainer(noteCard);

        // Ustawianie stanu checkboxa przypięcia w zależności od zapisanych danych
        const checkbox = actionsContainer.querySelector('.note-card-pinned');
        checkbox.checked = note.checked;

        // Dodanie wszystkich elementów do notatki i dodanie notatki do kontenera notatek
        noteCard.appendChild(noteCardTitle);  
        noteCard.appendChild(noteCardContent); 
        noteCard.appendChild(noteCardCategory); 
        noteCard.appendChild(actionsContainer); 
        noteList.appendChild(noteCard); 
    }
};


// BK
/**
 * Logika sortowania notatek zapisanych w notatniku
 */
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

/**
 * Funkcja przełącza status wykonania notatki.
 * Gdy notatka jest oznaczona jako "do zrobienia", funkcja zmienia jej stan na "zrobione" i odwrotnie.
 * Funkcja dodaje lub usuwa klasę `note-card-done` z treści notatki, co może zmieniać jej wygląd (np. przez przekreślenie tekstu).
 * Po zmianie statusu wykonania, zapisuje zmodyfikowane notatki w localStorage.
 */
function toggleDone(noteCard) {
    const noteContent = noteCard.querySelector('.note-card-content');
    noteContent.classList.toggle('note-card-done');
    saveNotes();
}
/**
 * Funkcja usuwa notatkę z listy.
 */
function deleteNote(noteCard) {
    noteCard.remove();
    saveNotes();
}

document.addEventListener('selectionchange', updateToolbarState);