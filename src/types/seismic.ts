/**
 * Estructura del estado sísmico
 */
export interface Estado {
  id: number;
  nombre: string; // "Autoconfirmado", "Pendiente de Revisión", etc.
  ambito?: string | null;
}

/**
 * Estructura del cambio de estado
 */
export interface CambioEstado {
  id: number;
  fechaHoraInicio: Date | string;
  fechaHoraFin?: Date | string | null;
  eventoId: number;
  estadoId: number;
  estado?: Estado;
}

/**
 * Estructura del evento sísmico desde el backend
 */
export interface Earthquake {
  id: number;
  fechaHora: Date | string;
  magnitud: number;
  profundidad: number;
  latitud: number;
  longitud: number;
  ubicacion: string;
  region: string;
  origen: string;
  clasificacion: string; // "Alta", "Media", "Baja"
  alcance: string; // "Regional", "Local", "Amplio"
  revisadoPor?: string | null;
  observaciones?: string | null;
  estadoId: number;
  estado: Estado;
  cambios: CambioEstado[];
  // Campos computados para compatibilidad con UI
  status?: 'pending' | 'in_review' | 'completed' | 'referred' | 'rejected' | 'auto_confirmed' | 'auto_detected' | 'pending_review' | 'escalated' | 'unreviewed';
  reviewedBy?: string | null;
  notes?: string | null;
  location?: string;
  magnitude?: number;
  timestamp?: string;
}

export interface SeismicReview {
  earthquakeId: string | number;
  reviewerId: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'cancelled' | 'referred';
  notes: string;
  assessmentLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations?: string;
}

/**
 * Mapeo de estados del backend a estados del frontend
 */
export const ESTADO_MAP: Record<string, Earthquake['status']> = {
  "Autoconfirmado": "auto_confirmed",
  "Autodetectado": "auto_detected",
  "Pendiente de Revisión": "pending_review",
  "Bloqueado en Revisión": "in_review",
  "Confirmado": "completed",
  "Rechazado": "rejected",
  "Derivado a Superior": "escalated",
  "Evento sin Revision": "unreviewed"
};

/**
 * Estados que permiten revisión
 */
export const ESTADOS_REVISABLES = [
  "Pendiente de Revisión",
  "Autodetectado",
  "Autoconfirmado"
];

/**
 * Transforma un evento del backend a formato compatible con el frontend
 */
export function transformEarthquake(evento: any): Earthquake {
  const mappedStatus = ESTADO_MAP[evento.estado?.nombre] || 'pending';
  
  return {
    ...evento,
    status: mappedStatus,
    reviewedBy: evento.revisadoPor,
    notes: evento.observaciones,
    location: evento.ubicacion,
    magnitude: evento.magnitud,
    timestamp: evento.fechaHora
  };
}