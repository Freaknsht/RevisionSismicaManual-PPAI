import React, { useState } from 'react';
import PaginaPrincipal from './pages/PaginaPrincipal';
import GestionSismos from './pages/GestionSismos';
import './index.css';
import './App.css';

function App() {
  const [mostrarGestion, setMostrarGestion] = useState(false);

  return (
    <React.StrictMode>
      <div id="main-container">
        {mostrarGestion ? (
          <GestionSismos />
        ) : (
          <PaginaPrincipal onRegistrarClick={() => setMostrarGestion(true)} />
        )}
      </div>
    </React.StrictMode>
  );
}

export default App;

