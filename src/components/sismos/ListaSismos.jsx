import React from 'react';
import styles from './ListaSismos.module.css'; // Importa los estilos

const ListaSismos = ({ sismos, onSeleccionarSismo, modoRevision, onVisualizarMapa }) => {
    return (
      <div>
        <h2>Lista de Sismos Detectados</h2>
        <ul className={styles.listaSismos}>
          {sismos.map((sismo) => (
            <li
              key={sismo.id}
              onClick={() => onSeleccionarSismo(sismo.id)}
              className={styles.sismoItem}
            >
              Sismo #{sismo.id} - Magnitud: {sismo.magnitud} - Fecha: {sismo.fechaDeteccion}
            </li>
          ))}
        </ul>
  
        {modoRevision && (
          <button className={styles.botonVisualizarMapa} onClick={onVisualizarMapa}>
            Visualizar en un mapa
          </button>
        )}
      </div>
    );
  };
  
 

export default ListaSismos;