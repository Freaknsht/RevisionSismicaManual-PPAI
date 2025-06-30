import React, { useState, useEffect } from 'react';
import ListaSismos from '../components/sismos/ListaSismos';
import DetalleSismo from '../components/sismos/DetalleSismos';
import FormularioRevision from '../components/sismos/FormularioRevision';
import styles from './GestionSismos.module.css'; // Importa los estilos
import GestorRevision from '../domain/GestorRevision'; // Importa el Gestor
import Notificacion from '../components/sismos/Notificacion';

const GestionSismos = (user) => {
    const [sismos, setSismos] = useState([]);
    const [sismoSeleccionado, setSismoSeleccionado] = useState(null);
    const [modoRevision, setModoRevision] = useState(false);
    const [estadoActual, setEstadoActual] = useState(null);
    const [notificacion, setNotificacion] = useState(null);

    // Función para obtener la clase de estilo según el estado
    const getEstadoClass = (estado) => {
        switch (estado) {
            case 'Autodetectado':
                return styles.estadoAutodetectado;
            case 'Pendiente de Revisión':
                return styles.estadoPendiente;
            case 'Evento sin Revisión':
                return styles.estadoSinRevision;
            case 'Bloqueado en Revisión':
                    return styles.estadoBloqueadoEnRevision;
            case 'Rechazado':
                    return styles.estadoRechazado;
            case 'Confirmado':
                    return styles.estadoConfirmado;
            case 'Derivado a experto':
                    return styles.estadoDerivadoAExperto;
            default:
                return '';
        }
    };

    // Efecto para monitorear el estado del sismo seleccionado
    useEffect(() => {
        let intervalId;
        if (sismoSeleccionado) {
            // Actualizar estado inicial
            setEstadoActual(sismoSeleccionado.getEstado().getNombre());
            
            // Monitorear cambios de estado cada segundo
            intervalId = setInterval(() => {
                const nuevoEstado = sismoSeleccionado.getEstado().getNombre();
                if (nuevoEstado !== estadoActual) {
                    setEstadoActual(nuevoEstado);
                    console.log(`El estado del sismo ha cambiado a: ${nuevoEstado}`);
                }
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [sismoSeleccionado]);

    // Simulación de carga de datos desde el backend
    //llama a GestorRevision.buscarEventoAutodetectado() para cargar los sismos
    useEffect(() => {
        const cargarSismos = async () => {
        try {
            const sismosCargados = await GestorRevision.buscarEventoAutodetectado();
            setSismos(sismosCargados);
        } catch (error) {
            // Manejar el error (mostrar mensaje, etc.)
            console.error("Error al cargar sismos:", error);
        }
        };

        cargarSismos();
    }, []);

    //Usa GestorRevision.seleccionarSismo() para obtener el sismo seleccionado
    const handleSeleccionarSismo = (id) => {
        const sismo = GestorRevision.seleccionarSismo(id, sismos);
        setSismoSeleccionado(sismo);
        setModoRevision(false); // Cerrar revisión al seleccionar otro sismo
    };

    // Llama a GestorRevision.tomarDatosSeleccion()
    const handleIniciarRevision = () => {
        const pudoBloquear = GestorRevision.buscarEstadoBloqueadoEnRevision(sismoSeleccionado);
    if (pudoBloquear) {
        setEstadoActual("Bloqueado en Revisión");
        setModoRevision(true);
        setNotificacion("El evento ha sido bloqueado para los demas analistas");
    } else {
        alert("No se puede iniciar la revisión en el estado actual.");
    }
    };


    //Llama a GestorRevision.registrarResultadoRevision() y maneja la respuesta (éxito o error). Recarga la lista de sismos después de guardar la revisión.
    const handleRegistrarResultado = async (revision) => {
        try {
        const resultado = await GestorRevision.registrarResultadoRevision(revision);
        console.log(resultado.message); // Mostrar mensaje de éxito


        if (revision.resultado === 'rechazado' && sismoSeleccionado) {
            sismoSeleccionado.rechazarEvento();
            const ahora = new Date();
            sismoSeleccionado.setFechaHoraRechazo(ahora);
            sismoSeleccionado.user = user.user || user;
        } else if (revision.resultado === 'aprobado') {
            sismoSeleccionado.confirmarEvento();
            const ahora = new Date();
            sismoSeleccionado.setFechaHoraConfirmacion?.(ahora); 
            sismoSeleccionado.user = user.user || user; 
        }


        setModoRevision(false);
        setSismoSeleccionado(sismoSeleccionado);
        // Recargar la lista de sismos para reflejar los cambios
        const sismosActualizados = await GestorRevision.buscarEventoAutodetectado();
        setSismos(sismosActualizados);
        
        } catch (error) {
        // Manejar el error (mostrar mensaje, etc.)
        console.error("Error al registrar revisión:", error);
        }
    };

    //Llama a GestorRevision.cancelarRevision()
    const handleCancelarRevision = () => {
        GestorRevision.cancelarRevision();
        setModoRevision(false);
    };


    const handleVisualizarMapa = () => {
        // Por ahora podés poner un alert o un console.log
        alert('Mostrar mapa con ubicación del sismo seleccionado');
    };

    const handleModificarDatos = () => {
        alert("Aquí iría la lógica para abrir el formulario de modificación de datos.");
    };
    

    const handleDerivarASupervisor = async (supervisor) => {
        if (!sismoSeleccionado) return;
    
        sismoSeleccionado.derivarAExperto(supervisor);
    
        // Actualizamos la UI:
        setEstadoActual(Estado.DERIVADO_A_EXPERTO.getNombre());
        setModoRevision(false);
        setNotificacion(`Evento derivado a supervisor ${supervisor}`);
        setSismoSeleccionado(sismoSeleccionado);
        setSismoSeleccionado(null);
        
    
        // Recargamos la lista de sismos para reflejar cambios
        const sismosActualizados = await GestorRevision.buscarEventoAutodetectado();
        setSismos(sismosActualizados);
    };




    return (
        <div className={styles.gestionSismosContainer}>
        {!modoRevision && (
            <div className={styles.listaSismosContainer}>
                <ListaSismos sismos={sismos} onSeleccionarSismo={handleSeleccionarSismo} modoRevision={modoRevision}
                onVisualizarMapa={handleVisualizarMapa} onModificarDatos={handleModificarDatos}
                />
            </div>
        )}
        {sismoSeleccionado && (
            <div className={styles.detalleSismoContainer} style={modoRevision ? { width: '100%' } : {}}>
                <div className={`${styles.estadoContainer} ${getEstadoClass(estadoActual)}`}>
                    <h3>Estado actual: {estadoActual}</h3>
                </div>
                {!modoRevision ? (
                    <DetalleSismo 
                        sismo={sismoSeleccionado} 
                        onIniciarRevision={handleIniciarRevision}
                        botonDeshabilitado={estadoActual === 'Evento sin Revisión' || estadoActual === 'Rechazado' ||estadoActual==='Confirmado'}
                        estiloBoton={(estadoActual === 'Evento sin Revisión'||estadoActual === 'Rechazado') || estadoActual==='Confirmado'? styles.botonDeshabilitado : ''}
                        user={user}
                        estadoActual={estadoActual}
                    />
                ) : (
                    <FormularioRevision
                        sismo={sismoSeleccionado}
                        onGuardarRevision={handleRegistrarResultado}
                        onCancelarRevision={handleCancelarRevision}
                        onDerivar={handleDerivarASupervisor}
                    />
                )}

                {notificacion && (
                        <Notificacion 
                            message={notificacion} 
                            onClose={() => setNotificacion(null)} 
                             duration={4000} // dura 4 segundos
                        />
                )}
            </div>
        )}
    </div>
    );
};

export default GestionSismos;