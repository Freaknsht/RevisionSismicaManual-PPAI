import EventoSismico from '../domain/EventoSismico';

// Definimos dos fechas para los sismos
const fechaReciente = new Date(); // Ahora
const fechaVieja = new Date();
fechaVieja.setDate(fechaVieja.getDate() - 1); // Ayer
fechaVieja.setHours(9, 15);

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
        "Natural",
        "Local",
        "Superficial",
        "San Juan Centro",
        "Zona Urbana San Juan"
    ),
    new EventoSismico(
        2,
        fechaVieja,              // Ayer
        -32.8566,
        -68.8839,
        -32.9,
        -68.9,
        3.8,
        "Tectónico",
        "Regional",
        "Intermedio",
        "Valle de Uco",
        "Zona Rural Mendoza"
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
