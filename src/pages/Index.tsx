import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Activity, AlertTriangle, TrendingUp, ArrowLeft, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EarthquakeCard from '@/components/EarthquakeCard';
import EarthquakeDetails from '@/components/EarthquakeDetails';
import SeismicReview from '@/components/SeismicReview';
import { Earthquake, transformEarthquake } from '@/types/seismic';
import { useToast } from '@/hooks/use-toast';

// URL del backend - Usa proxy en desarrollo, URL absoluta en producción
const BACKEND_URL = import.meta.env.MODE === 'development' 
  ? '/api/sismos' 
  : 'http://localhost:3001/api/sismos';

/**
 * Página principal de revisión de eventos sísmicos
 * Implementa el Caso de Uso: Registro de resultado de revisión manual
 */
const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [magnitudeFilter, setMagnitudeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carga todos los eventos sísmicos desde el backend
   */
  const loadEarthquakes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar eventos sísmicos');
      }

      const data = await response.json();
      
      // Transformar eventos del backend
      const transformedEarthquakes = (Array.isArray(data) ? data : data.data || []).map(transformEarthquake);
      setEarthquakes(transformedEarthquakes);
      
      if (transformedEarthquakes.length === 0) {
        toast({
          title: "No hay eventos sísmicos",
          description: "No se encontraron eventos sísmicos en la base de datos",
        });
      }
    } catch (error) {
      console.error('Error loading earthquakes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos sísmicos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Carga los eventos al montar el componente
   */
  useEffect(() => {
    loadEarthquakes();
  }, [loadEarthquakes]);

  /**
   * Filtra los sismos según los criterios de búsqueda
   */
  const filteredEarthquakes = useMemo(() => {
    return earthquakes.filter(earthquake => {
      const matchesSearch = earthquake.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           earthquake.region.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || earthquake.status === statusFilter;
      
      const matchesMagnitude = magnitudeFilter === 'all' || 
        (magnitudeFilter === 'low' && earthquake.magnitud < 5) ||
        (magnitudeFilter === 'medium' && earthquake.magnitud >= 5 && earthquake.magnitud < 6) ||
        (magnitudeFilter === 'high' && earthquake.magnitud >= 6 && earthquake.magnitud < 7) ||
        (magnitudeFilter === 'critical' && earthquake.magnitud >= 7);

      return matchesSearch && matchesStatus && matchesMagnitude;
    });
  }, [earthquakes, searchTerm, statusFilter, magnitudeFilter]);

  /**
   * Calcula estadísticas de los eventos sísmicos
   */
  const stats = useMemo(() => {
    const total = earthquakes.length;
    const pending = earthquakes.filter(eq => ['pending_review', 'auto_detected', 'auto_confirmed'].includes(eq.status as string)).length;
    const inReview = earthquakes.filter(eq => eq.status === 'in_review').length;
    const highMagnitude = earthquakes.filter(eq => eq.magnitud >= 6).length;
    
    return { total, pending, inReview, highMagnitude };
  }, [earthquakes]);

  /**
   * Maneja la selección de un evento sísmico
   */
  const handleEarthquakeClick = (earthquake: Earthquake) => {
    setSelectedEarthquake(earthquake);
    setShowDetails(true);
  };

  /**
   * Inicia la revisión del evento sísmico
   */
  const handleStartReview = async () => {
    if (!selectedEarthquake) return;

    try {
      const response = await fetch(`${BACKEND_URL}/${selectedEarthquake.id}/iniciar-revision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo iniciar la revisión');
      }

      // Actualizar estado local
      const updatedEarthquake = {
        ...selectedEarthquake,
        estado: {
          ...selectedEarthquake.estado,
          nombre: 'Bloqueado en Revisión'
        },
        status: 'in_review' as const
      };

      setEarthquakes(prev => prev.map(eq => 
        eq.id === selectedEarthquake.id ? updatedEarthquake : eq
      ));
      
      setSelectedEarthquake(updatedEarthquake);
      setShowDetails(false);
      setShowReview(true);

      toast({
        title: "Revisión iniciada",
        description: "El evento ha sido bloqueado para revisión",
      });
    } catch (error) {
      console.error('Error starting review:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la revisión del evento",
        variant: "destructive",
      });
    }
  };

  /**
   * Completa la revisión del evento sísmico
   */
  const handleCompleteReview = async (
    action: 'accept' | 'cancel' | 'refer' | 'reject',
    notes: string,
    assessment: string
  ) => {
    if (!selectedEarthquake) return;

    try {
      let endpoint = '';

      switch(action) {
        case 'accept':
          endpoint = `${BACKEND_URL}/${selectedEarthquake.id}/confirmar`;
          break;
        case 'reject':
          endpoint = `${BACKEND_URL}/${selectedEarthquake.id}/rechazar`;
          break;
        case 'refer':
          endpoint = `${BACKEND_URL}/${selectedEarthquake.id}/derivar`;
          break;
        case 'cancel':
          // Simplemente cerrar sin hacer cambios
          closeModals();
          toast({
            title: "Revisión cancelada",
            description: "La revisión ha sido cancelada",
          });
          return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          observaciones: notes,
          evaluacion: assessment
        })
      });

      if (!response.ok) {
        throw new Error(`Error en la acción: ${action}`);
      }

      const result = await response.json();
      const updatedEvento = result.evento || result;

      // Transformar y actualizar
      const transformedEvento = transformEarthquake(updatedEvento);
      
      setEarthquakes(prev => prev.map(eq => 
        eq.id === selectedEarthquake.id ? transformedEvento : eq
      ));

      toast({
        title: "Revisión completada",
        description: action === 'accept'
          ? 'El evento ha sido confirmado'
          : action === 'refer'
          ? 'El evento ha sido derivado a superior'
          : 'El evento ha sido rechazado',
      });

      closeModals();
    } catch (error) {
      console.error('Error completing review:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la acción",
        variant: "destructive",
      });
    }
  };

  /**
   * Cierra los modales
   */
  const closeModals = () => {
    setShowDetails(false);
    setShowReview(false);
    setSelectedEarthquake(null);
  };

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  /**
   * Vuelve al dashboard
   */
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header con navegación */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={handleBackToDashboard}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            Registro de Revisión Manual
          </h1>
          <p className="text-xl text-muted-foreground">
            Gestión de eventos sísmicos - Filtra por estado o magnitud
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Sismos</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Eventos registrados</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Requieren revisión</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.inReview}</div>
              <p className="text-xs text-muted-foreground">En proceso</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alta Magnitud</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.highMagnitude}</div>
              <p className="text-xs text-muted-foreground">Magnitud ≥ 6.0</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar por ubicación</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar sismos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending_review">Pendiente de Revisión</SelectItem>
                    <SelectItem value="auto_detected">Autodetectado</SelectItem>
                    <SelectItem value="auto_confirmed">Autoconfirmado</SelectItem>
                    <SelectItem value="in_review">En Revisión</SelectItem>
                    <SelectItem value="completed">Confirmado</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                    <SelectItem value="escalated">Derivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Magnitud</label>
                <Select value={magnitudeFilter} onValueChange={setMagnitudeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las magnitudes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las magnitudes</SelectItem>
                    <SelectItem value="low">Baja (&lt; 5.0)</SelectItem>
                    <SelectItem value="medium">Moderada (5.0 - 5.9)</SelectItem>
                    <SelectItem value="high">Alta (6.0 - 6.9)</SelectItem>
                    <SelectItem value="critical">Crítica (≥ 7.0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de sismos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Eventos Sísmicos 
              <Badge variant="outline" className="ml-2">
                {filteredEarthquakes.length} resultados
              </Badge>
            </h2>
          </div>

          {isLoading ? (
            <Card className="shadow-card">
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Cargando eventos sísmicos...</p>
              </CardContent>
            </Card>
          ) : filteredEarthquakes.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron sismos</h3>
                <p className="text-muted-foreground">
                  Ajusta los filtros de búsqueda para encontrar eventos sísmicos.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredEarthquakes.map((earthquake) => (
                <EarthquakeCard
                  key={earthquake.id}
                  earthquake={earthquake}
                  onClick={() => handleEarthquakeClick(earthquake)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modales */}
        {showDetails && selectedEarthquake && (
          <EarthquakeDetails
            earthquake={selectedEarthquake}
            onClose={closeModals}
            onStartReview={handleStartReview}
          />
        )}

        {showReview && selectedEarthquake && (
          <SeismicReview
            earthquake={selectedEarthquake}
            onClose={closeModals}
            onComplete={handleCompleteReview}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
