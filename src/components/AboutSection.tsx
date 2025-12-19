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
    <section id="sobre" className="py-24 bg-gradient-to-br from-gray-50 via-white to-primary-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-100/20 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary-100/20 to-transparent rounded-full translate-y-40 -translate-x-40"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            Sobre a Raízes Eventos
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            <span className="text-gray-800">
              Conectando Tradição
            </span>
            <br />
            <span className="text-primary-600">
              e Inovação no Campo
            </span>
          </h2>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            <p>
              Há anos, a <span className="font-semibold text-primary-700">Raízes Eventos</span> tem sido referência na organização de eventos agropecuários,
            feiras, exposições, leilões e cavalgadas. Nossa missão é promover o desenvolvimento do
            agronegócio enquanto celebramos nossas raízes e tradições rurais.
          </p>
            <p>
              Trabalhamos com <span className="font-semibold text-primary-600">paixão</span> para criar experiências memoráveis que unem produtores,
            criadores, empresários e toda a comunidade do campo, sempre com foco na excelência
            e sustentabilidade.
          </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover border border-white/50"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl mb-4 mx-auto">
                <div className="text-white">{stat.icon}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 card-hover border border-white/50 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`flex justify-center mb-6 w-16 h-16 ${value.iconBg} rounded-2xl mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white flex items-center justify-center">{value.icon}</div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center group-hover:text-primary-700 transition-colors duration-300">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {value.description}
                </p>
              </div>
              
              {/* Decorative element */}
              <div className={`absolute top-4 right-4 w-2 h-2 ${value.bgColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
