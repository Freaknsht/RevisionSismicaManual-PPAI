import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Activity, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserX,
  Save,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Earthquake } from '@/types/seismic';
import SeismicMap from './SeismicMap';
import { useToast } from '@/hooks/use-toast';

interface SeismicReviewProps {
  earthquake: Earthquake;
  onClose: () => void;
  onComplete: (action: 'accept' | 'cancel' | 'refer', notes: string, assessment: string) => void;
}

const SeismicReview: React.FC<SeismicReviewProps> = ({ 
  earthquake, 
  onClose, 
  onComplete 
}) => {
  const [notes, setNotes] = useState('');
  const [assessment, setAssessment] = useState<string>('medium');
  const [mapboxToken, setMapboxToken] = useState('');
  const { toast } = useToast();

  const handleComplete = (action: 'accept' | 'cancel' | 'refer') => {
    if (!notes.trim()) {
      toast({
        title: "Notas requeridas",
        description: "Por favor, añade notas sobre tu revisión antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    onComplete(action, notes, assessment);
    
    const actionTexts = {
      accept: 'aceptado',
      cancel: 'cancelado', 
      refer: 'derivado a experto'
    };

    toast({
      title: "Revisión completada",
      description: `El sismo ha sido ${actionTexts[action]} exitosamente.`,
    });
  };

  const getAssessmentColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      case 'critical': return 'text-destructive animate-seismic-pulse';
      default: return 'text-muted-foreground';
    }
  };

  const getAssessmentText = (level: string) => {
    switch (level) {
      case 'low': return 'Bajo Riesgo';
      case 'medium': return 'Riesgo Moderado';
      case 'high': return 'Alto Riesgo';
      case 'critical': return 'Riesgo Crítico';
      default: return level;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Revisión Sísmica</CardTitle>
              <p className="text-muted-foreground mt-1">
                Evaluación detallada del evento sísmico
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información del sismo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Datos del Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Magnitud:</span>
                  <Badge variant="destructive" className="text-lg font-bold">
                    {earthquake.magnitude}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ubicación:</span>
                  <span className="font-medium">{earthquake.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Profundidad:</span>
                  <span className="font-medium">{earthquake.depth} km</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Región:</span>
                  <span className="font-medium">{earthquake.region}</span>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Timestamp:</span>
                  </div>
                  <span className="font-mono text-xs">
                    {new Date(earthquake.timestamp).toLocaleString('es-ES')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Ubicación Geográfica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SeismicMap 
                  earthquake={earthquake} 
                  mapboxToken={mapboxToken}
                  onTokenChange={setMapboxToken}
                />
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Evaluación de riesgo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Evaluación de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={assessment} onValueChange={setAssessment}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="text-success font-medium">
                      Bajo Riesgo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-warning font-medium">
                      Riesgo Moderado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="text-destructive font-medium">
                      Alto Riesgo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="critical" id="critical" />
                    <Label htmlFor="critical" className="text-destructive font-medium">
                      Riesgo Crítico
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              
              <div className="mt-4 p-3 bg-secondary rounded-lg">
                <p className={`font-medium ${getAssessmentColor(assessment)}`}>
                  Nivel seleccionado: {getAssessmentText(assessment)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notas de revisión */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Documentación de la Revisión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="review-notes">Notas y Observaciones *</Label>
                <Textarea
                  id="review-notes"
                  placeholder="Describe tus observaciones, análisis y recomendaciones sobre este evento sísmico..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Incluye información relevante sobre impactos, daños observados, o recomendaciones.
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Acciones de revisión */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => handleComplete('cancel')}
              className="flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancelar Revisión
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleComplete('refer')}
              className="flex items-center gap-2 border-warning text-warning hover:bg-warning hover:text-warning-foreground"
            >
              <UserX className="w-4 h-4" />
              Derivar a Experto
            </Button>
            
            <Button 
              onClick={() => handleComplete('accept')}
              className="flex items-center gap-2 bg-gradient-to-r from-success to-primary"
            >
              <CheckCircle className="w-4 h-4" />
              Completar Revisión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeismicReview;