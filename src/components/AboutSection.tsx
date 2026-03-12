import { Heart, Award, Users, Leaf } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function AboutSection() {
  const { ref: sectionRef, isInView } = useInView();
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Tradição',
      subtitle: 'Respeito às origens do agronegócio',
      description: 'Valorizamos e preservamos a tradição que construiu a história do campo, reconhecendo a importância cultural, econômica e social do setor rural e do mercado equestre.',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excelência',
      subtitle: 'Compromisso com qualidade e organização',
      description: 'Atuamos com alto padrão de planejamento e execução, buscando excelência em cada etapa dos eventos que realizamos.',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Comunidade',
      subtitle: 'Fortalecimento do setor',
      description: 'Promovemos eventos que aproximam criadores, empresas e profissionais do agronegócio, contribuindo para o fortalecimento das relações e do desenvolvimento do setor.',
      color: 'from-primary-600 to-primary-700',
      bgColor: 'bg-primary-100',
      iconBg: 'bg-gradient-to-br from-primary-600 to-primary-700',
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Sustentabilidade',
      subtitle: 'Responsabilidade na realização de eventos',
      description: 'Buscamos conduzir nossas atividades de forma responsável, respeitando o meio ambiente e incentivando práticas conscientes dentro do agronegócio.',
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
            A Raízes Eventos é uma empresa especializada na criação, planejamento e realização de eventos voltados ao agronegócio, com atuação destacada no mercado equestre.
          </p>
          <p>
            Com uma proposta moderna e profissional, desenvolvemos projetos que valorizam a cultura rural e o setor equestre, promovendo a conexão entre criadores, empresas e público, além de criar ambientes propícios para relacionamento, visibilidade de marcas e geração de negócios.
          </p>
          <p>
            Mais do que organizar eventos, a Raízes atua na construção de experiências bem estruturadas, que unem tradição, planejamento e execução estratégica.
          </p>
          <p>
            Nosso compromisso é realizar eventos que contribuam para o fortalecimento do setor, valorizando o trabalho de Haras, criadores, profissionais, patrocinadores e parceiros.
          </p>
        </div>

        {/* Values Section - mesmo estilo de fundo do rodapé */}
        <div className="mt-16 md:mt-20 rounded-3xl relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-earth-900 p-8 md:p-12">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-y-48 -translate-x-48 pointer-events-none" aria-hidden />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400/10 rounded-full translate-y-40 translate-x-40 pointer-events-none" aria-hidden />
          <div className="relative text-left mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Princípios que orientam nossa atuação
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
                
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-sm font-medium text-primary-600 mb-3">
                  {value.subtitle}
                </p>
                <p className="text-gray-600 text-lg leading-relaxed text-left">
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
