// Initial array of quotes
let quotes = [
  { text: "The only limit to our realization of tomoorrow is our doubts of today.", category: "Insipration" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
  { text: "It always seems impossible until it`s done.", category: "Perseverance" }
];

// Server URL (replace with your actual server URL or mock API)
const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example server endpoint

// Load quotes from local storage or server on page load
window.onload = () => {
  loadQuotesFromLocalStorage();  // Load quotes from local storage
  fetchQuotesFromServer();        // Fetch quotes from the server
  createAddQuoteForm();           // Create the form to add new quotes
  createDownloadButton();         // Create a button to download quotes as a file
  createUploadButton();           // Create a button to upload quotes
  populateCategories();            // Populate categories for filtering
  restoreLastFilter();             // Restore last selected filter

  // Set interval to sync quotes with the server every 60 seconds
  setInterval(fetchQuotesFromServer, 60000); // 60 seconds
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

// Fetch quotes from the server
async function fetchQuotesFromServer() {
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

    // Sync local quotes with server quotes
    syncQuotes(fetchedQuotes);

  } catch (error) {
    console.error('Error fetching quotes from the server:', error);
  }
}

// Sync local quotes with server quotes
function syncQuotes(fetchedQuotes) {
  // Check for new quotes on the server
  fetchedQuotes.forEach(serverQuote => {
    const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
    if (!exists) {
      quotes.push(serverQuote); // Add new server quotes to local quotes
    }
  });

  saveQuotesToLocalStorage();  // Save updated quotes to local storage
  showRandomQuote();           // Show a random quote from the updated list
  console.log("Quotes synced with server!"); // Notify that quotes have been synced
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


// Adding event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Function to add a new quote to the array
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    // Add the new quote to the quotes array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Optionally, show the new quote immediately
    showRandomQuote();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Display an initial random quote when the page loads
window.onload = showRandomQuote;

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

// Populate categories dynamically for filtering
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Add "All Categories" option
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Categories';
  categoryFilter.prepend(allOption);
}

// Clear existing categories(except "All Categories")
categoryFilter.innerHTML = '<option value="all">All Categories</option>';

 // Populate the dropdown with categories
 categories.forEach(category => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category;
  categoryFilter.appendChild(option);
});

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  // Update display based on filtered quotes
  const quoteDisplayDiv = document.getElementById('quoteDisplay');
  quoteDisplayDiv.textContent = filteredQuotes.length > 0 
    ? `${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text} - ${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].category}` 
    : 'No quotes available for this category.';
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
    
    // Re-populate categories after adding a new quote
    populateCategories();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Restore last selected filter from local storage
function restoreLastFilter() {
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
    filterQuotes(); // Apply the filter
  }

  // Save filter change in local storage
  document.getElementById('categoryFilter').addEventListener('change', (event) => {
    localStorage.setItem('lastFilter', event.target.value);
  });
}


// Create a download button to save quotes as a file
function createDownloadButton() {
  const downloadButton = document.createElement('button');
  downloadButton.textContent = 'Download Quotes';
  downloadButton.addEventListener('click', downloadQuotesAsFile);

  document.body.appendChild(downloadButton);
}

// Function to download quotes as a file
function downloadQuotesAsFile() {
  const quotesBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(quotesBlob);
  downloadLink.download = 'quotes.json';
  downloadLink.click();
}


// Create an upload button to upload a quotes file
function createUploadButton() {
  const uploadButton = document.createElement('button');
  uploadButton.textContent = 'Upload Quotes';
  uploadButton.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.addEventListener('change', handleFileUpload);
    fileInput.click();
  });

  document.body.appendChild(uploadButton);
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    // Read the content of the file
    reader.onload = (e) => {
      const fileContent = e.target.result;
      try {
        const uploadedQuotes = JSON.parse(fileContent);

        // Merge uploaded quotes with existing quotes
        uploadedQuotes.forEach(quote => {
          const exists = quotes.some(q => q.text === quote.text);
          if (!exists) {
            quotes.push(quote);
          }
        });

        // Save to local storage and refresh the display
        saveQuotesToLocalStorage();
        showRandomQuote();
        populateCategories();

        alert('Quotes uploaded successfully!');
      } catch (error) {
        console.error('Error parsing uploaded file:', error);
        alert('Failed to upload quotes. Please check the file format.');
      }
    };

    // Read the file as text
    reader.readAsText(file);
  }
}