import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-white via-primary-50/20 to-gray-50/50 pt-28 pb-24 md:pt-32 md:pb-28 overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary-100/80 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-primary-100/70 blur-3xl opacity-40" />

      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Coluna de texto (esquerda) */}
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                Eventos agro com DNA Raízes
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              <span className="block">Revolucionando o</span>
              <span className="block text-primary-600">agronegócio brasileiro</span>
              <span className="block">com grandes eventos</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl">
              Conectamos produtores, investidores e apaixonados pelo campo em experiências
              únicas, que geram relacionamento, negócios e fortalecem a cultura rural.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => onNavigate('eventos')}
                className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Explorar próximos eventos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('sobre')}
                className="group bg-white/80 backdrop-blur border border-primary-100 hover:bg-white text-primary-900 px-8 py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                Conheça a Raízes
              </button>
            </div>

            {/* Mini prova social abaixo do texto */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 border-2 border-white shadow-md"
                  />
                ))}
              </div>
              <p>
                <span className="font-semibold text-gray-900">Mais de 50 mil pessoas</span>{' '}
                já participaram de eventos organizados pela Raízes.
              </p>
            </div>
          </div>

          {/* Coluna visual (direita) */}
          <div className="relative">
            <div className="relative rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
              {/* Imagem principal */}
              <div
                className="h-64 sm:h-80 md:h-96 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url(/silhueta-de-garanhao-pastando-em-pastagem-de-montanha-gerada-por-ia.jpg)',
                }}
              />

              {/* Barra de infos na base da imagem */}
              <div className="px-6 py-4 bg-white/95 backdrop-blur border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Eventos realizados
                    </p>
                    <p className="text-xl font-bold text-gray-900">500+</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Cidades atendidas
                    </p>
                    <p className="text-xl font-bold text-gray-900">100+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cartão flutuante de destaque */}
            <div className="absolute -bottom-8 -left-4 bg-white rounded-2xl shadow-lg border border-primary-100 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold">
                15+
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold">
                  Anos de atuação
                </p>
                <p className="text-sm text-gray-700">
                  Experiência em feiras, leilões, exposições e cavalgadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
