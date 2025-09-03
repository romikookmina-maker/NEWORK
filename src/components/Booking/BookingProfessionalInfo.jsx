import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function BookingProfessionalInfo({ professional }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6 mb-8"
    >
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={professional.avatar} alt={professional.name} />
          <AvatarFallback className="text-lg font-semibold">
            {professional.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{professional.name}</h1>
          <p className="text-blue-600 font-semibold">{professional.profession}</p>
          <div className="flex items-center space-x-4 mt-2 text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{professional.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{professional.rating.toFixed(1)} ({professional.reviewCount} reseñas)</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="price-tag text-lg mb-2">
            ${professional.hourlyRate}/hora
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${professional.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {professional.available ? 'Disponible' : 'Ocupado'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}