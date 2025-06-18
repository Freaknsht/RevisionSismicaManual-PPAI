import { obtenerSismos, guardarRevisionSismo } from '../services/sismoService'; // Simula llamadas al backend (luego lo reemplazaremos)

const GestorRevision = {
    //Simula la obtención de sismos desde un servicio
    buscarSismos: async () => {
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

    tomarDatosRevision: (sismo) => {
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
        // Verifica si el evento está en estado bloqueado en revisión
        const estado = evento.getEstado();
        return estado.esAmbitoEventoSismico(evento) && estado.esBloqueadoEnRevision();
    }
};

export default GestorRevision;