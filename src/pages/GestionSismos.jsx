import React, { useState, useEffect } from 'react';
import ListaSismos from '../components/sismos/ListaSismos';
import DetalleSismo from '../components/sismos/DetalleSismos';
import FormularioRevision from '../components/sismos/FormularioRevision';
import styles from './GestionSismos.module.css'; // Importa los estilos
import GestorRevision from '../domain/GestorRevision'; // Importa el Gestor

const GestionSismos = () => {
    const [sismos, setSismos] = useState([]);
    const [sismoSeleccionado, setSismoSeleccionado] = useState(null);
    const [modoRevision, setModoRevision] = useState(false);
    const [estadoActual, setEstadoActual] = useState(null);

    // Función para obtener la clase de estilo según el estado
    const getEstadoClass = (estado) => {
        switch (estado) {
            case 'Autodetectado':
                return styles.estadoAutodetectado;
            case 'Pendiente Revisión':
                return styles.estadoPendiente;
            case 'Evento sin Revisión':
                return styles.estadoSinRevision;
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
    }, [sismoSeleccionado, estadoActual]);

    // Simulación de carga de datos desde el backend
    //llama a GestorRevision.buscarSismos() para cargar los sismos
    useEffect(() => {
        const cargarSismos = async () => {
        try {
            const sismosCargados = await GestorRevision.buscarSismos();
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

    // Llama a GestorRevision.tomarDatosRevision()
    const handleIniciarRevision = () => {
        const sismoParaRevision = GestorRevision.tomarDatosRevision(sismoSeleccionado);
        setSismoSeleccionado(sismoParaRevision); // Actualizar si es necesario
        setModoRevision(true);
    };

    /*
    const handleGuardarRevision = (resultadoRevision) => {
        // Aquí iría la lógica para guardar la revisión en el backend
        console.log('Resultado de la revisión:', resultadoRevision);
        setModoRevision(false);
        setSismoSeleccionado(null); // Opcional: limpiar el sismo seleccionado
    };
    */

    //Llama a GestorRevision.registrarResultadoRevision() y maneja la respuesta (éxito o error). Recarga la lista de sismos después de guardar la revisión.
    const handleRegistrarResultado = async (revision) => {
        try {
        const resultado = await GestorRevision.registrarResultadoRevision(revision);
        console.log(resultado.message); // Mostrar mensaje de éxito
        setModoRevision(false);
        setSismoSeleccionado(null);
        // Recargar la lista de sismos para reflejar los cambios
        const sismosActualizados = await GestorRevision.buscarSismos();
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

    return (
        <div className={styles.gestionSismosContainer}>
            <div className={styles.listaSismosContainer}>
                <ListaSismos sismos={sismos} onSeleccionarSismo={handleSeleccionarSismo} />
            </div>
            {sismoSeleccionado && ( // Mostrar solo si hay un sismo seleccionado
                <div className={styles.detalleSismoContainer}>
                    <div className={`${styles.estadoContainer} ${getEstadoClass(estadoActual)}`}>
                        <h3>Estado actual: {estadoActual}</h3>
                    </div>
                    {!modoRevision ? (
                        <DetalleSismo 
                            sismo={sismoSeleccionado} 
                            onIniciarRevision={handleIniciarRevision}
                            botonDeshabilitado={estadoActual === 'Evento sin Revisión'}
                            estiloBoton={estadoActual === 'Evento sin Revisión' ? styles.botonDeshabilitado : ''}
                        />
                    ) : (
                        <FormularioRevision
                            sismo={sismoSeleccionado}
                            onGuardarRevision={handleRegistrarResultado}
                            onCancelarRevision={handleCancelarRevision}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default GestionSismos;