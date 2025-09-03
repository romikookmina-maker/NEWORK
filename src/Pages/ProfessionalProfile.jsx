import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import ProfileHeader from '@/components/ProfileHeader';
import BookingDialog from '@/components/BookingDialog';
import AboutTab from '@/components/AboutTab';
import ReviewsTab from '@/components/ReviewsTab';
import PortfolioTab from '@/components/PortfolioTab';

export default function ProfessionalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [professional, setProfessional] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  useEffect(() => {
    const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    const foundProfessional = professionals.find(p => p.id === parseInt(id));
    
    if (foundProfessional) {
      setProfessional(foundProfessional);
    } else {
      navigate('/');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    setIsFavorite(favorites.includes(parseInt(id)));

    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const professionalReviews = allReviews.filter(review => review.professionalId === parseInt(id));
    setReviews(professionalReviews);
  }, [id, user.id, navigate]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(favId => favId !== parseInt(id));
      toast({ title: "Eliminado de favoritos", description: `${professional.name} ha sido eliminado de tus favoritos.` });
    } else {
      updatedFavorites = [...favorites, parseInt(id)];
      toast({ title: "Agregado a favoritos", description: `${professional.name} ha sido agregado a tus favoritos.` });
    }
    
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleSendMessage = () => {
    const conversations = JSON.parse(localStorage.getItem(`conversations_${user.id}`) || '[]');
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(user.id) && conv.participants.includes(professional.id)
    );

    if (!existingConversation) {
      const newConversation = {
        id: Date.now(),
        participants: [user.id, professional.id],
        participantNames: [user.name, professional.name],
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0
      };
      conversations.push(newConversation);
      localStorage.setItem(`conversations_${user.id}`, JSON.stringify(conversations));
    }
    navigate('/messages');
  };

  const handleSubmitReview = (newReview) => {
    if (newReview.rating === 0) {
      toast({ title: "Error", description: "Por favor selecciona una calificación", variant: "destructive" });
      return;
    }

    const review = {
      id: Date.now(),
      professionalId: parseInt(id),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString()
    };

    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    allReviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(allReviews));

    const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    const updatedProfessionals = professionals.map(p => {
      if (p.id === parseInt(id)) {
        const professionalReviews = allReviews.filter(r => r.professionalId === parseInt(id));
        const avgRating = professionalReviews.reduce((sum, r) => sum + r.rating, 0) / professionalReviews.length;
        return { ...p, rating: avgRating, reviewCount: professionalReviews.length };
      }
      return p;
    });
    
    localStorage.setItem('professionals', JSON.stringify(updatedProfessionals));
    setProfessional(prev => ({
      ...prev,
      rating: updatedProfessionals.find(p => p.id === parseInt(id)).rating,
      reviewCount: updatedProfessionals.find(p => p.id === parseInt(id)).reviewCount
    }));

    setReviews([review, ...reviews]);

    addNotification({
      title: "Nueva reseña recibida",
      message: `${user.name} ha dejado una reseña de ${newReview.rating} estrellas`,
      type: "review"
    });

    toast({ title: "Reseña enviada", description: "Tu reseña ha sido publicada exitosamente" });
  };
  
  if (!professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header showBackButton />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>{professional.name} - {professional.profession} | Nework</title>
        <meta name="description" content={`Perfil de ${professional.name}, ${professional.profession} en ${professional.location}. ${professional.description}`} />
        <meta property="og:title" content={`${professional.name} - ${professional.profession} | Nework`} />
        <meta property="og:description" content={`Conecta con ${professional.name}, profesional verificado en ${professional.profession}`} />
      </Helmet>

      <Header showBackButton title={professional.name} />

      <div className="container mx-auto px-4 py-8">
        <ProfileHeader
          professional={professional}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onSendMessage={handleSendMessage}
          onBookAppointment={() => navigate(`/book/${professional.id}`)}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="about" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">Acerca de</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas ({reviews.length})</TabsTrigger>
              <TabsTrigger value="portfolio">Portafolio</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <AboutTab professional={professional} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewsTab reviews={reviews} onSubmitReview={handleSubmitReview} />
            </TabsContent>

            <TabsContent value="portfolio" className="mt-6">
              <PortfolioTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}