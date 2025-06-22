import React, { useState } from 'react';
import styles from './FormularioRevision.module.css'; // Importa los estilos
import mapaZona from '../../picture/mapa-zona.jpg';

const FormularioRevision = ({ sismo, onGuardarRevision, onCancelarRevision }) => { // onGuardarRevision
    const [resultado, setResultado] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuardarRevision({ // onGuardarRevision
        sismoId: sismo.id,
        resultado,
        observaciones,
        });
    };

    return (
        <div className={styles.fullGrid}>
        <div className={styles.topSection}>
            <div>
                <h3>Datos del Sismo</h3>
                <p><b>Magnitud:</b> {sismo.getMagnitud()}</p>
                <p><b>Origen:</b> {sismo.getOrigen()}</p>
                <p><b>Alcance:</b> {sismo.getAlcance()}</p>
                <p><b>Clasificación:</b> {sismo.getClasificacion()}</p>
            </div>
            <div>
                <h3>Ubicación</h3>
                <p><b>Área:</b> {sismo.getAreaSismo()}</p>
                <p><b>Zona Afec.:</b> {sismo.getAreaAfectada()}</p>
                <p><b>Fecha:</b> {sismo.getFechaDeteccion()}</p>
                <p><b>Hora:</b> {sismo.getHoraDeteccion()}</p>
            </div>
            <div className={styles.mapBox}>
                <img src={mapaZona} alt="Mapa" className={styles.mapImage} />
                <button type="button" className={styles.revisarMapaBtn}>Revisar Mapa</button>
            </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.bottomSection}>
            <div className={styles.formGroup}>
                <label>Descripción / Observaciones:</label>
                <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
                <label>Resultado de la Revisión:</label>
                <select value={resultado} onChange={(e) => setResultado(e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="derivado">Derivado</option>
                </select>
            </div>
            <div className={styles.buttonGroup}>
                <button type="button" onClick={onCancelarRevision} className={styles.cancelButton}>Cancelar</button>
                <button type="submit" className={styles.saveButton}>Guardar Revisión</button>
                
            </div>
        </form>
    </div>
    );
};

export default FormularioRevision;