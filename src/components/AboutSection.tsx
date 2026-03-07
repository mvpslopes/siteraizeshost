import { Heart, Award, Users, Leaf } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function AboutSection() {
  const { ref: sectionRef, isInView } = useInView();
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Tradição',
      description: 'Valorizamos e preservamos a cultura rural brasileira',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excelência',
      description: 'Comprometidos com a qualidade em cada evento',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Comunidade',
      description: 'Conectando pessoas e fortalecendo laços',
      color: 'from-primary-600 to-primary-700',
      bgColor: 'bg-primary-100',
      iconBg: 'bg-gradient-to-br from-primary-600 to-primary-700',
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Sustentabilidade',
      description: 'Eventos responsáveis com o meio ambiente',
      color: 'from-primary-400 to-primary-500',
      bgColor: 'bg-primary-100',
      iconBg: 'bg-gradient-to-br from-primary-400 to-primary-500',
    },
  ];

  return (
    <section id="sobre" ref={sectionRef as React.RefObject<HTMLElement>} className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative max-w-7xl">
        {/* Header Section */}
        <div className={`max-w-4xl mb-12 text-left reveal-on-scroll ${isInView ? 'visible' : ''}`}>
          <span className="section-label">Sobre a empresa</span>
          <h2 className="section-title">
            <span className="block section-title-accent">Raízes Eventos</span>
          </h2>
        </div>

        {/* Texto institucional */}
        <div className={`max-w-4xl space-y-6 text-gray-600 text-lg md:text-xl leading-relaxed text-left text-justify reveal-on-scroll reveal-delay-1 ${isInView ? 'visible' : ''}`}>
          <p>
            A Raízes Eventos é uma empresa especializada na criação, planejamento e realização de eventos ligados ao agronegócio e às tradições do campo.
          </p>
          <p>
            Com uma proposta moderna e profissional, atuamos no desenvolvimento de projetos que valorizam a cultura rural, fortalecem o relacionamento entre criadores, empresas e público, e criam ambientes ideais para geração de negócios e visibilidade de marca.
          </p>
          <p>
            Mais do que organizar eventos, a Raízes trabalha para transformar cada projeto em uma experiência bem estruturada, capaz de reunir tradição, organização e estratégia.
          </p>
          <p>
            Nosso compromisso é entregar eventos que contribuam para o crescimento do setor, valorizando o trabalho de haras, criadores, patrocinadores e parceiros.
          </p>
        </div>

        {/* Values Section - mesmo estilo de fundo do rodapé */}
        <div className="mt-16 md:mt-20 rounded-3xl relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-earth-900 p-8 md:p-12">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-y-48 -translate-x-48 pointer-events-none" aria-hidden />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400/10 rounded-full translate-y-40 translate-x-40 pointer-events-none" aria-hidden />
          <div className="relative text-left mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Nossos Valores
            </h3>
          </div>
          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`group bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 motion-reduce:transition-none border border-white/20 text-left reveal-on-scroll ${isInView ? 'visible' : ''}`}
                style={{ transitionDelay: isInView ? `${(index + 2) * 60}ms` : '0ms' }}
              >
                <div className={`flex justify-center mb-6 w-16 h-16 ${value.iconBg} rounded-2xl mx-auto group-hover:scale-110 transition-transform duration-300 motion-reduce:group-hover:scale-100`}>
                  <div className="text-white flex items-center justify-center">{value.icon}</div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed text-justify">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
