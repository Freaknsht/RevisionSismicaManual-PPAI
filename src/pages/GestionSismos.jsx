import React, { useState, useEffect } from 'react';
import ListaSismos from '../components/sismos/ListaSismos';
import DetalleSismo from '../components/sismos/DetalleSismos';
import FormularioRevision from '../components/sismos/FormularioRevision';
import styles from './GestionSismos.module.css'; // Importa los estilos

const GestionSismos = () => {
    const [sismos, setSismos] = useState([]);
    const [sismoSeleccionado, setSismoSeleccionado] = useState(null);
    const [modoRevision, setModoRevision] = useState(false);

    // Simulación de carga de datos desde el backend
    useEffect(() => {
        // En un caso real, aquí iría la llamada a la API
        const datosDePrueba = [
        {
            id: 1,
            magnitud: 2.2,
            origen: 'Falla local',
            alcance: 'Regional',
            clasificacion: 'Leve',
            areaSismo: 'Córdoba',
            areaAfectada: 'Carlos Paz',
            fechaDeteccion: '2024-07-26',
            horaDeteccion: '10:06:00'
        },
        {
            id: 2,
            magnitud: 3.9,
            origen: 'Falla profunda',
            alcance: 'Nacional',
            clasificacion: 'Moderado',
            areaSismo: 'San Juan',
            areaAfectada: 'Mendoza',
            fechaDeteccion: '2024-07-26',
            horaDeteccion: '19:33:00'
        },
        // ... más sismos
        ];
        setSismos(datosDePrueba);
    }, []);

    const handleSeleccionarSismo = (id) => {
        const sismo = sismos.find(sismo => sismo.id === id);
        setSismoSeleccionado(sismo);
        setModoRevision(false); // Cerrar revisión al seleccionar otro sismo
    };

    const handleIniciarRevision = () => {
        setModoRevision(true);
    };

    const handleGuardarRevision = (resultadoRevision) => {
        // Aquí iría la lógica para guardar la revisión en el backend
        console.log('Resultado de la revisión:', resultadoRevision);
        setModoRevision(false);
        setSismoSeleccionado(null); // Opcional: limpiar el sismo seleccionado
    };

    const handleCancelarRevision = () => {
        setModoRevision(false);
    };

    return (
        <div className={styles.gestionSismosContainer}>
            <div className={styles.listaSismosContainer}>
                <ListaSismos sismos={sismos} onSeleccionarSismo={handleSeleccionarSismo} />
            </div>
            {sismoSeleccionado && ( // Mostrar solo si hay un sismo seleccionado
                <div className={styles.detalleSismoContainer}>
                {!modoRevision ? (
                    <DetalleSismo sismo={sismoSeleccionado} onIniciarRevision={handleIniciarRevision} />
                ) : (
                    <FormularioRevision
                    sismo={sismoSeleccionado}
                    onGuardarRevision={handleGuardarRevision}
                    onCancelarRevision={handleCancelarRevision}
                    />
                )}
                </div>
            )}
        </div>
    );
};

export default GestionSismos;