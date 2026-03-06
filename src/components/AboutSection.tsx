import { Heart, Award, Users, Leaf, TrendingUp, Globe, Star } from 'lucide-react';

export default function AboutSection() {
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

  const stats = [
    { number: '500+', label: 'Eventos Realizados', icon: <TrendingUp className="w-6 h-6" /> },
    { number: '50K+', label: 'Participantes', icon: <Users className="w-6 h-6" /> },
    { number: '15+', label: 'Anos de Experiência', icon: <Star className="w-6 h-6" /> },
    { number: '100+', label: 'Cidades Atendidas', icon: <Globe className="w-6 h-6" /> },
  ];

  return (
    <section id="sobre" className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative max-w-7xl">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-20 text-center">
          <span className="section-label">Sobre nós</span>
          <h2 className="section-title">
            <span className="block">Conectando Tradição</span>
            <span className="block section-title-accent">e Inovação no Campo</span>
          </h2>
          <p className="section-lead">
            Há anos, a <span className="font-semibold text-primary-600">Raízes Eventos</span> tem sido referência na organização de eventos agropecuários,
            feiras, exposições, leilões e cavalgadas. Nossa missão é promover o desenvolvimento do
            agronegócio enquanto celebramos nossas raízes e tradições rurais.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100/80 text-center"
            >
              <div className="flex items-center justify-center w-14 h-14 bg-primary-600 rounded-xl mb-6 mx-auto">
                <div className="text-white">{stat.icon}</div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">{stat.number}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
              Nossos Valores
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100/80 text-center"
              >
                <div className={`flex justify-center mb-6 w-16 h-16 ${value.iconBg} rounded-2xl mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white flex items-center justify-center">{value.icon}</div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
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
