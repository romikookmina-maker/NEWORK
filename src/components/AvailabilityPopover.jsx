import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function AvailabilityPopover({ professional }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  const generateCalendar = () => {
    const today = new Date();
    const days = [];
    const bookedDates = JSON.parse(localStorage.getItem(`booked_${professional.id}`)) || [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const isBooked = bookedDates.some(booked => new Date(booked).toDateString() === date.toDateString());
      const isAvailable = !isBooked && Math.random() > 0.3; // 70% chance of being available

      days.push({
        date: date,
        day: date.getDate(),
        month: date.getMonth(),
        available: isAvailable,
        booked: isBooked
      });
    }
    return days;
  };

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Por favor selecciona una fecha y hora para continuar.",
        variant: "destructive"
      });
      return;
    }
    navigate(`/book/${professional.id}`, { state: { date: selectedDate.toISOString(), time: selectedTime } });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="flex-1">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Ver Disponibilidad
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass-effect">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4"
        >
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Disponibilidad</h4>
            <p className="text-sm text-muted-foreground">
              Selecciona una fecha y hora para agendar.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2 text-sm">Próximos días:</h3>
            <div className="calendar-grid">
              {generateCalendar().slice(0, 14).map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day !w-8 !h-8 ${
                    day.available ? 'available' : day.booked ? 'booked' : ''
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
              <h3 className="font-semibold mb-2 text-sm">
                Horarios para {selectedDate.toLocaleDateString()}:
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isAvailable = Math.random() > 0.2;
                  return (
                    <button
                      key={time}
                      className={`time-slot !px-1 !py-1 text-xs ${
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
          
          <div className="pt-2">
            <Button
              onClick={handleBookNow}
              disabled={!selectedDate || !selectedTime}
              className="w-full"
            >
              Reservar ahora
            </Button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}