import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  X, 
  Activity, 
  MapPin, 
  Clock, 
  Users, 
  FileText,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Earthquake } from '@/types/seismic';
import { cn } from '@/lib/utils';

interface EarthquakeDetailsProps {
  earthquake: Earthquake;
  onClose: () => void;
  onStartReview: () => void;
}

const EarthquakeDetails: React.FC<EarthquakeDetailsProps> = ({ 
  earthquake, 
  onClose, 
  onStartReview 
}) => {
  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return 'text-destructive';
    if (magnitude >= 6) return 'text-warning';
    if (magnitude >= 5) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/20 text-warning-foreground border-warning/30';
      case 'in_review': return 'bg-primary/20 text-primary-foreground border-primary/30';
      case 'completed': return 'bg-success/20 text-success-foreground border-success/30';
      case 'referred': return 'bg-destructive/20 text-destructive-foreground border-destructive/30';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente de Revisión';
      case 'in_review': return 'En Proceso de Revisión';
      case 'completed': return 'Revisión Completada';
      case 'referred': return 'Derivado a Experto';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm:ss', { locale: es });
  };

  const canStartReview = earthquake.status === 'pending';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Detalles del Sismo</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center justify-center w-16 h-16 rounded-full bg-card border-2 font-bold text-2xl",
              getMagnitudeColor(earthquake.magnitude),
              earthquake.magnitude >= 7 && "animate-seismic-pulse border-destructive"
            )}>
              {earthquake.magnitude}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{earthquake.location}</h3>
              <p className="text-muted-foreground">{earthquake.region}</p>
              <Badge className={cn("mt-2", getStatusColor(earthquake.status))}>
                {getStatusText(earthquake.status)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Profundidad</p>
                  <p className="font-semibold">{earthquake.depth} kilómetros</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Coordenadas</p>
                  <p className="font-mono text-sm">
                    Lat: {earthquake.coordinates[1].toFixed(4)}°<br/>
                    Lon: {earthquake.coordinates[0].toFixed(4)}°
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha y Hora</p>
                  <p className="font-semibold">{formatDate(earthquake.timestamp)}</p>
                </div>
              </div>

              {earthquake.reviewedBy && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Revisado por</p>
                    <p className="font-semibold">{earthquake.reviewedBy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alertas de magnitud */}
          {earthquake.magnitude >= 6 && (
            <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-warning-foreground">
                    Sismo de Alta Magnitud
                  </h4>
                  <p className="text-sm text-warning-foreground/80">
                    Este evento sísmico requiere evaluación prioritaria debido a su magnitud significativa.
                    Se recomienda verificar posibles daños en infraestructura crítica.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notas de revisión */}
          {earthquake.notes && (
            <div>
              <Separator className="mb-4" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold">Notas de Revisión</h4>
                </div>
                <p className="text-sm bg-secondary p-3 rounded-lg">
                  {earthquake.notes}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Acciones */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            
            {canStartReview && (
              <Button 
                onClick={onStartReview}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Iniciar Revisión
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            {earthquake.status === 'completed' && (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Revisión Completada</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarthquakeDetails;