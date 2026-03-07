import { Sparkles, Shield, Users, Leaf } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const benefits = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    text: 'Maior exposição da genética e do trabalho do haras',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    text: 'Fortalecimento da marca dentro do setor',
  },
  {
    icon: <Users className="w-6 h-6" />,
    text: 'Conexão com novos clientes e parceiros',
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    text: 'Participação em projetos que valorizam o agronegócio',
  },
];

export default function ParaHarasSection() {
  const { ref: sectionRef, isInView } = useInView();

  return (
    <section id="para-haras" ref={sectionRef as React.RefObject<HTMLElement>} className="py-20 md:py-24 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-earth-900">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-y-48 -translate-x-48 pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400/10 rounded-full translate-y-40 translate-x-40 pointer-events-none" aria-hidden />
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className={`max-w-4xl mx-auto text-center mb-14 reveal-on-scroll ${isInView ? 'visible' : ''}`}>
          <span className="section-label !text-white font-semibold uppercase tracking-widest">Para haras</span>
          <h2 className="section-title !text-white">
            <span className="block !text-white">Uma vitrine para genética,</span>
            <span className="block !text-white">tradição e credibilidade</span>
          </h2>
          <p className="section-lead mt-6 !text-white">
            Os eventos organizados pela Raízes são pensados para oferecer aos haras um ambiente estruturado de valorização e visibilidade.
          </p>
          <p className="!text-white mt-4">
            Participar de eventos bem planejados proporciona:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          {benefits.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 transition-all duration-300 motion-reduce:transition-none hover:bg-white/15 hover:-translate-y-0.5 reveal-on-scroll ${isInView ? 'visible' : ''}`}
              style={{ transitionDelay: isInView ? `${(index + 1) * 70}ms` : '0ms' }}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary-400 rounded-xl flex items-center justify-center text-white">
                {item.icon}
              </div>
              <p className="!text-white font-medium pt-1">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center !text-white max-w-2xl mx-auto leading-relaxed">
          Acreditamos que eventos bem organizados são uma importante ferramenta de crescimento para criadores e para o setor como um todo.
        </p>
      </div>
    </section>
  );
}
