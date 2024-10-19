// Initial array of quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
    { text: "It always seems impossible until it’s done.", category: "Perseverance" }
  ];
  
  const serverUrl = 'https://jsonplaceholder.typicode.com/posts';  // Mock server URL
  
  // Load quotes and sync with server
  window.onload = () => {
    loadQuotesAndFilter();  // Load local quotes
    createAddQuoteForm();    // Setup form for adding quotes
    restoreLastQuote();      // Restore last viewed quote
    fetchQuotesFromServer(); // Fetch quotes from the server
  
    // Sync with the server every 60 seconds
    setInterval(() => {
      fetchQuotesFromServer();
    }, 60000);
  };
  
  // Fetch data from the server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(serverUrl);
      const serverQuotes = await response.json();
  
      // Simulate converting server response to the quote structure you are using
      const convertedQuotes = serverQuotes.map(item => ({
        text: item.title,  // Assuming "title" is the quote text
        category: "Server" // Placeholder category for now
      }));
  
      // Compare with local quotes and sync
      syncQuotesWithServer(convertedQuotes);
    } catch (error) {
      console.error('Error fetching quotes from the server:', error);
    }
  }
  
  // Sync local and server data
  function syncQuotesWithServer(serverQuotes) {
    let hasConflict = false;
  
    // Check for discrepancies and resolve conflicts
    serverQuotes.forEach(serverQuote => {
      const existsLocally = quotes.some(
        localQuote => localQuote.text === serverQuote.text
      );
  
      // If it doesn't exist locally, add it to local quotes
      if (!existsLocally) {
        quotes.push(serverQuote);
      } else {
        hasConflict = true;
      }
    });
  
    // Save the updated quotes to local storage
    saveQuotes();
  
    if (hasConflict) {
      notifyConflictResolution();
    }
  }
  
  // Notify user about conflict resolution
  function notifyConflictResolution() {
    const userChoice = confirm('Server data conflicts with local data. Would you like to keep the server data?');
    if (userChoice) {
      // Keep server data, overwrite local
      saveQuotes();
    } else {
      // Do nothing, keep local data
      console.log('Local data kept');
    }
  }
  
  // Other utility functions like loadQuotesAndFilter, addQuote, etc.
  
  