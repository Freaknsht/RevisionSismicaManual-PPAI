import React, { useState } from 'react';
import styles from './FormularioRevision.module.css'; // Importa los estilos

const FormularioRevision = ({ sismo, onGuardarRevision, onCancelarRevision }) => {
    const [resultado, setResultado] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuardarRevision({
        sismoId: sismo.id,
        resultado,
        observaciones,
        });
    };

    return (
        <div>
        <h2>Revisar Sismo #{sismo.id}</h2>
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
            <label>Resultado de la Revisión:</label>
            <select value={resultado} onChange={(e) => setResultado(e.target.value)}>
                <option value="">Seleccionar</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
                <option value="derivado">Derivado</option>
            </select>
            </div>
            <div className={styles.formGroup}>
            <label>Observaciones:</label>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
            </div>
            <div>
            <button type="submit" className={styles.saveButton}>
                Guardar Revisión
            </button>
            <button type="button" onClick={onCancelarRevision} className={styles.cancelButton}>
                Cancelar
            </button>
            </div>
        </form>
        </div>
    );
};

export default FormularioRevision;