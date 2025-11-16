import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, FileText, LogOut } from 'lucide-react';

/**
 * Página principal del dashboard
 * Muestra el menú principal del Analista Sísmico (AS)
 * Paso 5 del CU: El AS selecciona la opción "Registrar resultado de revisión manual"
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // Si no hay usuario autenticado, redirigir al login
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserName(user.nombre || user.email);
    } catch (error) {
      console.error('Error al parsear datos del usuario:', error);
      navigate('/login');
    }
  }, [navigate]);

  /**
   * Maneja el cierre de sesión del usuario
   * TODO: Implementar invalidación de token en backend
   * Endpoint: POST /api/auth/logout
   */
  const handleLogout = () => {
    // TODO BACKEND: Descomentar cuando el backend esté disponible
    /*
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    });
    */

    // Simulación temporal
    localStorage.removeItem('user');
    navigate('/login');
  };

  /**
   * Navega a la pantalla de registro de revisión manual
   * Este es el punto de entrada principal para el caso de uso
   */
  const handleStartReview = () => {
    navigate('/sismos');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header con información del usuario */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
              Sistema de Monitoreo Sísmico
            </h1>
            <p className="text-xl text-muted-foreground">
              Bienvenido, {userName}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Menú principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Opción principal del caso de uso */}
          <Card className="shadow-elegant hover:shadow-glow transition-shadow cursor-pointer group" onClick={handleStartReview}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl mt-4">
                Registrar Resultado de Revisión Manual
              </CardTitle>
              <CardDescription className="text-base">
                Revisar y validar eventos sísmicos detectados automáticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Acceda a la lista de eventos sísmicos pendientes de revisión para confirmar, 
                rechazar o derivar a expertos.
              </p>
              <Button className="w-full">
                Iniciar Revisión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
