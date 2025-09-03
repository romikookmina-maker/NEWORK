import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/StarRating';

export default function ReviewDialog({
  open,
  onOpenChange,
  professional,
  newReview,
  setNewReview,
  onSubmit
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escribir Reseña para {professional.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="form-label">Calificación</label>
            <div className="star-rating-input">
              <StarRating
                rating={newReview.rating}
                onRatingChange={(rating) => setNewReview({...newReview, rating})}
                size="large"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Comentario</label>
            <Textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              placeholder="Comparte tu experiencia con este profesional..."
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="flex space-x-3">
            <Button onClick={onSubmit} className="btn-primary flex-1">
              Enviar Reseña
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                onOpenChange(false);
                setNewReview({ rating: 0, comment: '' });
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}