import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Heart, MessageCircle, Calendar } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';

export default function ProfileHeader({
  professional,
  isFavorite,
  onToggleFavorite,
  onSendMessage,
  onBookAppointment
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="profile-header"
    >
      <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative">
          <Avatar className="h-32 w-32 avatar-ring">
            <AvatarImage src={professional.avatar} alt={professional.name} />
            <AvatarFallback className="text-3xl font-bold">
              {professional.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className={`availability-indicator ${professional.available ? 'available' : 'busy'} absolute -bottom-2 -right-2 w-6 h-6`} />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{professional.name}</h1>
              <p className="text-xl text-blue-600 font-semibold mb-4">{professional.profession}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{professional.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{professional.experience} años de experiencia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StarRating rating={professional.rating} readonly />
                  <span className="font-semibold">{professional.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({professional.reviewCount} reseñas)</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{professional.description}</p>

              <div className="flex items-center space-x-4">
                <span className="price-tag text-lg">
                  ${professional.hourlyRate}/hora
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  professional.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {professional.available ? 'Disponible' : 'Ocupado'}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-3 md:ml-8">
              <Button
                onClick={onToggleFavorite}
                variant="outline"
                className={`favorite-heart ${isFavorite ? 'active text-red-500 border-red-500' : 'inactive'}`}
              >
                <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
              </Button>

              <Button onClick={onSendMessage} className="btn-primary">
                <MessageCircle className="h-5 w-5 mr-2" />
                Enviar Mensaje
              </Button>

              <Button onClick={onBookAppointment} variant="outline" className="btn-outline">
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Cita
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}