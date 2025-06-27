import React from 'react';

const DetalleSismo = ({ sismo, onIniciarRevision, botonDeshabilitado, estiloBoton, user, estadoActual }) => {

    
    const fechaRechazo = sismo.getFechaHoraRechazo();
    const fechaConfirmacion = sismo.getFechaHoraConfirmacion();
    const formatFecha = fecha => {
        if (!fecha) return null;
        const opciones = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' };
        return fecha.toLocaleString('es-AR', opciones);
    };
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

            {estadoActual === 'Rechazado' && fechaRechazo && (
                
                <p style={{ color: 'red', fontWeight: 'bold' }}>
                 Evento rechazado el {formatFecha(fechaRechazo)} por {typeof user === 'string' ? user:user.user}
                 
                </p>
                
            )}
            {estadoActual === 'Confirmado' && fechaConfirmacion && (
                <p style={{ color: 'green', fontWeight: 'bold' }} >
                    Evento confirmado el {formatFecha(fechaConfirmacion)} por {typeof user === 'string' ? user:user.user}
                </p>
            )}
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