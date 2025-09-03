import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
export default function LoginPage() {
  const {
    login
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const handleSubmit = (formData, userType) => {
    // Simulate user creation/login
    const userData = {
      id: Date.now(),
      name: formData.name || 'Usuario Demo',
      email: formData.email,
      type: userType,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'demo'}`,
      ...(userType === 'professional' && {
        profession: formData.profession,
        location: formData.location,
        experience: parseInt(formData.experience) || 0,
        description: formData.description,
        hourlyRate: parseInt(formData.hourlyRate) || 0,
        rating: 4.5,
        reviewCount: 0,
        available: true,
        certifications: []
      })
    };

    // Initialize sample data if first time
    if (!localStorage.getItem('professionals')) {
      initializeSampleData();
    }

    // Add professional to professionals list if registering as professional
    if (!isLogin && userType === 'professional') {
      const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
      professionals.push(userData);
      localStorage.setItem('professionals', JSON.stringify(professionals));
    }
    login(userData);
    toast({
      title: isLogin ? "¡Bienvenido!" : "¡Cuenta creada!",
      description: isLogin ? "Has iniciado sesión correctamente" : "Tu cuenta ha sido creada exitosamente"
    });
  };
  const initializeSampleData = () => {
    const sampleProfessionals = [{
      id: 1,
      name: "Carlos Rodríguez",
      profession: "Plomero",
      location: "Ciudad de México",
      experience: 8,
      description: "Especialista en instalaciones y reparaciones de plomería residencial y comercial. Servicio 24/7 para emergencias.",
      hourlyRate: 350,
      rating: 4.8,
      reviewCount: 127,
      available: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      certifications: ["Certificado en Plomería", "Instalaciones de Gas"]
    }, {
      id: 2,
      name: "María González",
      profession: "Chef Personal",
      location: "Guadalajara",
      experience: 12,
      description: "Chef profesional especializada en cocina internacional y dietas especiales. Eventos y clases de cocina.",
      hourlyRate: 800,
      rating: 4.9,
      reviewCount: 89,
      available: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      certifications: ["Chef Profesional", "Nutrición Deportiva", "Cocina Vegana"]
    }, {
      id: 3,
      name: "Luis Martínez",
      profession: "Electricista",
      location: "Monterrey",
      experience: 15,
      description: "Electricista certificado con amplia experiencia en instalaciones residenciales, comerciales e industriales.",
      hourlyRate: 400,
      rating: 4.7,
      reviewCount: 203,
      available: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luis",
      certifications: ["Electricista Certificado", "Instalaciones Industriales"]
    }, {
      id: 4,
      name: "Ana Herrera",
      profession: "Diseñadora de Interiores",
      location: "Puebla",
      experience: 6,
      description: "Diseñadora creativa especializada en espacios modernos y funcionales. Consultoría y remodelación completa.",
      hourlyRate: 600,
      rating: 4.6,
      reviewCount: 45,
      available: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      certifications: ["Diseño de Interiores", "AutoCAD"]
    }, {
      id: 5,
      name: "Roberto Silva",
      profession: "Jardinero",
      location: "Tijuana",
      experience: 10,
      description: "Especialista en diseño y mantenimiento de jardines. Poda, fumigación y sistemas de riego automatizado.",
      hourlyRate: 250,
      rating: 4.5,
      reviewCount: 78,
      available: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=roberto",
      certifications: ["Jardinería Profesional", "Sistemas de Riego"]
    }, {
      id: 6,
      name: "Patricia López",
      profession: "Masajista Terapéutica",
      location: "Cancún",
      experience: 7,
      description: "Masajista certificada en técnicas de relajación y terapia física. Atención a domicilio y en consultorio.",
      hourlyRate: 450,
      rating: 4.9,
      reviewCount: 156,
      available: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=patricia",
      certifications: ["Masaje Terapéutico", "Reflexología"]
    }];
    localStorage.setItem('professionals', JSON.stringify(sampleProfessionals));
  };
  return <div className="min-h-screen hero-section hero-pattern">
      <Helmet>
        <title>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'} - Nework</title>
        <meta name="description" content={isLogin ? 'Inicia sesión en Nework para conectar con profesionales de confianza' : 'Crea tu cuenta en Nework y encuentra los mejores profesionales'} />
        <meta property="og:title" content={`${isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'} - Nework`} />
        <meta property="og:description" content={isLogin ? 'Accede a tu cuenta para conectar con profesionales verificados' : 'Únete a Nework y descubre profesionales de calidad'} />
      </Helmet>
      
      <div className="floating-elements" />
      
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-3xl">N</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text">Nework</h1>
              <p className="text-gray-600 mt-2">
                {isLogin ? 'Bienvenido de vuelta' : 'Únete a nuestra comunidad'}
              </p>
            </div>

            <Tabs value={isLogin ? 'login' : 'register'} onValueChange={value => setIsLogin(value === 'login')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm onSubmit={handleSubmit} />
              </TabsContent>

              <TabsContent value="register">
                <RegisterForm onSubmit={handleSubmit} />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>;
}