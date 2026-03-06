import { Building2, Heart } from 'lucide-react';

export default function PricingSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Para quem são nossos eventos?
          </h2>
          
          {/* Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mt-8">
            <button className="px-6 py-2 rounded-full bg-white text-gray-800 font-medium shadow-sm">
              Mensal
            </button>
            <button className="px-6 py-2 rounded-full text-gray-600 font-medium">
              Anual
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Business Card */}
          <div className="bg-primary-600 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-700/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="text-6xl font-bold mb-4 opacity-20">02</div>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Empresas</h3>
              </div>
              <p className="text-primary-100 mb-6 leading-relaxed">
                Eventos corporativos e feiras agropecuárias para empresas do setor. Ideal para networking, lançamentos e fortalecimento de marca.
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 395</span>
                <span className="text-primary-200">/mês</span>
              </div>
              <button className="w-full bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Contratar Evento
              </button>
            </div>
          </div>

          {/* Charities/Organizations Card */}
          <div className="bg-white border-2 border-gray-200 text-gray-800 p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="text-6xl font-bold mb-4 text-gray-100">03</div>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
                <h3 className="text-2xl font-bold">Organizações</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Eventos para associações, cooperativas e organizações do agronegócio. Foco em comunidade e desenvolvimento regional.
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 275</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Contratar Evento
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

