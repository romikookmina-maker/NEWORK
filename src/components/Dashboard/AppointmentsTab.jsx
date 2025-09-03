import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function AppointmentsTab() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user) return;
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const professionalAppointments = allAppointments.filter(apt => apt.professionalId === user.id);
    setAppointments(professionalAppointments);
  }, [user]);

  const handleAppointmentAction = (appointmentId, action, reason = '') => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    let targetAppointment = null;
    const updatedAppointments = allAppointments.map(apt => {
      if (apt.id === appointmentId) {
        targetAppointment = { ...apt, status: action, reason: reason };
        return targetAppointment;
      }
      return apt;
    });
    
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments.filter(apt => apt.professionalId === user.id));

    if (targetAppointment && action === 'confirmed') {
        const bookedDates = JSON.parse(localStorage.getItem(`booked_${user.id}`)) || [];
        bookedDates.push(targetAppointment.date);
        localStorage.setItem(`booked_${user.id}`, JSON.stringify(bookedDates));
    }

    // Send notification to client
    addNotification({
      title: action === 'confirmed' ? 'Cita confirmada' : 'Cita rechazada',
      message: `Tu cita con ${user.name} ha sido ${action === 'confirmed' ? 'confirmada' : 'rechazada'}${reason ? `: ${reason}` : ''}`,
      type: 'appointment'
    });

    toast({
      title: action === 'confirmed' ? 'Cita confirmada' : 'Cita rechazada',
      description: `La cita con ${targetAppointment?.clientName} ha sido ${action === 'confirmed' ? 'confirmada' : 'rechazada'}`
    });
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="subsection-title flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        Gestión de Citas
      </h3>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Calendar className="w-16 h-16" />
          </div>
          <h3 className="empty-state-title">No tienes citas programadas</h3>
          <p className="empty-state-description">
            Las solicitudes de cita aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.clientName}`} />
                      <AvatarFallback>{appointment.clientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">{appointment.clientName}</h4>
                      <p className="text-gray-600">{appointment.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1"><Calendar className="h-4 w-4" /><span>{new Date(appointment.date).toLocaleDateString()}</span></span>
                    <span className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{appointment.time}</span></span>
                  </div>
                  {appointment.reason && <p className="text-sm text-gray-600 mt-2 italic">Motivo: {appointment.reason}</p>}
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`status-badge ${appointment.status}`}>{getStatusText(appointment.status)}</span>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleAppointmentAction(appointment.id, 'confirmed')} className="bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle className="h-4 w-4 mr-1" />Aceptar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => {
                        const reason = prompt('Motivo del rechazo (opcional):');
                        handleAppointmentAction(appointment.id, 'cancelled', reason || '');
                      }}>
                        <X className="h-4 w-4 mr-1" />Rechazar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}