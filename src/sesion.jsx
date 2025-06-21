import './sesion.css';
import { useState } from 'react';

function Sesion({ onIniciarSesion, setUser }) {
  return (
    <div className='divP'>
      <h3 className='h3-de-sesion'>Iniciar sesión</h3>
      <input type="text" placeholder='Usuario' onChange={(e) => setUser(e.target.value)}/>
      <input type="password" placeholder='Contraseña'/>
      
      <button className="botonSeleccionar" onClick={() => {
    onIniciarSesion();
    localStorage.setItem('usuarioLogueado', document.querySelector('input[placeholder="Usuario"]').value);
}}>
    Iniciar sesión
</button>
      <p className='olvidaste-tu-contraseña'>¿Olvidaste tu contraseña?</p>
    </div>
  );
}

export default Sesion;
