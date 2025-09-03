import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function BookingStep2({ bookingDetails, setBookingDetails, onNextStep, onPrevStep }) {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setBookingDetails(prev => ({...prev, [id]: value}));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-6">2. Detalles del Servicio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <Label htmlFor="service">Tipo de Servicio</Label>
          <Input id="service" value={bookingDetails.service} onChange={handleInputChange} placeholder="Describe el servicio" />
        </div>
        <div className="form-group">
          <Label htmlFor="duration">Duración (horas)</Label>
          <select id="duration" value={bookingDetails.duration} onChange={(e) => setBookingDetails(prev => ({ ...prev, duration: parseInt(e.target.value)}))} className="form-input">
            {[1, 2, 3, 4, 6, 8].map(h => <option key={h} value={h}>{h} hora{h>1?'s':''}</option>)}
          </select>
        </div>
        <div className="form-group">
          <Label htmlFor="address">Dirección del Servicio *</Label>
          <Input id="address" value={bookingDetails.address} onChange={handleInputChange} placeholder="Dirección completa" required />
        </div>
        <div className="form-group">
          <Label htmlFor="phone">Teléfono de Contacto *</Label>
          <Input id="phone" value={bookingDetails.phone} onChange={handleInputChange} placeholder="Número de teléfono" required />
        </div>
      </div>
      <div className="form-group">
        <Label htmlFor="notes">Notas Adicionales</Label>
        <Textarea id="notes" value={bookingDetails.notes} onChange={handleInputChange} rows={4} placeholder="Instrucciones especiales, etc." />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>Volver</Button>
        <Button onClick={onNextStep} className="btn-primary">Continuar</Button>
      </div>
    </div>
  );
}