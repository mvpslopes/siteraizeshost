import { Eye, Users, Heart, Building2 } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const benefits = [
  {
    icon: <Eye className="w-6 h-6" />,
    text: 'Visibilidade de marca em eventos relevantes',
  },
  {
    icon: <Users className="w-6 h-6" />,
    text: 'Conexão direta com produtores, criadores e empresários do setor',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    text: 'Experiências que aproximam marcas do público',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    text: 'Posicionamento em um ambiente de tradição e negócios',
  },
];

export default function ParaPatrocinadoresSection() {
  const { ref: sectionRef, isInView } = useInView();

  return (
    <section id="para-patrocinadores" ref={sectionRef as React.RefObject<HTMLElement>} className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className={`max-w-4xl mx-auto text-center mb-14 reveal-on-scroll ${isInView ? 'visible' : ''}`}>
          <span className="section-label">Para patrocinadores</span>
          <h2 className="section-title">
            <span className="block">Conectando marcas</span>
            <span className="block section-title-accent">a um público qualificado</span>
          </h2>
          <p className="section-lead mt-6">
            Os eventos da Raízes oferecem oportunidades estratégicas para empresas que desejam fortalecer sua presença no agronegócio.
          </p>
          <p className="text-gray-600 mt-4">
            Através de projetos estruturados de patrocínio, proporcionamos:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          {benefits.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md border border-gray-100/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 motion-reduce:transition-none reveal-on-scroll ${isInView ? 'visible' : ''}`}
              style={{ transitionDelay: isInView ? `${(index + 1) * 70}ms` : '0ms' }}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                {item.icon}
              </div>
              <p className="text-gray-700 font-medium pt-1">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Nosso objetivo é construir parcerias que gerem valor para todos os envolvidos.
        </p>
      </div>
    </section>
  );
}
