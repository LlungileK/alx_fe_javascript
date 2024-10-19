// Initial array of quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
    { text: "It always seems impossible until it’s done.", category: "Perseverance" }
  ];
  
  const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Simulated server endpoint
  
  // Load quotes and sync with server
  window.onload = () => {
    loadQuotes();            // Load local quotes
    createAddQuoteForm();     // Setup form for adding quotes
    restoreLastQuote();       // Restore last viewed quote
    fetchQuotesFromServer();  // Fetch quotes from the server
  
    // Sync with the server every 60 seconds
    setInterval(() => {
      fetchQuotesFromServer();
    }, 60000);
  };
  
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
    } catch (error) {
      console.error('Error posting the quote:', error);
    }
  }
  
  // GET request to fetch quotes from the server
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
  
      // Convert server data to your quote format
      const convertedQuotes = serverQuotes.map(item => ({
        text: item.title,
        category: "Server"
      }));
  
      // Sync with local data
      syncQuotesWithServer(convertedQuotes);
    } catch (error) {
      console.error('Error fetching quotes from the server:', error);
    }
  }
  
  // Sync local and server quotes
  function syncQuotesWithServer(serverQuotes) {
    let hasConflict = false;
  
    serverQuotes.forEach(serverQuote => {
      const existsLocally = quotes.some(
        localQuote => localQuote.text === serverQuote.text
      );
  
      // If the quote doesn't exist locally, add it
      if (!existsLocally) {
        quotes.push(serverQuote);
      } else {
        hasConflict = true;
      }
    });
  
    // Save updated quotes to local storage
    saveQuotes();
  
    // Notify user about conflicts, if any
    if (hasConflict) {
      notifyConflictResolution();
    }
  }
  
  // Notify user about conflict resolution
  function notifyConflictResolution() {
    const userChoice = confirm('Server data conflicts with local data. Would you like to keep the server data?');
    if (userChoice) {
      saveQuotes(); // Keep server data
    } else {
      console.log('Local data kept');
    }
  }
  
  // Modified addQuote function to handle both local and server updates
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
  
      // Add the new quote locally
      quotes.push(newQuote);
  
      // Save the updated quotes to local storage
      saveQuotes();
  
      // Clear the input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      // Show the new quote immediately
      showRandomQuote();
  
      // Post the new quote to the server
      postQuoteToServer(newQuote);
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  