import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-earth-900 pt-28 pb-24 md:pt-32 md:pb-28 overflow-hidden">
      {/* Elipses no mesmo estilo do rodapé */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-y-48 -translate-x-48 pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400/10 rounded-full translate-y-40 translate-x-40 pointer-events-none" aria-hidden />

      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Coluna de texto (esquerda) */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1] animate-fade-in">
              <span className="block">Eventos que valorizam a tradição</span>
              <span className="block text-primary-100">e fortalecem o agronegócio</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6 max-w-xl animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}>
              A Raízes Eventos nasceu para planejar, organizar e executar eventos que conectam tradição, negócios e experiências marcantes dentro do universo do agro.
            </p>

            <p className="text-base md:text-lg text-white/80 font-medium mb-8 max-w-xl animate-slide-up" style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}>
              Conheça nossos projetos e descubra como podemos construir grandes eventos juntos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.35s', animationFillMode: 'backwards' }}>
              <button
                onClick={() => onNavigate('sobre')}
                className="group bg-white text-primary-700 hover:bg-primary-50 hover:text-primary-800 px-8 py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 motion-reduce:transition-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] motion-reduce:active:scale-100"
              >
                Conheça a empresa
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform motion-reduce:group-hover:translate-x-0" />
              </button>

              <button
                onClick={() => onNavigate('contato')}
                className="group border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 motion-reduce:transition-none flex items-center justify-center active:scale-[0.98] motion-reduce:active:scale-100"
              >
                Seja parceiro
              </button>
            </div>
          </div>

          {/* Coluna visual (direita) - apenas a imagem */}
          <div className="relative animate-fade-in-delayed">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30 transition-all duration-300 motion-reduce:transition-none hover:shadow-xl hover:-translate-y-1">
              <div
                className="h-64 sm:h-80 md:h-96 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url(/silhueta-de-garanhao-pastando-em-pastagem-de-montanha-gerada-por-ia.jpg)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
