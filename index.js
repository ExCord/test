import './style.css'
import './loading-indicator.js'

const dataContainer = document.getElementById('data-container');
const form = document.getElementById('note-form');
const createNoteLoadingIndicator = document.querySelector('loading-indicator');

function showLoadingIndicator() {
  createNoteLoadingIndicator.style.display = 'block';
  createNoteLoadingIndicator.style.position = 'absolute';
  createNoteLoadingIndicator.style.top = '50%';
  createNoteLoadingIndicator.style.left = '50%';
  createNoteLoadingIndicator.style.transform = 'translate(-50%, -50%)';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showLoadingIndicator();
  // createNoteLoadingIndicator.style.display = 'block';
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;
  const newNote = {
    title,
    body,
  };

//   fetch('https://notes-api.dicoding.dev/v2/notes', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(newNote)
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Note created:', data);
//       setTimeout(() => createNoteLoadingIndicator.style.display = 'block', 5000);
//       form.reset();
//       fetchDataAndDisplay();
//     })
//     .catch(error => {
//       console.error('Error creating note:', error);
//       createNoteLoadingIndicator.style.display = 'none';
//       dataContainer.innerHTML = 'Error creating note.';
//     });
// });
    try {
      const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Note created:', data);
        form.reset();
        showLoadingIndicator();
        fetchDataAndDisplay(); // Assuming you have a function to fetch and display data
      } else {
        console.error('Error creating note:', response.statusText);
        dataContainer.innerHTML = 'Error creating note.';
      }
    } catch (error) {
      console.error('Error creating note:', error);
      dataContainer.innerHTML = 'Error creating note.';
    } finally {
      // Hide the loading indicator
      createNoteLoadingIndicator.style.display = 'none';
    }
    });

function fetchDataAndDisplay() {
  fetch('https://notes-api.dicoding.dev/v2/notes')
    .then(response => response.json())
    .then(data => {
      let output = '';
      for (const note of data.data) {
        output += `
          <div class="note-card">
            <h2><span class="math-inline">${note.title}</h2\>
            <p\></span>${note.body}</p>
            <button class="delete-btn" data-id="${note.id}">Delete</button>
          </div>
        `;
      }
      dataContainer.innerHTML = output;
      const deleteButtons = document.querySelectorAll('.delete-btn');
      for (const button of deleteButtons) {
        button.addEventListener('click', handleDeleteClick);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      dataContainer.innerHTML = 'Error fetching data.';
    });
}

function handleDeleteClick(event) {
  const button = event.target;
  const noteId = button.dataset.id;
  const buttonContainer = button.parentElement;
  const loadingIndicator = document.createElement('span');
  loadingIndicator.classList.add('loading-indicator');
  loadingIndicator.textContent = 'Deleting...';
  buttonContainer.appendChild(loadingIndicator);

  fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        console.log('Note deleted:', noteId);
        buttonContainer.remove();
        fetchDataAndDisplay();
      } else {
        console.error('Error deleting note:', noteId);
        loadingIndicator.remove();
      }
    })
    .catch(error => {
      console.error('Error deleting note:', error);
      loadingIndicator.remove();
    });
}

fetch('https://notes-api.dicoding.dev/v2/notes')
  .then(res => res.json())
  .then(data => {
    let output = '';
    if (data && data.data) {
      for (const note of data.data) {
        output += `
          <div class="note">
            <h2>${note.title}</h2>
            <p>${note.body}</p>
          </div>
        `;
      }
    } else {
      output = 'No notes found.';
    }
    dataContainer.innerHTML = output;
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    dataContainer.innerHTML = 'Error fetching data.';
});

fetchDataAndDisplay();