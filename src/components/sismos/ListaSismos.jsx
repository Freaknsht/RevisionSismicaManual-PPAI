import React from 'react';
import styles from './ListaSismos.module.css'; // Importa los estilos

const ListaSismos = ({ sismos, onSeleccionarSismo, modoRevision, onVisualizarMapa, onModificarDatos }) => {
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
            <div className={styles.botonesContainer}>
            <button className={styles.botonVisualizarMapa} onClick={onVisualizarMapa}>
              Visualizar en mapa
            </button>
            
            <button className={styles.botonModificarDatos} onClick={onModificarDatos}>
              Modificar datos
            </button>
          </div>

        )}
      </div>
    );
  };
  
 

export default ListaSismos;