import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <Label htmlFor="email-login" className="form-label">Email</Label>
        <Input
          id="email-login"
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
        <Label htmlFor="password-login" className="form-label">Contraseña</Label>
        <div className="relative">
          <Input
            id="password-login"
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

      <Button type="submit" className="btn-primary w-full">
        Iniciar Sesión
      </Button>
    </form>
  );
}