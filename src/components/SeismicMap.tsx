import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Earthquake } from '@/types/seismic';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SeismicMapProps {
  earthquake: Earthquake;
  mapboxToken?: string;
  onTokenChange?: (token: string) => void;
}

const SeismicMap: React.FC<SeismicMapProps> = ({ 
  earthquake, 
  mapboxToken, 
  onTokenChange 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: earthquake.coordinates,
      zoom: 10,
      pitch: 45,
    });

    // Add earthquake marker
    const marker = new mapboxgl.Marker({
      color: '#ef4444',
      scale: 1.2
    })
      .setLngLat(earthquake.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2">
            <h3 class="font-semibold">Magnitud ${earthquake.magnitude}</h3>
            <p class="text-sm">${earthquake.location}</p>
            <p class="text-xs text-gray-600">Profundidad: ${earthquake.depth} km</p>
          </div>`
        )
      )
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [earthquake, mapboxToken]);

  if (!mapboxToken) {
    return (
      <div className="space-y-4 p-6 bg-secondary rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="mapbox-token">Token de Mapbox</Label>
          <Input
            id="mapbox-token"
            type="text"
            placeholder="Ingresa tu token público de Mapbox"
            value={mapboxToken || ''}
            onChange={(e) => onTokenChange?.(e.target.value)}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Puedes obtener tu token gratuito en{' '}
          <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            mapbox.com
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-card">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/10 rounded-lg" />
    </div>
  );
};

export default SeismicMap;