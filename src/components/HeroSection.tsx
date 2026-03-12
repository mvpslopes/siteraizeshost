import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HERO_IMAGE = '/hero.png';

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex flex-col overflow-hidden">
      {/* Foto em fundo full-width ocupando toda a extensão abaixo do header */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        aria-hidden
      />
      {/* Overlay escuro para legibilidade do texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-primary-900/90" aria-hidden />

      <div className="relative flex-1 flex items-end pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4 max-w-7xl w-full">
          <div className="max-w-2xl text-white">
            <div
              className="space-y-5 mb-10 animate-slide-up"
              style={{ animationDelay: '0.05s', animationFillMode: 'backwards' }}
            >
              <p className="text-2xl md:text-3xl leading-snug font-garet">
                Do campo nasceu
                <br />
                <span className="font-extrabold">nossa história.</span>
              </p>
              <p className="text-2xl md:text-3xl leading-snug font-garet">
                A essência do agro
                <br />
                <span className="font-extrabold">em cada evento.</span>
              </p>
              <p className="text-2xl md:text-3xl leading-snug font-garet">
                Cultivando emoção e
                <br />
                <span className="font-extrabold">construindo memórias.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}>
              <button
                onClick={() => onNavigate('sobre')}
                className="group bg-white text-primary-700 hover:bg-primary-50 hover:text-primary-800 px-8 py-4 rounded-xl text-base md:text-lg font-semibold font-garet transition-all duration-300 motion-reduce:transition-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] motion-reduce:active:scale-100"
              >
                Conheça a empresa
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform motion-reduce:group-hover:translate-x-0" />
              </button>

              <button
                onClick={() => onNavigate('contato')}
                className="group border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 rounded-xl text-base md:text-lg font-semibold font-garet transition-all duration-300 motion-reduce:transition-none flex items-center justify-center active:scale-[0.98] motion-reduce:active:scale-100"
              >
                Seja parceiro
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
