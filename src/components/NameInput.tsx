import React, { useState } from 'react';

interface Name {
  id: string;
  text: string;
  isIncluded: boolean;
}

interface NameInputProps {
  names: Name[];
  onNamesChange: (names: Name[]) => void;
}

const NameInput: React.FC<NameInputProps> = ({ names, onNamesChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addName = () => {
    if (inputValue.trim()) {
      const newName: Name = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        isIncluded: true
      };
      onNamesChange([...names, newName]);
      setInputValue('');
    }
  };

  const toggleName = (id: string) => {
    const updatedNames = names.map(name =>
      name.id === id ? { ...name, isIncluded: !name.isIncluded } : name
    );
    onNamesChange(updatedNames);
  };

  const removeName = (id: string) => {
    const filteredNames = names.filter(name => name.id !== id);
    onNamesChange(filteredNames);
  };

  const clearAllNames = () => {
    onNamesChange([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addName();
    }
  };

  return (
    <div className="name-input-container">
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a name..."
          className="name-input"
        />
        <button onClick={addName} className="add-button">
          Add Name
        </button>
      </div>
      
      {names.length > 0 && (
        <div className="list-actions">
          <button onClick={clearAllNames} className="clear-all-button">
            Clear All Names
          </button>
        </div>
      )}
      
      <div className="names-list">
        {names.map((name) => (
          <div key={name.id} className="name-item">
            <label className="name-checkbox">
              <input
                type="checkbox"
                checked={name.isIncluded}
                onChange={() => toggleName(name.id)}
              />
              <span className="checkmark">✓</span>
              <span className={`name-text ${name.isIncluded ? 'included' : 'excluded'}`}>
                {name.text}
              </span>
            </label>
            <button 
              onClick={() => removeName(name.id)}
              className="remove-button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NameInput;