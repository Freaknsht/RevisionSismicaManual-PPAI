class Estado {
    static AUTODETECTADO = new Estado('Autodetectado', true);
    static PENDIENTE_REVISION = new Estado('Pendiente de Revisión', true);
    static EVENTO_SIN_REVISION = new Estado('Evento sin Revisión', false);
    static BLOQUEADO_EN_REVISION = new Estado('Bloqueado en Revisión', false);
    static RECHAZADO = new Estado('Rechazado', false);
    static CONFIRMADO = new Estado('Confirmado', false);
    static DERIVADO_A_EXPERTO = new Estado('Derivado a experto', false);


    constructor(nombre, puedeRevisar) {
        this.nombre = nombre;
        this.puedeRevisar = puedeRevisar;
    }

    getNombre() {
        return this.nombre;
    }

    puedeIniciarRevision() {
        return this.puedeRevisar;
    }

    siguienteEstado() {
        switch(this.nombre) {
            case 'Autodetectado':
                return Estado.PENDIENTE_REVISION;
            case 'Pendiente de Revisión':
                return Estado.EVENTO_SIN_REVISION;
            default:
                return this;
        }
    }

    iniciarRevision() {
        if (this.puedeRevisar) {
            return Estado.BLOQUEADO_EN_REVISION;
        }
        return this;
    }

    esAmbitoEventoSismico(evento) {
        // Si tu modelo no tiene historial de estados, asumimos que sí
        return true; // porque este estado ya es parte del evento
    }
    
    esBloqueadoEnRevision() {
        return this === Estado.BLOQUEADO_EN_REVISION;
    }
    esDerivadoAExperto() {
        return this === Estado.DERIVADO_A_EXPERTO;
    }
}

export default Estado; 