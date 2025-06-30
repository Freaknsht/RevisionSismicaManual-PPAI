import EventoSismico from '../domain/EventoSismico';
import AlcanceSismico from '../domain/AlcanceSismico';
import ClasificacionSismo from '../domain/ClasificacionSismo';
import OrigenDeGeneracion from '../domain/OrigenDeGeneracion';

// Definimos dos fechas para los sismos
const fechaReciente = new Date(); // Ahora
const fechaVieja = new Date();
fechaVieja.setDate(fechaVieja.getDate() - 1); // Ayer
fechaVieja.setHours(9, 15);

const fechaMasVieja = new Date(fechaVieja);
fechaMasVieja.setDate(fechaMasVieja.getDate() - 1); // Dos días atrás
fechaMasVieja.setHours(8, 0);

// Objetos de dominio para los sismos
const alcanceLocal = new AlcanceSismico("Local");
const alcanceRegional = new AlcanceSismico("Regional");
const alcanceAmplio = new AlcanceSismico("Amplio");

const clasificacionSuperficial = new ClasificacionSismo("Superficial");
const clasificacionIntermedio = new ClasificacionSismo("Intermedio");
const clasificacionProfundo = new ClasificacionSismo("Profundo");

const origenNatural = new OrigenDeGeneracion("Natural");
const origenTectonico = new OrigenDeGeneracion("Tectónico");
const origenVolcanico = new OrigenDeGeneracion("Volcánico");

// Simulamos una base de datos de sismos
const sismosMock = [
    new EventoSismico(
        1,
        fechaReciente,            // Ahora
        -31.4201,
        -64.1888,
        -31.4,
        -64.2,
        3.5,
        origenNatural,
        alcanceLocal,
        clasificacionSuperficial,
        "San Juan Centro",
        "Zona Urbana San Juan",
        "serie de 10",
        "sismografo 1"
    ),
    new EventoSismico(
        2,
        fechaVieja,              // Ayer
        -32.8566,
        -68.8839,
        -32.9,
        -68.9,
        3.8,
        origenTectonico,
        alcanceRegional,
        clasificacionIntermedio,
        "Valle de Uco",
        "Zona Rural Mendoza",
        "serie de 10",
        "sismografo 1"
    ),
    new EventoSismico(
        3,
        fechaMasVieja,            
        -33.0153,
        -71.5500,
        -33.0,
        -71.6,
        3.9,
        origenVolcanico,
        alcanceAmplio,
        clasificacionProfundo,
        "Cordillera de los Andes Sur",
        "Zona Fronteriza Chile-Argentina",
        "serie de 10",
        "sismografo 3"
    )

];

export const obtenerSismos = async () => {
    // Simulamos una llamada asíncrona
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sismosMock);
        }, 500);
    });
};

export const guardarRevisionSismo = async (revision) => {
    // Simulamos guardar la revisión
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
};
