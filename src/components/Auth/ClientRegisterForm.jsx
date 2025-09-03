import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function ClientRegisterForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
        <Label htmlFor="name-client" className="form-label">Nombre Completo</Label>
        <Input
          id="name-client"
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
        <Label htmlFor="email-client" className="form-label">Email</Label>
        <Input
          id="email-client"
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
        <Label htmlFor="password-client" className="form-label">Contraseña</Label>
        <div className="relative">
          <Input
            id="password-client"
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
        <Label htmlFor="confirmPassword-client" className="form-label">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword-client"
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
        Crear Cuenta de Cliente
      </Button>
    </form>
  );
}