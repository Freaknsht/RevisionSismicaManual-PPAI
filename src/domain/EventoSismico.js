import Estado from './Estado';

class EventoSismico {
    constructor(id, fechaHora, latitudEp, longitudEp, latitudHip, longitudHip, magnitud, origen, alcance, clasificacion, areaSismo, areaAfectada) {
        this.id = id;
        this.fechaHora = fechaHora;
        this.latitudEp = latitudEp;
        this.longitudEp = longitudEp;
        this.latitudHip = latitudHip;
        this.longitudHip = longitudHip;
        this.magnitud = magnitud;
        this.origen = origen;
        this.alcance = alcance;
        this.clasificacion = clasificacion;
        this.areaSismo = areaSismo;
        this.areaAfectada = areaAfectada;
        
        // Separar fecha y hora de detección
        const fechaActual = new Date();
        this.fechaDeteccion = fechaActual.toLocaleDateString();
        this.horaDeteccion = fechaActual.toLocaleTimeString();
        
        // Inicializar estado según magnitud
        this.estado = magnitud < 4 ? Estado.AUTODETECTADO : null;
        
        // Iniciar temporizadores si es autodetectado
        if (this.estado === Estado.AUTODETECTADO) {
            this.iniciarTemporizadores();
        }
    }

    iniciarTemporizadores() {
        // Temporizador para cambiar a PENDIENTE_REVISION después de 5 minutos
        this.primerTemporizador = setTimeout(() => {
            if (this.estado === Estado.AUTODETECTADO) {
                this.estado = this.estado.siguienteEstado();
                console.log(`Sismo ${this.id} cambió a estado: ${this.estado.getNombre()}`);
                
                // Temporizador para cambiar a EVENTO_SIN_REVISION después de otros 5 minutos
                this.segundoTemporizador = setTimeout(() => {
                    if (this.estado === Estado.PENDIENTE_REVISION) {
                        this.estado = this.estado.siguienteEstado();
                        console.log(`Sismo ${this.id} cambió a estado: ${this.estado.getNombre()}`);
                    }
                }, 5 * 60 * 1000); // 5 minutos
            }
        }, 5 * 60 * 1000); // 5 minutos
    }

    limpiarTemporizadores() {
        if (this.primerTemporizador) {
            clearTimeout(this.primerTemporizador);
        }
        if (this.segundoTemporizador) {
            clearTimeout(this.segundoTemporizador);
        }
    }

    iniciarRevision() {
        if (this.estado.puedeIniciarRevision()) {
            this.limpiarTemporizadores(); // Detener los temporizadores
            this.estado = this.estado.iniciarRevision();
            return true;
        }
        return false;
    }

    puedeIniciarRevision() {
        return this.estado.puedeIniciarRevision();
    }

    getEstado() {
        return this.estado;
    }

    getFechaHora() {
        return this.fechaHora;
    }

    getLatitudEp() {
        return this.latitudEp;
    }

    getLongitudEp() {
        return this.longitudEp;
    }

    getLatitudHip() {
        return this.latitudHip;
    }

    getLongitudHip() {
        return this.longitudHip;
    }

    getMagnitud() {
        return this.magnitud;
    }

    getOrigen() {
        return this.origen;
    }

    getAlcance() {
        return this.alcance;
    }

    getClasificacion() {
        return this.clasificacion;
    }

    getAreaSismo() {
        return this.areaSismo;
    }

    getAreaAfectada() {
        return this.areaAfectada;
    }

    getFechaDeteccion() {
        return this.fechaDeteccion;
    }

    getHoraDeteccion() {
        return this.horaDeteccion;
    }
}

export default EventoSismico; 