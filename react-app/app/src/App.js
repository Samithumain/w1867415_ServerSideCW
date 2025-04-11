import React, { useState } from 'react';
import './App.css';
import Signup from './signup';
import Login from './Login';
import StartMainPage from './StartMainPage';
import GenerateApiKey from './generateapikey';
import AdminDashboard from './admin-dashboard'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGeneratePageVisible, setIsGeneratePageVisible] = useState(false);

  const toggleGeneratePage = () => {
    setIsGeneratePageVisible(prev => !prev);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
    <div className="App">
      <header className="CW1">
        <Routes>
          <Route 
            path="/admin-dashboard" 
            element={isLoggedIn ? <AdminDashboard /> : <Login onLoginSuccess={handleLoginSuccess} />} 
          />
          <Route 
            path="/" 
            element={!isLoggedIn ? (
              <div className="flex justify-center gap-10 p-6">
                <div className="w-full max-w-sm">
                  <Signup onLoginSuccess={handleLoginSuccess} />
                </div>
                <div className="w-full max-w-sm">
                  <Login onLoginSuccess={handleLoginSuccess} />
                </div>
              </div>
            ) : (
              <>
                {isGeneratePageVisible ? <GenerateApiKey /> : <StartMainPage />}
                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={toggleGeneratePage}
                >
                  {isGeneratePageVisible ? 'Back to Main Page' : 'Generate API Key'}
                </button>
              </>
            )}
          />
        </Routes>
      </header>
    </div>
  </Router>
  
  
  );
}

export default App;
