import React from 'react';

const DetalleSismo = ({ sismo, onIniciarRevision, botonDeshabilitado, estiloBoton }) => {
    return (
        <div>
            <h2>Detalle del Sismo #{sismo.id}</h2>
            <p>Magnitud: {sismo.getMagnitud()}</p>
            <p>Origen: {sismo.getOrigen()}</p>
            <p>Alcance: {sismo.getAlcance()}</p>
            <p>Clasificación: {sismo.getClasificacion()}</p>
            <p>Área del Sismo: {sismo.getAreaSismo()}</p>
            <p>Área Afectada: {sismo.getAreaAfectada()}</p>
            <p>Fecha de Detección: {sismo.getFechaDeteccion()}</p>
            <p>Hora de Detección: {sismo.getHoraDeteccion()}</p>
            <button 
                onClick={onIniciarRevision}
                disabled={botonDeshabilitado}
                className={estiloBoton}
              
            >
                Iniciar Revisión Manual
            </button>
        </div>
    );
};

export default DetalleSismo;