import React from 'react';
import { Camera } from 'lucide-react';

export default function PortfolioTab() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Camera className="w-16 h-16" />
      </div>
      <h3 className="empty-state-title">Portafolio no disponible</h3>
      <p className="empty-state-description">
        Este profesional aún no ha subido trabajos a su portafolio
      </p>
    </div>
  );
}