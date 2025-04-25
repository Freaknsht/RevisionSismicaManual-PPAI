import React from 'react';
import ReactDOM from 'react-dom/client';
import GestionSismos from './pages/GestionSismos';
import './index.css';
import './App.css'; // Estilos para App.jsx

function App() {
  return (
    <React.StrictMode>
      <div id="main-container">
        <GestionSismos />
      </div>
    </React.StrictMode>
  );
}

export default App; // Esta línea es crucial


ReactDOM.createRoot(document.getElementById('root')).render(<App />);
