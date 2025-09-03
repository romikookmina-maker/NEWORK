import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';
import { toast } from '@/components/ui/use-toast';

export default function ReviewsTab() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) return;
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const professionalReviews = allReviews.filter(review => review.professionalId === user.id);
    setReviews(professionalReviews);
  }, [user]);

  return (
    <div className="space-y-6">
      <h3 className="subsection-title flex items-center">
        <Star className="h-5 w-5 mr-2" />
        Reseñas de Clientes
      </h3>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Star className="w-16 h-16" /></div>
          <h3 className="empty-state-title">Sin reseñas aún</h3>
          <p className="empty-state-description">Las reseñas de tus clientes aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.userAvatar} alt={review.userName} />
                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{review.userName}</h4>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} readonly size="small" />
                        <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className="text-gray-700 mb-3">{review.comment}</p>}
                  <Button size="sm" variant="outline" onClick={() => {
                    toast({
                      title: "🚧 Esta función no está implementada aún",
                      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
                    });
                  }}>
                    Responder
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}