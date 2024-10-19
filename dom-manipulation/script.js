// Initial array of quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
    { text: "It always seems impossible until it’s done.", category: "Perseverance" }
  ];
  
  // Load quotes and category filter from local storage or use the default array
  function loadQuotesAndFilter() {
    const storedQuotes = localStorage.getItem('quotes');
    const storedCategory = localStorage.getItem('selectedCategory');
  
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  
    populateCategories();
  
    if (storedCategory) {
      document.getElementById('categoryFilter').value = storedCategory;
      filterQuotes();
    } else {
      showRandomQuote();
    }
  }
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Populate the category dropdown dynamically
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
    const categories = [...new Set(quotes.map(quote => quote.category))];
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.innerHTML = category;
      categoryFilter.appendChild(option);
    });
  }
  
  // Show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    const quoteDisplayDiv = document.getElementById('quoteDisplay');
    quoteDisplayDiv.innerHTML = `<p>${randomQuote.text} - <em>${randomQuote.category}</em></p>`;
  
    // Store the last viewed quote in session storage
    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
  }
  
  // Filter quotes based on selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quoteDisplayDiv = document.getElementById('quoteDisplay');
    
    // Save the selected filter to local storage
    localStorage.setItem('selectedCategory', selectedCategory);
  
    // Filter quotes based on the selected category
    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
      filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
  
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndex];
      quoteDisplayDiv.innerHTML = `<p>${randomQuote.text} - <em>${randomQuote.category}</em></p>`;
    } else {
      quoteDisplayDiv.innerHTML = '<p>No quotes available in this category.</p>';
    }
  }
  
  // Create the form to add new quotes dynamically
  function createAddQuoteForm() {
    const formDiv = document.getElementById('formDiv');
  
    const newQuoteTextInput = document.createElement('input');
    newQuoteTextInput.setAttribute('id', 'newQuoteText');
    newQuoteTextInput.setAttribute('type', 'text');
    newQuoteTextInput.setAttribute('placeholder', 'Enter a new quote');
  
    const newQuoteCategoryInput = document.createElement('input');
    newQuoteCategoryInput.setAttribute('id', 'newQuoteCategory');
    newQuoteCategoryInput.setAttribute('type', 'text');
    newQuoteCategoryInput.setAttribute('placeholder', 'Enter quote category');
  
    const addButton = document.createElement('button');
    addButton.innerHTML = 'Add Quote';
    addButton.addEventListener('click', addQuote);
  
    formDiv.appendChild(newQuoteTextInput);
    formDiv.appendChild(newQuoteCategoryInput);
    formDiv.appendChild(addButton);
  }
  
  // Add a new quote and update local storage
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();  // Save to local storage
      populateCategories();  // Update the category filter if new category is added
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      showRandomQuote();
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Export quotes as JSON file
  function exportToJson() {
    const json = JSON.stringify(quotes);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    downloadLink.click();
  }
  
  // Import quotes from JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();  // Save imported quotes to local storage
      populateCategories();  // Update categories dynamically
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Restore the last viewed quote from session storage
  function restoreLastQuote() {
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
      const parsedQuote = JSON.parse(lastQuote);
      const quoteDisplayDiv = document.getElementById('quoteDisplay');
      quoteDisplayDiv.innerHTML = `<p>${parsedQuote.text} - <em>${parsedQuote.category}</em></p>`;
    }
  }
  
  // Initialize the application
  window.onload = () => {
    loadQuotesAndFilter();  // Load quotes from local storage and apply the last filter
    createAddQuoteForm();  // Create the form to add new quotes
    restoreLastQuote();  // Restore last viewed quote from session storage
  
    // Add event listener for the "Show New Quote" button
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  };
  