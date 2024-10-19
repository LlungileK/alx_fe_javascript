// Initial array of quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
    { text: "It always seems impossible until it’s done.", category: "Perseverance" }
  ];
  
  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    const quoteDisplayDiv = document.getElementById('quoteDisplay');
    quoteDisplayDiv.innerHTML = `<p>${randomQuote.text} - <em>${randomQuote.category}</em></p>`;
  }
  
  // Function to create the form dynamically for adding new quotes
  function createAddQuoteForm() {
    const formDiv = document.createElement('div');
  
    // Create input fields for the new quote text and category
    const newQuoteTextInput = document.createElement('input');
    newQuoteTextInput.setAttribute('id', 'newQuoteText');
    newQuoteTextInput.setAttribute('type', 'text');
    newQuoteTextInput.setAttribute('placeholder', 'Enter a new quote');
  
    const newQuoteCategoryInput = document.createElement('input');
    newQuoteCategoryInput.setAttribute('id', 'newQuoteCategory');
    newQuoteCategoryInput.setAttribute('type', 'text');
    newQuoteCategoryInput.setAttribute('placeholder', 'Enter quote category');
  
    // Create the "Add Quote" button
    const addButton = document.createElement('button');
    addButton.innerText = 'Add Quote';
    addButton.addEventListener('click', addQuote);
  
    // Append the inputs and button to the formDiv
    formDiv.appendChild(newQuoteTextInput);
    formDiv.appendChild(newQuoteCategoryInput);
    formDiv.appendChild(addButton);
  
    // Add the form to the body (or any specific location in the DOM)
    document.body.appendChild(formDiv);
  }
  
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
  
  // Adding event listener to the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Display an initial random quote when the page loads
  window.onload = () => {
    showRandomQuote();
    createAddQuoteForm();  // Create the form when the page loads
  };
  