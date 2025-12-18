import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Activity, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Earthquake } from '@/types/seismic';
import { cn } from '@/lib/utils';

interface EarthquakeCardProps {
  earthquake: Earthquake;
  onClick: () => void;
}

const EarthquakeCard: React.FC<EarthquakeCardProps> = ({ earthquake, onClick }) => {
  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return 'bg-destructive text-destructive-foreground';
    if (magnitude >= 6) return 'bg-warning text-warning-foreground';
    if (magnitude >= 5) return 'bg-primary text-primary-foreground';
    return 'bg-secondary text-secondary-foreground';
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'pending_review': 
      case 'auto_detected':
      case 'auto_confirmed':
        return 'bg-warning/20 text-warning-foreground border-warning/30';
      case 'in_review': return 'bg-primary/20 text-primary-foreground border-primary/30';
      case 'completed': return 'bg-success/20 text-success-foreground border-success/30';
      case 'rejected': return 'bg-destructive/20 text-destructive-foreground border-destructive/30';
      case 'escalated': return 'bg-blue/20 text-blue-foreground border-blue/30';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'pending_review': return 'Pendiente de Revisión';
      case 'auto_detected': return 'Autodetectado';
      case 'auto_confirmed': return 'Autoconfirmado';
      case 'in_review': return 'En Revisión';
      case 'completed': return 'Confirmado';
      case 'rejected': return 'Rechazado';
      case 'escalated': return 'Derivado';
      default: return status || 'Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-105",
        "animate-fade-in"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg",
              getMagnitudeColor(earthquake.magnitud),
              earthquake.magnitud >= 7 && "animate-seismic-pulse"
            )}>
              {earthquake.magnitud}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{earthquake.ubicacion}</h3>
              <p className="text-sm text-muted-foreground">{earthquake.region}</p>
            </div>
          </div>
          <Badge className={getStatusColor(earthquake.status)}>
            {getStatusText(earthquake.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Profundidad:</span>
            <span className="font-medium">{earthquake.profundidad} km</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Coordenadas:</span>
            <span className="font-medium font-mono text-xs">
              {earthquake.latitud.toFixed(3)}, {earthquake.longitud.toFixed(3)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium">{formatDate(String(earthquake.fechaHora))}</span>
          </div>
        </div>

        {earthquake.magnitud >= 6 && (
          <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning-foreground">
              Sismo de alta magnitud - Requiere atención prioritaria
            </span>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarthquakeCard;