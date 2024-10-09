import React, { useEffect, useState } from 'react';

function RotationWarning() {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  // Función para verificar la orientación
  const handleResize = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
  };

  // Hook para escuchar cambios en el tamaño de la ventana
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isPortrait && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            paddingTop: '40vh',
            zIndex: 9999,
          }}
        >
          Por favor, gira tu dispositivo para ver esta lista correctamente.
        </div>
      )}
    </>
  );
}

export default RotationWarning;
