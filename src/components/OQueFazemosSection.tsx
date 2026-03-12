import { Calendar, Handshake, Award, Users } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const items = [
  {
    icon: <Calendar className="w-8 h-8" />,
    title: (
      <>
        Planejamento e organização
        <br />
        de eventos agropecuários
      </>
    ),
    description: 'Planejamento e estruturação de copas, exposições, poeirões, encontros técnicos, eventos institucionais e outros projetos voltados ao setor agropecuário e equestre.',
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    title: 'Gestão de patrocinadores e parcerias',
    description: 'Desenvolvimento de projetos comerciais e captação de patrocinadores alinhados ao perfil do evento.',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: (
      <>
        Posicionamento e visibilidade
        <br />
        de marcas
      </>
    ),
    description: 'Criação de oportunidades para que Haras e empresas fortaleçam sua presença no mercado.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Experiência para o público',
    description: 'Eventos planejados para promover conexão, networking e valorização da cultura do campo, criando experiências que podem ser vividas e compartilhadas por toda a família.',
  },
];

export default function OQueFazemosSection() {
  const { ref: sectionRef, isInView } = useInView();

  return (
    <section id="o-que-fazemos" ref={sectionRef as React.RefObject<HTMLElement>} className="py-20 md:py-24 bg-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className={`text-center mb-14 reveal-on-scroll ${isInView ? 'visible' : ''}`}>
          <span className="section-label">O que fazemos</span>
          <h2 className="section-title">
            <span className="block">Soluções completas</span>
            <span className="block section-title-accent">para eventos do agro</span>
          </h2>
          <p className="section-lead max-w-3xl mx-auto">
            A Raízes Eventos atua de forma estratégica na concepção e realização de eventos, oferecendo suporte completo desde o planejamento até a execução.
          </p>
          <p className="font-garet text-base md:text-lg text-gray-600 mt-4 font-medium">
            Entre nossas principais áreas de atuação estão:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {items.map((item, index) => (
            <div
              key={index}
              className={`group bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 motion-reduce:transition-none border border-gray-100/80 flex gap-6 reveal-on-scroll ${isInView ? 'visible' : ''}`}
              style={{ transitionDelay: isInView ? `${(index + 1) * 80}ms` : '0ms' }}
            >
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 motion-reduce:group-hover:scale-100">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
