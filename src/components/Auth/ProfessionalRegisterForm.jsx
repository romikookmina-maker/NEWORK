import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function ProfessionalRegisterForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    location: '',
    experience: '',
    description: '',
    hourlyRate: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <Label htmlFor="name-prof" className="form-label">Nombre Completo</Label>
        <Input
          id="name-prof"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Tu nombre completo"
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="email-prof" className="form-label">Email</Label>
        <Input
          id="email-prof"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="form-input"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="profession" className="form-label">Profesión</Label>
        <Input
          id="profession"
          name="profession"
          type="text"
          value={formData.profession}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Ej: Plomero, Chef, Electricista"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <Label htmlFor="location" className="form-label">Ubicación</Label>
          <Input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Ciudad"
            required
          />
        </div>
        <div className="form-group">
          <Label htmlFor="experience" className="form-label">Años de Experiencia</Label>
          <Input
            id="experience"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={handleInputChange}
            className="form-input"
            placeholder="5"
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <Label htmlFor="hourlyRate" className="form-label">Tarifa por Hora ($)</Label>
        <Input
          id="hourlyRate"
          name="hourlyRate"
          type="number"
          value={formData.hourlyRate}
          onChange={handleInputChange}
          className="form-input"
          placeholder="500"
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="description" className="form-label">Descripción de Servicios</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="form-textarea"
          rows="3"
          placeholder="Describe tus servicios y experiencia..."
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="password-prof" className="form-label">Contraseña</Label>
        <div className="relative">
          <Input
            id="password-prof"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            className="form-input pr-10"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="form-group">
        <Label htmlFor="confirmPassword-prof" className="form-label">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword-prof"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="form-input"
          placeholder="••••••••"
          required
        />
      </div>

      <Button type="submit" className="btn-primary w-full">
        Crear Cuenta Profesional
      </Button>
    </form>
  );
}