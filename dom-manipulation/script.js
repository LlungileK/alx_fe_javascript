// Initial array of quotes
let quotes = [];

// Server URL (replace with your actual server URL or mock API)
const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example server endpoint

// Load quotes from local storage or server on page load
window.onload = () => {
  loadQuotesFromLocalStorage();  // Load quotes from local storage
  syncQuotes();                  // Sync local quotes with the server
  createAddQuoteForm();          // Create the form to add new quotes
};

// Load quotes from local storage
function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
    showRandomQuote();
  }
}

// Save quotes to local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Sync quotes between local storage and server
async function syncQuotes() {
  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quotes from server');
    }

    const serverQuotes = await response.json();
    
    // Convert server data to quote format
    const fetchedQuotes = serverQuotes.map(item => ({
      text: item.title,  // Assuming "title" field is the quote text
      category: "Server" // Placeholder category
    }));

    // Check for new quotes on the server
    const newServerQuotes = fetchedQuotes.filter(serverQuote => 
      !quotes.some(localQuote => localQuote.text === serverQuote.text)
    );

    // If there are new quotes from the server, update local storage
    if (newServerQuotes.length > 0) {
      quotes.push(...newServerQuotes);
      saveQuotesToLocalStorage();  // Save updated quotes to local storage
      showRandomQuote();           // Show a random quote from the updated list
      console.log('Quotes synced with the server.');
    } else {
      console.log('No new quotes from the server.');
    }

  } catch (error) {
    console.error('Error syncing quotes with the server:', error);
  }
}

// POST a new quote to the server
async function postQuoteToServer(newQuote) {
  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newQuote)
    });

    if (!response.ok) {
      throw new Error('Failed to post quote to server');
    }

    const savedQuote = await response.json();
    console.log('Quote successfully posted to the server:', savedQuote);

    // Add the new quote to the local array and update local storage
    quotes.push(newQuote);
    saveQuotesToLocalStorage();  // Save quotes to local storage
    showRandomQuote();           // Show the new quote immediately
  } catch (error) {
    console.error('Error posting the quote:', error);
  }
}

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteDisplayDiv = document.getElementById('quoteDisplay');
    quoteDisplayDiv.textContent = `${randomQuote.text} - ${randomQuote.category}`;
  }
}

// Create the form to add new quotes dynamically
function createAddQuoteForm() {
  const formDiv = document.createElement('div');

  const newQuoteTextInput = document.createElement('input');
  newQuoteTextInput.setAttribute('id', 'newQuoteText');
  newQuoteTextInput.setAttribute('type', 'text');
  newQuoteTextInput.setAttribute('placeholder', 'Enter a new quote');

  const newQuoteCategoryInput = document.createElement('input');
  newQuoteCategoryInput.setAttribute('id', 'newQuoteCategory');
  newQuoteCategoryInput.setAttribute('type', 'text');
  newQuoteCategoryInput.setAttribute('placeholder', 'Enter quote category');

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formDiv.appendChild(newQuoteTextInput);
  formDiv.appendChild(newQuoteCategoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };

    // Add the new quote to the local quotes array
    quotes.push(newQuote);
    
    // Save the updated quotes to local storage
    saveQuotesToLocalStorage();

    // Post the new quote to the server
    postQuoteToServer(newQuote);

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert('Please enter both a quote and a category.');
  }
}

  