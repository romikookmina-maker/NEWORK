import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function BookingDialog({
  open,
  onOpenChange,
  professional,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onConfirm
}) {
  const generateCalendar = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isAvailable = Math.random() > 0.3;
      const isBooked = !isAvailable && Math.random() > 0.5;
      days.push({ date, day: date.getDate(), month: date.getMonth(), available: isAvailable, booked: isBooked });
    }
    return days;
  };

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agendar Cita con {professional.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Selecciona una fecha:</h3>
            <div className="calendar-grid">
              {generateCalendar().slice(0, 21).map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    day.available ? 'available' : day.booked ? 'booked' : 'unavailable'
                  } ${selectedDate?.getDate() === day.day && selectedDate?.getMonth() === day.month ? 'selected' : ''}`}
                  onClick={() => day.available && setSelectedDate(day.date)}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div>
              <h3 className="font-semibold mb-3">
                Horarios disponibles para {selectedDate.toLocaleDateString()}:
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => {
                  const isAvailable = Math.random() > 0.3;
                  return (
                    <button
                      key={time}
                      className={`time-slot ${
                        selectedTime === time ? 'selected' : isAvailable ? '' : 'unavailable'
                      }`}
                      onClick={() => isAvailable && setSelectedTime(time)}
                      disabled={!isAvailable}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={onConfirm} className="btn-primary flex-1">
              Confirmar Cita
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}