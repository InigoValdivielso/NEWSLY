import React from 'react';

const Button = ({ children, variant, size = 'md', className = '', ...props }) => {
  // Aquí puedes agregar estilos o clases de Bootstrap si prefieres usarlo
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
    </button>
  );
};

export { Button };
