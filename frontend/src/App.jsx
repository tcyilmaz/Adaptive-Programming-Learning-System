// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [backendMessage, setBackendMessage] = useState('');
  const [error, setError] = useState(null);

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    // Define the function to fetch data
    const fetchHealth = async () => {
      try {
        // Make sure the URL matches your backend port
        const response = await fetch('http://localhost:3001/api/health');

        if (!response.ok) {
          // If response is not 2xx, throw an error
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBackendStatus(data.status);
        setBackendMessage(data.message);
        setError(null); // Clear any previous errors

      } catch (err) {
        console.error("Failed to fetch backend status:", err);
        setError(`Failed to connect to backend: ${err.message}`);
        setBackendStatus('Error');
        setBackendMessage('');
      }
    };

    // Call the fetch function
    fetchHealth();

    // Optional: return a cleanup function if needed (not necessary for this simple fetch)
    // return () => { /* cleanup code */ };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>Adaptive Programming Learning System</h2>
      <div className="card">
        {/* Display backend status */}
        <h3>Backend Status: {backendStatus}</h3>
        {backendMessage && <p>{backendMessage}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {/* Rest of your default Vite content can go here or be removed */}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;