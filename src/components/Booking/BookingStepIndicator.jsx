import React from 'react';

export default function BookingStepIndicator({ currentStep }) {
  const steps = ['Fecha y Hora', 'Detalles', 'Confirmar'];

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${currentStep >= stepNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {stepNumber}
                </div>
                <p className={`mt-2 text-xs font-medium ${currentStep >= stepNumber ? 'text-blue-600' : 'text-gray-500'}`}>{label}</p>
              </div>
              {stepNumber < steps.length && (
                <div className={`w-12 sm:w-16 h-1 mx-2 transition-all duration-300 ${currentStep > stepNumber ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}