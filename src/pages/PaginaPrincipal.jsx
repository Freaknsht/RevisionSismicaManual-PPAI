import './PaginaPrincipal.css';

//primer componente que renderiza la aplicacion


function PaginaPrincipal({ onRegistrarClick }) {
    return (
      <button className="botonSeleccionar" onClick={onRegistrarClick}>
        Registrar revisión manual
      </button>
    );
  }
  
  export default PaginaPrincipal;