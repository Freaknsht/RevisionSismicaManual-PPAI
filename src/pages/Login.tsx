import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Página de inicio de sesión
 * Permite al Analista Sísmico (AS) autenticarse en el sistema
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Maneja el proceso de autenticación
   * TODO: Implementar llamada al backend Node.js
   * Endpoint: POST /api/auth/login
   * Body: { email, password }
   * Response: { token, user: { id, nombre, rol } }
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de inicio de sesión (reemplazar con llamada real al backend)
    setTimeout(() => {
      // TODO BACKEND: Descomentar y ajustar cuando el backend esté disponible
      /*
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
          throw new Error('Credenciales inválidas');
        }
        
        const data = await response.json();
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${data.user.nombre}`,
        });
        
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: "Error de autenticación",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
      */

      // Simulación temporal - eliminar cuando se implemente backend
      if (email && password) {
        localStorage.setItem('user', JSON.stringify({ 
          id: '1', 
          nombre: 'Analista Sísmico',
          email: email 
        }));
        
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema",
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: "Por favor complete todos los campos",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Sistema de Monitoreo Sísmico
          </CardTitle>
          <CardDescription className="text-base">
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="analista@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
