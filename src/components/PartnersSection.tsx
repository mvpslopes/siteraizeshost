export default function PartnersSection() {
  const partners = [
    { name: 'Associação Rural', logo: '🏛️' },
    { name: 'AgroTech', logo: '🌾' },
    { name: 'Rural Connect', logo: '🔗' },
    { name: 'Campo Vivo', logo: '🌱' },
    { name: 'AgroEventos', logo: '📅' },
    { name: 'Raízes Brasil', logo: '🇧🇷' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Conectando as Maiores Empresas do Agronegócio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trabalhamos com parceiros que compartilham nossa paixão pelo campo e pela tradição rural
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {partner.logo}
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                  {partner.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

