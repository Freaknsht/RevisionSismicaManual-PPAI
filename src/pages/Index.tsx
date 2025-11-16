import React, { useState, useMemo, useEffect } from 'react';
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
import { earthquakesData } from '@/data/earthquakes';
import { Earthquake } from '@/types/seismic';
import { useToast } from '@/hooks/use-toast';

/**
 * Página principal de revisión de eventos sísmicos
 * Implementa el Caso de Uso: Registro de resultado de revisión manual
 * 
 * Paso 6 del CU: El sistema busca todos los eventos sísmicos auto detectados 
 * que aún no han sido revisados, los ordena por fecha y hora de ocurrencia
 * y visualiza los datos principales de cada uno
 */
const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para los sismos cargados desde el backend
  // Paso 6 del CU: Eventos sísmicos auto detectados pendientes de revisión
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending'); // Filtro por defecto: pendientes
  const [magnitudeFilter, setMagnitudeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Verifica autenticación y carga eventos sísmicos al montar el componente
   * Paso 6 del CU: Buscar eventos sísmicos auto detectados que no han sido revisados
   */
  useEffect(() => {
    // Verificar autenticación
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    // Cargar eventos sísmicos desde el backend
    loadEarthquakes();
  }, [navigate]);

  /**
   * Carga los eventos sísmicos desde el backend
   * TODO: Implementar llamada al backend Node.js
   * Endpoint: GET /api/sismos/pendientes
   * Headers: { Authorization: Bearer <token> }
   * Response: Array de eventos sísmicos con estado 'pending'
   * 
   * Paso 6 del CU: Busca todos los eventos sísmicos auto detectados que aún no han sido revisados
   * y los ordena por fecha y hora de ocurrencia
   */
  const loadEarthquakes = async () => {
    setIsLoading(true);
    
    // TODO BACKEND: Descomentar cuando el backend esté disponible
    /*
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/sismos/pendientes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar eventos sísmicos');
      }

      const data = await response.json();
      // Los datos deben venir ordenados por fecha y hora de ocurrencia (más recientes primero)
      setEarthquakes(data);
      
      // Flujo alternativo A1: No hay sismos auto detectados pendientes de revisión
      if (data.length === 0) {
        toast({
          title: "No hay eventos pendientes",
          description: "No se encontraron eventos sísmicos pendientes de revisión",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos sísmicos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    */

    // Datos de ejemplo (eliminar cuando se implemente backend)
    // Los datos están ordenados por fecha y hora (más recientes primero)
    setTimeout(() => {
      setEarthquakes(earthquakesData);
      setIsLoading(false);
    }, 500);
  };

  /**
   * Filtra los sismos según los criterios de búsqueda
   * Permite al AS buscar eventos específicos entre todos los pendientes
   */
  const filteredEarthquakes = useMemo(() => {
    return earthquakes.filter(earthquake => {
      const matchesSearch = earthquake.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           earthquake.region.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || earthquake.status === statusFilter;
      
      const matchesMagnitude = magnitudeFilter === 'all' || 
        (magnitudeFilter === 'low' && earthquake.magnitude < 5) ||
        (magnitudeFilter === 'medium' && earthquake.magnitude >= 5 && earthquake.magnitude < 6) ||
        (magnitudeFilter === 'high' && earthquake.magnitude >= 6 && earthquake.magnitude < 7) ||
        (magnitudeFilter === 'critical' && earthquake.magnitude >= 7);

      return matchesSearch && matchesStatus && matchesMagnitude;
    });
  }, [earthquakes, searchTerm, statusFilter, magnitudeFilter]);

  /**
   * Calcula estadísticas de los eventos sísmicos
   */
  const stats = useMemo(() => {
    const total = earthquakes.length;
    const pending = earthquakes.filter(eq => eq.status === 'pending').length;
    const inReview = earthquakes.filter(eq => eq.status === 'in_review').length;
    const highMagnitude = earthquakes.filter(eq => eq.magnitude >= 6).length;
    
    return { total, pending, inReview, highMagnitude };
  }, [earthquakes]);

  /**
   * Paso 7 del CU: El AS selecciona un evento sísmico
   * Muestra los detalles del evento seleccionado
   */
  const handleEarthquakeClick = (earthquake: Earthquake) => {
    setSelectedEarthquake(earthquake);
    setShowDetails(true);
  };

  /**
   * Paso 8 del CU: El sistema bloquea el evento seleccionado cambiando su estado a "bloqueado en revisión"
   * Inicia el proceso de revisión manual del evento sísmico
   * TODO: Implementar llamada al backend para bloquear el evento
   * Endpoint: POST /api/sismos/:id/bloquear
   * Response: { success: true, evento: {...} }
   */
  const handleStartReview = async () => {
    if (!selectedEarthquake) return;

    // TODO BACKEND: Descomentar cuando el backend esté disponible
    /*
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/sismos/${selectedEarthquake.id}/bloquear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo bloquear el evento');
      }

      const data = await response.json();
      
      // Actualizar el estado local
      setEarthquakes(prev => prev.map(eq => 
        eq.id === selectedEarthquake.id 
          ? { ...eq, status: 'in_review' as 'in_review', reviewedBy: data.evento.reviewedBy }
          : eq
      ));
      
      setShowDetails(false);
      setShowReview(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar la revisión del evento",
        variant: "destructive",
      });
    }
    */

    // Simulación temporal
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { nombre: 'Usuario Actual' };
    
    setEarthquakes(prev => prev.map(eq => 
      eq.id === selectedEarthquake.id 
        ? { ...eq, status: 'in_review' as 'in_review', reviewedBy: user.nombre }
        : eq
    ));
    setShowDetails(false);
    setShowReview(true);
  };

  /**
   * Paso 14-17 del CU: Completar la revisión del evento sísmico
   * Opciones:
   * - Confirmar evento (Paso 16, Flujo A6): Actualiza estado a 'confirmado'
   * - Rechazar evento (Paso 15): Actualiza estado a 'rechazado'
   * - Derivar a experto (Flujo A7): Actualiza estado a 'derivado a experto'
   * - Cancelar (Flujo A8): Vuelve el evento a estado 'pending'
   * 
   * TODO: Implementar llamada al backend
   * Endpoint: POST /api/sismos/:id/completar-revision
   * Body: { accion: 'confirmar'|'rechazar'|'derivar', notas: string, evaluacion: string }
   * Response: { success: true, evento: {...} }
   */
  const handleCompleteReview = async (action: 'accept' | 'cancel' | 'refer', notes: string, assessment: string) => {
    if (!selectedEarthquake) return;

    // Determinar el nuevo estado según la acción
    let newStatus: 'pending' | 'in_review' | 'completed' | 'referred';
    let actionName = '';
    
    if (action === 'accept') {
      // Flujo A6: Confirmar evento
      newStatus = 'completed';
      actionName = 'confirmar';
    } else if (action === 'refer') {
      // Flujo A7: Derivar a experto
      newStatus = 'referred';
      actionName = 'derivar';
    } else {
      // Flujo A8: Cancelar revisión
      newStatus = 'pending';
      actionName = 'cancelar';
    }

    // TODO BACKEND: Descomentar cuando el backend esté disponible
    /*
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const response = await fetch(`http://localhost:3000/api/sismos/${selectedEarthquake.id}/completar-revision`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accion: actionName,
          notas: notes,
          evaluacion: assessment,
          analista_id: user?.id,
          fecha_revision: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Error al completar la revisión');
      }

      const data = await response.json();
      
      // Actualizar estado local con los datos del servidor
      setEarthquakes(prev => prev.map(eq => 
        eq.id === selectedEarthquake.id ? data.evento : eq
      ));

      toast({
        title: "Revisión completada",
        description: `El evento ha sido ${actionName === 'confirmar' ? 'confirmado' : actionName === 'derivar' ? 'derivado a experto' : 'rechazado'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la revisión",
        variant: "destructive",
      });
      return;
    }
    */

    // Simulación temporal
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { nombre: 'Usuario Actual' };

    setEarthquakes(prev => prev.map(eq => 
      eq.id === selectedEarthquake.id 
        ? { 
            ...eq, 
            status: newStatus,
            notes: notes,
            reviewedBy: action === 'cancel' ? undefined : user.nombre
          }
        : eq
    ));

    toast({
      title: "Revisión completada",
      description: `El evento ha sido ${action === 'accept' ? 'confirmado' : action === 'refer' ? 'derivado a experto' : 'rechazado'}`,
    });

    setShowReview(false);
    setSelectedEarthquake(null);
  };

  /**
   * Cierra los modales de detalles y revisión
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
   * Volver al dashboard
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
            Eventos sísmicos pendientes de revisión
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
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in_review">En Revisión</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="referred">Derivado</SelectItem>
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

          {filteredEarthquakes.length === 0 ? (
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
