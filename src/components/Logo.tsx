interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
    xl: 'w-44 h-44'
  };


  return (
    <div className={`${className} flex items-center justify-center`}>
      {/* Logo da imagem */}
      <img 
        src="/logo.png" 
        alt="Raízes Eventos" 
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
}
