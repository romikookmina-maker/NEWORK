import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

export default function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    profession: user?.profession || '',
    location: user?.location || '',
    experience: user?.experience || 0,
    description: user?.description || '',
    hourlyRate: user?.hourlyRate || 0,
    available: user?.available || true
  });

  const handleProfileUpdate = () => {
    updateUser(profileData);
    
    const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    const updatedProfessionals = professionals.map(p => 
      p.id === user.id ? { ...p, ...profileData } : p
    );
    localStorage.setItem('professionals', JSON.stringify(updatedProfessionals));
    
    setEditProfile(false);
    toast({
      title: "Perfil actualizado",
      description: "Tu información profesional ha sido actualizada exitosamente."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="subsection-title flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Configuración del Perfil
        </h3>
        <Dialog open={editProfile} onOpenChange={setEditProfile}>
          <DialogTrigger asChild>
            <Button><Settings className="h-4 w-4 mr-2" />Editar Perfil</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Editar Perfil Profesional</DialogTitle></DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto p-2">
              {/* Form fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><Label htmlFor="name">Nombre</Label><Input id="name" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} /></div>
                <div className="form-group"><Label htmlFor="profession">Profesión</Label><Input id="profession" value={profileData.profession} onChange={(e) => setProfileData({...profileData, profession: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><Label htmlFor="location">Ubicación</Label><Input id="location" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} /></div>
                <div className="form-group"><Label htmlFor="experience">Años Exp.</Label><Input id="experience" type="number" value={profileData.experience} onChange={(e) => setProfileData({...profileData, experience: parseInt(e.target.value) || 0})} /></div>
              </div>
              <div className="form-group"><Label htmlFor="hourlyRate">Tarifa/Hora</Label><Input id="hourlyRate" type="number" value={profileData.hourlyRate} onChange={(e) => setProfileData({...profileData, hourlyRate: parseInt(e.target.value) || 0})} /></div>
              <div className="form-group"><Label htmlFor="description">Descripción</Label><Textarea id="description" value={profileData.description} onChange={(e) => setProfileData({...profileData, description: e.target.value})} rows={4} /></div>
              <div className="form-group"><Label>Disponibilidad</Label>
                <div className="flex items-center space-x-4">
                  <Button variant={profileData.available ? 'default' : 'outline'} onClick={() => setProfileData({...profileData, available: true})} className="flex-1">Disponible</Button>
                  <Button variant={!profileData.available ? 'default' : 'outline'} onClick={() => setProfileData({...profileData, available: false})} className="flex-1">Ocupado</Button>
                </div>
              </div>
              <div className="flex space-x-3 pt-4"><Button onClick={handleProfileUpdate} className="btn-primary flex-1">Guardar</Button><Button variant="outline" onClick={() => setEditProfile(false)} className="flex-1">Cancelar</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h4 className="font-semibold mb-4">Información Actual</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><Label>Nombre</Label><p>{user?.name}</p></div>
          <div><Label>Profesión</Label><p>{user?.profession}</p></div>
          <div><Label>Ubicación</Label><p>{user?.location}</p></div>
          <div><Label>Experiencia</Label><p>{user?.experience} años</p></div>
          <div><Label>Tarifa/Hora</Label><p>${user?.hourlyRate}</p></div>
          <div><Label>Estado</Label><span className={`status-badge ${user?.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user?.available ? 'Disponible' : 'Ocupado'}</span></div>
          <div className="md:col-span-2"><Label>Descripción</Label><p>{user?.description}</p></div>
        </div>
      </div>
    </div>
  );
}