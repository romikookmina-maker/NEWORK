import React from 'react';
import { Button } from '@/components/ui/button';

export default function BookingStep1({ bookingDetails, setBookingDetails, onNextStep, professionalId }) {
  const { date: selectedDate, time: selectedTime } = bookingDetails;
  
  const generateCalendar = () => {
    const today = new Date();
    const days = [];
    const bookedDates = JSON.parse(localStorage.getItem(`booked_${professionalId}`)) || [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isBooked = bookedDates.some(booked => new Date(booked).toDateString() === date.toDateString());
      const isAvailable = !isBooked && Math.random() > 0.3;
      days.push({ date, day: date.getDate(), month: date.getMonth(), available: isAvailable, booked: isBooked });
    }
    return days;
  };

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-6">1. Selecciona Fecha y Hora</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-4">Fecha disponible:</h3>
          <div className="calendar-grid">
            {generateCalendar().slice(0, 21).map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day.available ? 'available' : day.booked ? 'booked' : 'unavailable'} ${selectedDate?.toDateString() === day.date.toDateString() ? 'selected' : ''}`}
                onClick={() => day.available && setBookingDetails(prev => ({...prev, date: day.date}))}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">{selectedDate ? `Horarios para ${selectedDate.toLocaleDateString()}:` : 'Selecciona una fecha primero'}</h3>
          {selectedDate && (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => {
                const isAvailable = Math.random() > 0.3;
                return (
                  <button
                    key={time}
                    className={`time-slot ${selectedTime === time ? 'selected' : isAvailable ? '' : 'unavailable'}`}
                    onClick={() => isAvailable && setBookingDetails(prev => ({...prev, time: time}))}
                    disabled={!isAvailable}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onNextStep} disabled={!selectedDate || !selectedTime} className="btn-primary">
          Continuar
        </Button>
      </div>
    </div>
  );
}