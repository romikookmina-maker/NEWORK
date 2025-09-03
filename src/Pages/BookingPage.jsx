import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Header from '@/components/Header';
import { toast } from '@/components/ui/use-toast';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import BookingProfessionalInfo from '@/components/booking/BookingProfessionalInfo';
import BookingStep1 from '@/components/booking/BookingStep1';
import BookingStep2 from '@/components/booking/BookingStep2';
import BookingStep3 from '@/components/booking/BookingStep3';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [professional, setProfessional] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: location.state?.date ? new Date(location.state.date) : null,
    time: location.state?.time || null,
    service: '',
    duration: 1,
    notes: '',
    address: '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    const foundProfessional = professionals.find(p => p.id === parseInt(id));
    
    if (foundProfessional) {
      setProfessional(foundProfessional);
      setBookingDetails(prev => ({ ...prev, service: foundProfessional.profession }));
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleBookingSubmit = async () => {
    if (!bookingDetails.date || !bookingDetails.time) {
      toast({ title: "Error", description: "Por favor selecciona fecha y hora.", variant: "destructive" });
      return;
    }
    if (!bookingDetails.address || !bookingDetails.phone) {
      toast({ title: "Error", description: "Por favor completa todos los campos requeridos.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const appointment = {
      id: Date.now(),
      professionalId: parseInt(id),
      professionalName: professional.name,
      clientId: user.id,
      clientName: user.name,
      date: bookingDetails.date.toISOString(),
      time: bookingDetails.time,
      status: 'pending',
      service: bookingDetails.service,
      duration: bookingDetails.duration,
      notes: bookingDetails.notes,
      address: bookingDetails.address,
      phone: bookingDetails.phone,
      totalCost: professional.hourlyRate * bookingDetails.duration,
      createdAt: new Date().toISOString()
    };

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    addNotification({
      title: "Nueva solicitud de cita",
      message: `${user.name} ha solicitado una cita para el ${bookingDetails.date.toLocaleDateString()} a las ${bookingDetails.time}`,
      type: "appointment"
    });

    toast({
      title: "¡Cita solicitada!",
      description: "Tu solicitud ha sido enviada al profesional. Te notificaremos cuando sea confirmada."
    });

    setLoading(false);
    navigate('/profile');
  };

  if (!professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header showBackButton />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>Agendar Cita con {professional.name} - Nework</title>
        <meta name="description" content={`Agenda una cita con ${professional.name}, ${professional.profession} en ${professional.location}`} />
      </Helmet>

      <Header showBackButton title="Agendar Cita" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BookingProfessionalInfo professional={professional} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-xl p-6"
          >
            <BookingStepIndicator currentStep={step} />

            {step === 1 && (
              <BookingStep1
                bookingDetails={bookingDetails}
                setBookingDetails={setBookingDetails}
                onNextStep={handleNextStep}
                professionalId={professional.id}
              />
            )}
            {step === 2 && (
              <BookingStep2
                bookingDetails={bookingDetails}
                setBookingDetails={setBookingDetails}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
              />
            )}
            {step === 3 && (
              <BookingStep3
                bookingDetails={bookingDetails}
                professional={professional}
                onPrevStep={handlePrevStep}
                onConfirmBooking={handleBookingSubmit}
                loading={loading}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}