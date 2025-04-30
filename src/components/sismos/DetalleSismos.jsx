import React from 'react';
import styles from './DetalleSismos.module.css'; // Importa los estilos

const DetalleSismo = ({ sismo, onIniciarRevision }) => {
    return (
        <div>
        {sismo ? (
            <>
            <h2>Detalle del Sismo #{sismo.id}</h2>
            <p>Magnitud: {sismo.magnitud}</p>
            <p>Origen: {sismo.origen}</p>
            <p>Alcance: {sismo.alcance}</p>
            <p>Clasificación: {sismo.clasificacion}</p>
            <p>Área del Sismo: {sismo.areaSismo}</p>
            <p>Área Afectada: {sismo.areaAfectada}</p>
            <p>Fecha de Detección: {sismo.fechaDeteccion}</p>
            <p>Hora de Detección: {sismo.horaDeteccion}</p>
            <button onClick={onIniciarRevision} className={styles.revisionButton}>
                Iniciar Revisión Manual
            </button>
            </>
        ) : (
            <p>Seleccione un sismo para ver los detalles.</p>
        )}
        </div>
    );
};

export default DetalleSismo;