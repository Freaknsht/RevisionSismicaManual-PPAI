import Estado from './Estado';
import CambioEstado from './CambioEstado';

class EventoSismico {
    constructor(id, fechaHora, latitudEp, longitudEp, latitudHip, longitudHip, magnitud, origen, alcance, clasificacion, areaSismo, areaAfectada, serieTemporal, sismografo) {
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
        this.clasificacionOrdeada;
        this.areaSismo = areaSismo;
        this.areaAfectada = areaAfectada;
        this.fechaHoraRechazo = null;
        this.fechaHoraConfirmacion = null; 
        this.GenerarSismograma;

        this.alcance = alcance; // instancia de AlcanceSismico
        this.clasificacion = clasificacion; // instancia de ClasificacionSismo
        this.origen = origen; // instancia de OrigenDeGeneracion
        this.serieTemporal = serieTemporal; // instancia de SerieTemporal
        this.sismografo = sismografo; // instancia de Sismografo
        
        
        // Separar fecha y hora de detección
        const fechaActual = new Date();
        // Después
        this.fechaDeteccion = fechaHora.toLocaleDateString();
        this.horaDeteccion = fechaHora.toLocaleTimeString();

        
        this.cambiosEstado = [];
        // Inicializar estado según magnitud
        this.estado = magnitud < 4 ? Estado.AUTODETECTADO : null;
        if (this.estado) {
            this.registrarCambioEstado(this.estado);
        }
        
        // Iniciar temporizadores si es autodetectado
        if (this.estado === Estado.AUTODETECTADO) {
            this.iniciarTemporizadores();
        }
    }

    setFechaHoraRechazo(fecha) {
        this.fechaHoraRechazo = fecha;
    }
    getFechaHoraRechazo() {
        return this.fechaHoraRechazo;
    }

    setFechaHoraConfirmacion(fecha) {
        this.fechaHoraConfirmacion = fecha;
    }
    getFechaHoraConfirmacion() {
        return this.fechaHoraConfirmacion;
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
                }, 60 * 1000); // 1 minuto
            }
        }, 90 * 1000); // 1 minuto y medio
    }

    limpiarTemporizadores() {
        if (this.primerTemporizador) {
            clearTimeout(this.primerTemporizador);
        }
        if (this.segundoTemporizador) {
            clearTimeout(this.segundoTemporizador);
        }
    }

    registrarCambioEstado(nuevoEstado) {
        const ahora = new Date();
        // Cierra el último cambio si existe
        if (this.cambiosEstado.length > 0) {
            this.cambiosEstado[this.cambiosEstado.length - 1].cerrarCambio(ahora);
        }
        // Agrega el nuevo cambio de estado
        this.cambiosEstado.push(new CambioEstado(nuevoEstado, ahora));
        this.estado = nuevoEstado;
    }

    buscarUltimoCambioEstado() {
        if (this.cambiosEstado.length === 0) return null;
        return this.cambiosEstado[this.cambiosEstado.length - 1];
    }

    iniciarRevision() {
        if (this.estado.puedeIniciarRevision()) {
            this.limpiarTemporizadores();
            this.registrarCambioEstado(Estado.BLOQUEADO_EN_REVISION);
            return true;
        }
        return false;
    }

    cancelarRevision() {
        const ultimoCambio = this.buscarUltimoCambioEstado();
        if (ultimoCambio && this.estado.esBloqueadoEnRevision()) {
            // Cerramos el registro actual de BLOQUEADO_EN_REVISION
            ultimoCambio.cerrarCambio(new Date());
    
            // El penúltimo registro tiene el estado al que debemos regresar
            const anteriorCambio = this.cambiosEstado[this.cambiosEstado.length - 2];
            if (anteriorCambio) {
                this.estado = anteriorCambio.getEstado();
                this.registrarCambioEstado(this.estado);
            }
        }
    }

    rechazarEvento() {
        this.limpiarTemporizadores();
        this.registrarCambioEstado(Estado.RECHAZADO);
    }

    confirmarEvento() {
        this.registrarCambioEstado(new Estado('Confirmado', false));
    }

    derivarAExperto(supervisor) {
        this.limpiarTemporizadores();
        this.registrarCambioEstado(Estado.DERIVADO_A_EXPERTO);
        this.supervisorAsignado = supervisor; // Guardamos supervisor elegido
        this.fechaHoraDerivacion = new Date();
        console.log(`Evento ${this.id} derivado a experto: ${supervisor}`);
    }
    
    getSupervisorAsignado() {
        return this.supervisorAsignado || null;
    }
    getFechaHoraDerivacion() {
        return this.fechaHoraDerivacion;
    }
    
    getAlcance() {
        return this.alcance.getNombre();
    }
    getClasificacion() {
        return this.clasificacion.getNombre();
    }
    getOrigen() {
        return this.origen.getNombre();
    }
    getSerieTemporal() {
        return this.serieTemporal;
    }
    buscarSismografoConectado() {
        return this.sismografo;
    }

    clasificarInformacion(){
        return this.clasificacionOrdenada;
    }

    invocarGenerarSismograma(){
        return this.GenerarSismograma;
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

    esAutodetectado() {
        return this.estado.getNombre() === 'Autodetectado';
    }
    
}

export default EventoSismico;