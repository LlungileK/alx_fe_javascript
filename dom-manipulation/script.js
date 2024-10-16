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
  