import React, { useState } from 'react';
import { User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClientRegisterForm from '@/components/auth/ClientRegisterForm';
import ProfessionalRegisterForm from '@/components/auth/ProfessionalRegisterForm';

export default function RegisterForm({ onSubmit }) {
  const [userType, setUserType] = useState('client');

  const handleFormSubmit = (formData) => {
    onSubmit(formData, userType);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={userType === 'client' ? 'default' : 'outline'}
          onClick={() => setUserType('client')}
          className="flex items-center space-x-2"
        >
          <User className="h-4 w-4" />
          <span>Cliente</span>
        </Button>
        <Button
          type="button"
          variant={userType === 'professional' ? 'default' : 'outline'}
          onClick={() => setUserType('professional')}
          className="flex items-center space-x-2"
        >
          <Briefcase className="h-4 w-4" />
          <span>Profesional</span>
        </Button>
      </div>

      {userType === 'client' ? (
        <ClientRegisterForm onSubmit={handleFormSubmit} />
      ) : (
        <ProfessionalRegisterForm onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}