interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
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
