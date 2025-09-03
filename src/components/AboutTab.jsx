import React from 'react';
import { Award, CheckCircle } from 'lucide-react';

export default function AboutTab({ professional }) {
  return (
    <div className="space-y-6">
      {/* Services */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="subsection-title">Servicios Ofrecidos</h3>
        <div className="professional-services">
          <div className="service-item">
            <span>{professional.profession} General</span>
            <span className="price-tag">${professional.hourlyRate}/hora</span>
          </div>
          <div className="service-item">
            <span>Consultoría Especializada</span>
            <span className="price-tag">${Math.round(professional.hourlyRate * 1.5)}/hora</span>
          </div>
          <div className="service-item">
            <span>Servicio de Emergencia</span>
            <span className="price-tag">${Math.round(professional.hourlyRate * 2)}/hora</span>
          </div>
        </div>
      </div>

      {/* Certifications */}
      {professional.certifications && professional.certifications.length > 0 && (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="subsection-title flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Certificaciones
          </h3>
          <div className="flex flex-wrap gap-3">
            {professional.certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-2 certification-badge">
                <CheckCircle className="h-4 w-4" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="subsection-title">Experiencia Profesional</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <h4 className="font-semibold">{professional.profession} Senior</h4>
              <p className="text-gray-600">Empresa Independiente • {professional.experience} años</p>
              <p className="text-sm text-gray-500 mt-1">
                Especializado en servicios de alta calidad con enfoque en satisfacción del cliente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}