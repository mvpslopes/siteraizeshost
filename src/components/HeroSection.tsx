import { ChevronDown, Sparkles, TreePine } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section
      className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay com gradiente mais sofisticado */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-primary-900/30"></div>
      
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 left-10 animate-float">
        <Sparkles className="w-8 h-8 text-primary-400 opacity-60" />
      </div>
      <div className="absolute top-32 right-16 animate-float-delayed">
        <TreePine className="w-12 h-12 text-primary-500 opacity-50" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float-slow">
        <Sparkles className="w-6 h-6 text-primary-400 opacity-40" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8 animate-fade-in">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-white/90">Eventos Agropecuários de Excelência</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
          <span className="text-white">
            Conectando o campo
          </span>
          <br />
          <span className="text-white">
            e a tradição através de
          </span>
          <br />
          <span className="text-primary-300">
            grandes eventos
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-neutral-200 max-w-3xl mx-auto leading-relaxed animate-slide-up-delayed">
          Valorizando o agronegócio e celebrando nossa cultura rural com eventos únicos que unem tradição e inovação
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delayed">
          <button
            onClick={() => onNavigate('eventos')}
            className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Conheça nossos próximos eventos
          </button>
          
          <button
            onClick={() => onNavigate('sobre')}
            className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            Nossa História
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => onNavigate('sobre')}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
        >
          <span className="text-sm mb-2">Descubra mais</span>
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
