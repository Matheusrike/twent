import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-16 h-16">
        {/* Spinner externo */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 border-r-red-500 animate-spin"></div>
        
        {/* Spinner interno girando ao contrário */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-red-600 border-l-red-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        
        {/* Ponto central pulsante */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

