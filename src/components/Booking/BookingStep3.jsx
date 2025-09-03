import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingStep3({ bookingDetails, professional, onPrevStep, onConfirmBooking, loading }) {
  const { date, time, service, duration, address, phone } = bookingDetails;
  const totalCost = professional.hourlyRate * duration;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-6">3. Confirmar Reserva</h2>
      <div className="glass-effect rounded-lg p-6 bg-gray-50">
        <h3 className="font-semibold mb-4">Resumen de la Cita</h3>
        <div className="space-y-3">
          <div className="flex justify-between"><span className="text-gray-600">Profesional:</span><span className="font-medium">{professional.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Servicio:</span><span className="font-medium">{service}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Fecha:</span><span className="font-medium">{date?.toLocaleDateString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Hora:</span><span className="font-medium">{time}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Duración:</span><span className="font-medium">{duration} hora{duration > 1 ? 's' : ''}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Dirección:</span><span className="font-medium">{address}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Teléfono:</span><span className="font-medium">{phone}</span></div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Estimado:</span>
              <span className="text-blue-600">${totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="glass-effect rounded-lg p-6 bg-blue-50">
        <div className="flex items-center space-x-3 mb-3">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Información de Pago</h3>
        </div>
        <p className="text-blue-800 text-sm">El pago se realizará directamente con el profesional. Esta reserva solo confirma tu cita.</p>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>Volver</Button>
        <Button onClick={onConfirmBooking} disabled={loading} className="btn-primary">
          {loading ? (<><div className="loading-spinner w-4 h-4 mr-2" />Procesando...</>) : 'Confirmar Reserva'}
        </Button>
      </div>
    </div>
  );
}