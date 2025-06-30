import { obtenerSismos, guardarRevisionSismo } from '../services/sismoService'; // Simula llamadas al backend (luego lo reemplazaremos)
import Estado from './Estado';

const GestorRevision = {
    //Simula la obtención de sismos desde un servicio
    buscarEventoAutodetectado: async () => {
        try {
        const sismos = await obtenerSismos();
        return sismos;
        } catch (error) {
        console.error("Error al buscar sismos:", error);
        throw error;
        }
    },

    //Encuentra un sismo por su ID dentro de la lista de sismos.
    seleccionarSismo: (sismoId, sismos) => {
        const sismo = sismos.find(s => s.id === sismoId);
        return sismo;
    },

    tomarDatosSeleccion: (sismo) => {
        // Verificamos si el sismo es autodetectado
        const esAutodetectado = sismo.esAutodetectado();
        
        // Si es autodetectado, procedemos a obtener los datos principales
        if (esAutodetectado) {
            const datosSismo = {
                fechaHora: sismo.getFechaHora(),
                latitudEp: sismo.getLatitudEp(),
                longitudEp: sismo.getLongitudEp(),
                latitudHip: sismo.getLatitudHip(),
                longitudHip: sismo.getLongitudHip(),
                magnitud: sismo.getMagnitud(),
                //De aca para abajo no deberia estar(? o no en este llamado
                origen: sismo.getOrigen(),
                alcance: sismo.getAlcance(),
                clasificacion: sismo.getClasificacion(),
                areaSismo: sismo.getAreaSismo(),
                areaAfectada: sismo.getAreaAfectada(),
                fechaDeteccion: sismo.getFechaDeteccion(),
                horaDeteccion: sismo.getHoraDeteccion()
            };
            return datosSismo;
        }
        
        return null; // O manejar el caso cuando no es autodetectado
    },

    //Simula guardar el resultado de la revisión en el backend.
    registrarResultadoRevision: async (revision) => {
        try {
        await guardarRevisionSismo(revision); // Simula guardar en el backend
        return { success: true, message: "Revisión registrada correctamente" };
        } catch (error) {
        console.error("Error al registrar la revisión:", error);
        throw error;
        }
    },

    //Lógica para cancelar la revisión.
    cancelarRevision: () => {
        // Lógica para cancelar (por ahora no hay nada específico)
        return { success: true, message: "Revisión cancelada" };
    },

    buscarEstadoBloqueadoEnRevision: (evento) => {
        // Obtener el estado actual del evento
    const estadoActual = evento.getEstado();

    // Verificar si el estado actual es Autodetectado o Pendiente de Revisión
    const nombreEstado = estadoActual.getNombre();
    if (nombreEstado === 'Autodetectado' || nombreEstado === 'Pendiente de Revisión') {
        // Si está en uno de estos estados, verificar si puede iniciar revisión
        if (estadoActual.puedeIniciarRevision()) {
            // Cambia el estado del evento
            evento.iniciarRevision();
            return true;
        }
    }
    return false;
    },

    buscarEmpleadoLogueado: () => {
        return localStorage.getItem('usuarioLogueado') || null;
    },

    bloquearEvento: (evento) => {
        const ultimoCambio = evento.buscarUltimoCambioEstado();
        if (ultimoCambio) {
            ultimoCambio.cerrarCambio(new Date());
        }
        evento.registrarCambioEstado(Estado.BLOQUEADO_EN_REVISION);
    },
};

export default GestorRevision;