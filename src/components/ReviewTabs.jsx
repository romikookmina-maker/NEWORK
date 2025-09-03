import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import StarRating from '@/components/StarRating';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewsTab({ reviews, onSubmitReview }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview(newReview);
    setNewReview({ rating: 0, comment: '' });
    setShowReviewForm(false);
  };

  const handleClear = () => {
    setNewReview({ rating: 0, comment: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="subsection-title">Reseñas de Clientes</h3>
        <Button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-primary">
          <Star className="h-4 w-4 mr-2" />
          {showReviewForm ? 'Cancelar' : 'Escribir Reseña'}
        </Button>
      </div>

      <AnimatePresence>
        {showReviewForm && (
          <motion.form
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="review-form overflow-hidden"
          >
            <div className="space-y-4">
              <div>
                <label className="form-label">Tu Calificación</label>
                <div className="star-rating-input">
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                    size="large"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Tu Comentario</label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Comparte tu experiencia con este profesional..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
              <div className="flex space-x-3 justify-end">
                <Button type="button" variant="ghost" onClick={handleClear}>
                  Borrar
                </Button>
                <Button type="submit" className="btn-primary">
                  Enviar
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Star className="w-16 h-16" />
          </div>
          <h3 className="empty-state-title">Sin reseñas aún</h3>
          <p className="empty-state-description">
            Sé el primero en dejar una reseña para este profesional.
          </p>
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
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
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