import React, { useState } from 'react';
import styles from './FormularioRevision.module.css'; // Importa los estilos
import mapaZona from '../../picture/mapa-zona.jpg';

const FormularioRevision = ({ sismo, onGuardarRevision, onCancelarRevision }) => { // onGuardarRevision
    const [resultado, setResultado] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [mostrarModalDerivar, setMostrarModalDerivar] = useState(false);
    const [supervisorSeleccionado, setSupervisorSeleccionado] = useState('');



    const handleSubmit = (e) => {
        e.preventDefault();
        onGuardarRevision({ // onGuardarRevision
        sismoId: sismo.id,
        resultado,
        observaciones,
        });
    };
    const handleCancelarRevision = () => {
        sismo.cancelarRevision();
        // vuelve al estado anterior
        setSismos((prevSismos) =>
          prevSismos.map((s) => (s.id === sismo.id ? { ...s } : s))
        );
    };

    return (

        <div className={styles.formularioRevisionContainer}>
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
                    <textarea
                        className={styles.textInput}
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Resultado de la Revisión:</label>
                    <select
                        className={styles.selectInput}
                        value={resultado}
                        onChange={(e) => setResultado(e.target.value)}
                    >
                        <option value="" disabled style={{ color: '#777' }}>
                            Seleccionar
                        </option>
                        <option value="aprobado">Confirmar</option>
                        <option value="rechazado">Rechazar</option>
                    </select>
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        onClick={()=> {onCancelarRevision(), handleCancelarRevision()}}
                        className={styles.cancelButton}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.saveButton}
                    >
                        Guardar Revisión
                    </button>
                    <button
                       type="button"
                       onClick={() => setMostrarModalDerivar(true)}
                       className={styles.DerivarButton}
                    >
                        Derivar a supervisor
                    </button>
                </div>
            </form>

            {mostrarModalDerivar && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContenido}>
                        <h3>Elegir Supervisor</h3>
                        <ul>
                            <li className={supervisorSeleccionado === 'Juan López' ? styles.supervisorActivo : ''}
                                onClick={() => setSupervisorSeleccionado('Juan López')}>
                                    Juan López
                            </li>



                            <li  className={supervisorSeleccionado === 'María Gómez' ? styles.supervisorActivo : ''}
                                 onClick={() => setSupervisorSeleccionado('María Gómez')}>
                                    María Gómez
                            </li>
                        </ul>
                        <div className={styles.modalBotones}>
                            <button onClick={() => setMostrarModalDerivar(false)} className={styles.cancelButton}>
                                Cancelar
                            </button>
                            <button className={styles.saveButton}>
                                Derivar
                            </button>
                        </div>
                    </div>
                </div>
            )}

           </div>
        </div>
    );
};

export default FormularioRevision;