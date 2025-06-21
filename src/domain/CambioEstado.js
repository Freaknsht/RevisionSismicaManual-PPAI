class CambioEstado {
    constructor(estado, fechaHoraInicio, fechaHoraFin = null) {
        this.estado = estado;
        this.fechaHoraInicio = fechaHoraInicio;
        this.fechaHoraFin = fechaHoraFin;
    }

    cerrarCambio(fechaHoraFin) {
        this.fechaHoraFin = fechaHoraFin;
    }

    getEstado() {
        return this.estado;
    }

    getFechaHoraInicio() {
        return this.fechaHoraInicio;
    }

    getFechaHoraFin() {
        return this.fechaHoraFin;
    }
}

export default CambioEstado;