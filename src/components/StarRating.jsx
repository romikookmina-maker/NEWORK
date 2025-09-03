import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onRatingChange, readonly = false, size = 'default' }) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hoverRating || rating) >= star;
        return (
          <Star
            key={star}
            className={`star ${sizeClasses[size]} ${
              filled ? 'filled text-yellow-400 fill-current' : 'empty text-gray-300'
            } ${!readonly ? 'cursor-pointer hover:scale-110' : ''} transition-all duration-200`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
}