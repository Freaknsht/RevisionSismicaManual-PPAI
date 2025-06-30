
import React, { useEffect } from 'react';
import styles from './Notificacion.module.css'; // estilos para notificación

const Notificacion = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={styles.notificacion}>
      {message}
    </div>
  );
};

export default Notificacion;
