import './PaginaPrincipal.css';


function PaginaPrincipal({ user, onIrAGestion }) {
  const Usuario = user;
  return (
    <div className='paginaP'>
      <h3>Bienvenido: {Usuario}</h3>
      <img className="redsismicaimagen" src="../../redsismica.png" alt="" />
      <button className="botonSeleccionar" onClick={onIrAGestion}>
        Registrar revisión manual
      </button>
    </div>
  );
}

export default PaginaPrincipal;
