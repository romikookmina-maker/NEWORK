import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function CalendarTab() {
  return (
    <div className="space-y-6">
      <h3 className="subsection-title flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        Calendario de Disponibilidad
      </h3>a

      <div className="glass-effect rounded-xl p-6">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Calendario Interactivo
          </h3>
          <p className="text-gray-500 mb-4">
            Gestiona tu disponibilidad y horarios de trabajo.
          </p>
          <Button onClick={() => {
            toast({
              title: "🚧 Esta función no está implementada aún",
              description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
            });
          }}>
            Configurar Horarios
          </Button>
        </div>
      </div>
    </div>
  );
}