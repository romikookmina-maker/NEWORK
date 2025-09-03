import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Clock, Star, MessageCircle, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';
import { toast } from '@/components/ui/use-toast';
import AvailabilityPopover from '@/components/AvailabilityPopover';

export default function ProfessionalCard({ professional, index = 0 }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    setIsFavorite(favorites.includes(professional.id));
  }, [professional.id, user.id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(id => id !== professional.id);
      toast({
        title: "Eliminado de favoritos",
        description: `${professional.name} ha sido eliminado de tus favoritos.`
      });
    } else {
      updatedFavorites = [...favorites, professional.id];
      toast({
        title: "Agregado a favoritos",
        description: `${professional.name} ha sido agregado a tus favoritos.`
      });
    }
    
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="service-card group"
    >
      <Link to={`/professional/${professional.id}`} className="block">
        <div className="relative">
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative">
              <Avatar className="h-16 w-16 avatar-ring">
                <AvatarImage src={professional.avatar} alt={professional.name} />
                <AvatarFallback className="text-lg font-semibold">
                  {professional.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className={`availability-indicator ${professional.available ? 'available' : 'busy'} absolute -bottom-1 -right-1`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {professional.name}
                  </h3>
                  <p className="text-blue-600 font-medium">{professional.profession}</p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className={`favorite-heart ${isFavorite ? 'active' : 'inactive'} hover:bg-red-50`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{professional.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{professional.experience} años exp.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600 text-sm line-clamp-2">
              {professional.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StarRating rating={professional.rating} readonly size="small" />
                <span className="text-sm font-medium text-gray-700">
                  {professional.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({professional.reviewCount} reseñas)
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="price-tag">
                  ${professional.hourlyRate}/hora
                </span>
              </div>
            </div>

            {professional.certifications && professional.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {professional.certifications.slice(0, 2).map((cert, idx) => (
                  <span key={idx} className="certification-badge">
                    {cert}
                  </span>
                ))}
                {professional.certifications.length > 2 && (
                  <span className="text-sm text-gray-500">
                    +{professional.certifications.length - 2} más
                  </span>
                )}
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <div onClick={(e) => e.preventDefault()} className="flex-1">
                 <AvailabilityPopover professional={professional} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendMessage}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}