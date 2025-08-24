import React, { useState, useEffect } from 'react';
import './App.css';
import NameInput from './components/NameInput';
import WheelOfNames from './components/WheelOfNames';

interface Name {
  id: string;
  text: string;
  isIncluded: boolean;
}

const STORAGE_KEY = 'wheelOfNames_savedNames';

function App() {
  const [names, setNames] = useState<Name[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  useEffect(() => {
    const savedNames = localStorage.getItem(STORAGE_KEY);
    if (savedNames) {
      try {
        const parsedNames = JSON.parse(savedNames);
        setNames(parsedNames);
      } catch (error) {
        console.error('Error loading saved names:', error);
      }
    }
  }, []);

  const handleNamesChange = (newNames: Name[]) => {
    setNames(newNames);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNames));
  };

  const handleWinner = (winnerName: string) => {
    setWinner(winnerName);
  };

  const clearWinner = () => {
    setWinner(null);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wheel of Names</h1>
        <p>Add names and spin the wheel to pick a winner!</p>
      </header>
      
      <main className="App-main">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarVisible ? '←' : '→'}
        </button>
        
        <div className={`app-container ${!sidebarVisible ? 'sidebar-hidden' : ''}`}>
          <div className={`left-panel sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
            <NameInput names={names} onNamesChange={handleNamesChange} />
          </div>
          
          <div className="right-panel">
            <WheelOfNames names={names} onWinner={handleWinner} sidebarHidden={!sidebarVisible} />
            
            {winner && (
              <div className="winner-modal">
                <div className="winner-content">
                  <h2>🎉 Winner! 🎉</h2>
                  <p className="winner-name">{winner}</p>
                  <button onClick={clearWinner} className="close-button">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
