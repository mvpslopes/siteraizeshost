interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** Usa a versão branca do logo (ex.: no rodapé) */
  white?: boolean;
  /** Alinhamento do logo dentro do container */
  align?: 'left' | 'center';
}

export default function Logo({ size = 'md', className = '', white = false, align = 'center' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`${className} flex items-center ${align === 'left' ? 'justify-start' : 'justify-center'}`}>
      <img
        src={white ? '/logo-branco.png' : '/logo.png'}
        alt="Raízes Eventos"
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
}
