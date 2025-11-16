import { Earthquake } from '@/types/seismic';

export const earthquakesData: Earthquake[] = [
  {
    id: 'eq-001',
    magnitude: 7.2,
    location: 'Costa Rica Central',
    coordinates: [-84.0907, 9.7489],
    depth: 15.2,
    timestamp: '2024-01-15T14:30:22Z',
    region: 'Provincia de San José',
    status: 'pending'
  },
  {
    id: 'eq-002',
    magnitude: 5.8,
    location: 'Península de Nicoya',
    coordinates: [-85.2538, 10.1627],
    depth: 8.7,
    timestamp: '2024-01-15T16:45:10Z',
    region: 'Provincia de Guanacaste',
    status: 'in_review',
    reviewedBy: 'Dr. María González'
  },
  {
    id: 'eq-003',
    magnitude: 6.1,
    location: 'Cartago',
    coordinates: [-83.9176, 9.8643],
    depth: 22.5,
    timestamp: '2024-01-15T12:15:33Z',
    region: 'Provincia de Cartago',
    status: 'completed',
    reviewedBy: 'Dr. Carlos Ramírez',
    notes: 'Revisión completada. Sin daños estructurales reportados.'
  },
  {
    id: 'eq-004',
    magnitude: 4.3,
    location: 'Puntarenas',
    coordinates: [-84.8369, 9.9748],
    depth: 12.1,
    timestamp: '2024-01-15T18:22:45Z',
    region: 'Provincia de Puntarenas',
    status: 'pending'
  },
  {
    id: 'eq-005',
    magnitude: 8.1,
    location: 'Pacífico Sur',
    coordinates: [-83.7534, 8.9824],
    depth: 35.8,
    timestamp: '2024-01-15T09:10:15Z',
    region: 'Offshore Costa Rica',
    status: 'referred',
    reviewedBy: 'Sistema Automático',
    notes: 'Derivado a experto internacional por magnitud crítica.'
  }
];