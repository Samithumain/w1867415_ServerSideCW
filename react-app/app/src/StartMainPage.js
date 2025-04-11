import React, { useState } from 'react';

function StartMainPage() {
  const [country, setCountry] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [message, setMessage] = useState(''); 

  const fetchCountryDetails = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('authToken');
    
      if (!email || !token) {
        console.error("Missing email or token");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/countries?country=${country}&email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });
      
        
        
    
      const data = await response.json();

      if (data && data.length > 0) {
        setCountryData(data[0]);
      } else {
        setCountryData(null);
      }
      if (data.error) {
        setMessage(data.error); 
      }
      else{
        setMessage('');
      }
    } catch (error) {
      setMessage("Error fetching country data"); 

      console.error('Error fetching country data:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px', fontFamily: 'Arial, sans-serif' }}>
    <h2>Country Details</h2>
    <form onSubmit={fetchCountryDetails} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Enter country name"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '14px',
        }}
      />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </form>
  
    {countryData && (
      <div style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
        <h3>{countryData.name}</h3>
        <p><strong>Capital:</strong> {countryData.capital?.[0] || 'N/A'}</p>
  
        {countryData.currency ? (
          <p>
            <strong>Currency:</strong> {Object.values(countryData.currency)
              .map((curr) => `${curr.name} (${curr.symbol})`)
              .join(', ')}
          </p>
        ) : (
          <p><strong>Currency:</strong> Not available</p>
        )}
  
        <p><strong>Languages:</strong> {Object.values(countryData.languages || {}).join(', ')}</p>
        {countryData.flag && <img src={countryData.flag} alt="Country Flag" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />}
      </div>
    )}
  {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
  
    {/* {countryData === null && <p style={{ color: 'red', marginTop: '10px' }}>No country found with that name.</p>} */}
  </div>
  
  );
}

export default StartMainPage;
