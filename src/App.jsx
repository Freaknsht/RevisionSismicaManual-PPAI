import React, { useState } from 'react';
import Sesion from './sesion.jsx';
import PaginaPrincipal from './pages/PaginaPrincipal';
import GestionSismos from './pages/GestionSismos';
import './index.css';
import './App.css';

function App() {
  const [paginaActual, setPaginaActual] = useState('sesion');
  const [user, setUser] = useState('')

  return (
    <div id="main-container">
      {paginaActual === 'sesion' && (
        <Sesion onIniciarSesion={() => setPaginaActual('principal')} setUser={setUser} />
      )}
      {paginaActual === 'principal' && (
        <PaginaPrincipal onIrAGestion={() => setPaginaActual('gestion')}  user={user}/>
      )}
      {paginaActual === 'gestion' && (
        <GestionSismos  user={user}/>
      )}
    </div>
  );
}

export default App;
