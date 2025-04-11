import React, { useState, useEffect } from 'react';

function GenerateApiKey() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const apiKeyFromStorage = localStorage.getItem('apiKey');
    if (apiKeyFromStorage) {
      setApiKey(apiKeyFromStorage);
    }
  }, []); // Run only once

  const handleGenerateApiKey = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Please log in first.');
      return;
    }

    const email = localStorage.getItem('email');

    try {
      const response = await fetch('http://localhost:3000/generate-api-key', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        localStorage.setItem('apiKey', data.apiKey);
        setApiKey(data.apiKey);
      } else {
        setMessage(data.message || 'Error generating API key.');
      }
    } catch (error) {
      setMessage('Error connecting to the API.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {!apiKey && (
        <>
          <h2>Generate API Key</h2>
          <button onClick={handleGenerateApiKey}>Generate API Key</button>
        </>
      )}

      {apiKey && (
        <>
          <h2>Generate New API Key</h2>
          <div>
            <h3>Your API Key:</h3>
            <p>{apiKey}</p>
          <button onClick={handleGenerateApiKey}>New API Key</button>

          </div>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default GenerateApiKey;
