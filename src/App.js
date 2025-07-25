import { useState } from 'react';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError('Please enter a recipe request');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://primary-production-03db.up.railway.app/webhook/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeRequest: userInput })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (err) {
      setError(err.message || 'Failed to generate recipe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>AI Recipe Generator </h1>
      
      <div className="input-area">
        <input
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            setError(null); // Clear error when typing
          }}
          placeholder="What recipe do you want? (e.g. 'Quick vegetarian dinner')"
          disabled={isLoading}
        />
        <button className='btn'
          onClick={handleGenerate}
          disabled={isLoading || !userInput.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate Recipe'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {recipe && (
        <div className="recipe-result">
          
          <pre>{recipe}</pre> {/* pre preserves formatting */}
        </div>
      )}
    </div>
  );
}

export default App;