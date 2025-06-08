import EventoSismico from '../domain/EventoSismico';

// Simulamos una base de datos de sismos
const sismosMock = [
    new EventoSismico(
        1,
        new Date('2024-03-10T10:30:00'),
        -31.4201,
        -64.1888,
        -31.4,
        -64.2,
        3.5, // Magnitud menor a 4 (será autodetectado)
        "Natural",
        "Local",
        "Superficial",
        "San Juan Centro",
        "Zona Urbana San Juan"
    ),
    new EventoSismico(
        2,
        new Date('2024-03-11T15:45:00'),
        -32.8566,
        -68.8839,
        -32.9,
        -68.9,
        3.8, // Magnitud menor a 4 (será autodetectado)
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