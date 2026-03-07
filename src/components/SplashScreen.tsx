import Logo from './Logo';

interface SplashScreenProps {
  /** Texto abaixo do logo, ex: "Carregando...", "Entrando...", "Saindo..." */
  subtitle?: string;
}

export default function SplashScreen({ subtitle = 'Carregando...' }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-earth-900">
      {/* Elipses no mesmo estilo do rodapé */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-y-48 -translate-x-48 pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400/10 rounded-full translate-y-40 translate-x-40 pointer-events-none" aria-hidden />

      <div className="relative flex flex-col items-center justify-center gap-8">
        <Logo size="xl" white align="center" />
        <p className="text-white text-lg font-medium tracking-wide">{subtitle}</p>
        <div
          className="h-10 w-10 rounded-full border-4 border-white/30 border-t-white animate-spin"
          aria-hidden
        />
      </div>
    </div>
  );
}
