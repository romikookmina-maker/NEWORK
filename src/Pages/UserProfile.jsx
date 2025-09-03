import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { User, Heart, Calendar, Settings, Camera, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const favoriteIds = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    const favoriteProfessionals = professionals.filter(p => favoriteIds.includes(p.id));
    setFavorites(favoriteProfessionals);

    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const userAppointments = allAppointments.filter(apt => apt.clientId === user.id);
    setAppointments(userAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, [user.id]);

  const handleProfileUpdate = () => {
    updateUser(profileData);
    setEditProfile(false);
    toast({
      title: "Perfil actualizado",
      description: "Tu información ha sido actualizada exitosamente"
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result });
        toast({
          title: "Foto de perfil actualizada",
          description: "Tu nueva foto de perfil ha sido guardada."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return 'Desconocido';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>Mi Perfil - Nework</title>
        <meta name="description" content="Gestiona tu perfil, favoritos y citas en Nework" />
        <meta property="og:title" content="Mi Perfil - Nework" />
        <meta property="og:description" content="Administra tu cuenta y preferencias en Nework" />
      </Helmet>

      <Header title="Mi Perfil" />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-header"
        >
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <Avatar className="h-32 w-32 avatar-ring">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-3xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                onClick={handleAvatarClick}
                className="absolute -bottom-2 -right-2 rounded-full bg-blue-500 hover:bg-blue-600"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                {user?.type === 'professional' ? 'Profesional' : 'Cliente'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="appointments" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appointments"><Calendar className="w-4 h-4 mr-2" />Mis Citas ({appointments.length})</TabsTrigger>
              <TabsTrigger value="favorites"><Heart className="w-4 h-4 mr-2" />Favoritos ({favorites.length})</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" />Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="mt-6">
                {appointments.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon"><Calendar className="w-16 h-16" /></div>
                    <h3 className="empty-state-title">No tienes citas programadas</h3>
                    <p className="empty-state-description">Explora profesionales y agenda tu primera cita</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{appointment.professionalName}</h4>
                            <p className="text-gray-600">{appointment.service}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`status-badge ${appointment.status}`}>
                              {getStatusText(appointment.status)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              Solicitada: {new Date(appointment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
                {favorites.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon"><Heart className="w-16 h-16" /></div>
                    <h3 className="empty-state-title">No tienes favoritos aún</h3>
                    <p className="empty-state-description">Marca profesionales como favoritos para encontrarlos fácilmente</p>
                  </div>
                ) : (
                  <div className="professional-grid">
                    {favorites.map((professional, index) => (
                      <ProfessionalCard
                        key={professional.id}
                        professional={professional}
                        index={index}
                      />
                    ))}
                  </div>
                )}
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="subsection-title">Editar Información</h3>
                   <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }} className="space-y-4">
                    <div className="form-group">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input id="name" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                    </div>
                     <div className="form-group">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                    </div>
                     <div className="form-group">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input id="location" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} />
                    </div>
                    <Button type="submit" className="w-full">Guardar Cambios</Button>
                  </form>
                </div>
                
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="subsection-title text-red-600">Zona de Peligro</h3>
                  <div className="flex items-center justify-between">
                     <p className="text-gray-600">Cerrar sesión en este dispositivo.</p>
                     <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}