import { useState } from 'react';
import { Mail, Instagram, MessageCircle } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { formatPhone } from '../utils/formatPhone';

const WHATSAPP_MENSAGEM_PADRAO = 'Olá, vim pelo site da Raízes Eventos!';

export default function ContactSection() {
  const { ref: sectionRef, isInView } = useInView();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular envio de mensagem
    await new Promise(resolve => setTimeout(resolve, 1000));

    setLoading(false);
    setSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <section id="contato" ref={sectionRef as React.RefObject<HTMLElement>} className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className={`text-center mb-14 reveal-on-scroll ${isInView ? 'visible' : ''}`}>
          <span className="section-label">Contato</span>
          <h2 className="section-title">
            <span className="block">Vamos construir juntos</span>
            <span className="block section-title-accent">o próximo evento</span>
          </h2>
          <p className="section-lead">
            Se você representa um Haras, empresa ou deseja
            <br />
            desenvolver um projeto no setor, entre em contato conosco.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100/80">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Fale Conosco</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-3">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white/50"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-3">E-mail</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white/50"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-3">Mensagem</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none bg-white/50"
                  placeholder="Descreva seu evento ou dúvida"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 motion-reduce:transition-none font-semibold disabled:opacity-50 transform hover:scale-[1.02] motion-reduce:hover:scale-100 shadow-lg hover:shadow-xl active:scale-[0.98] motion-reduce:active:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Enviando...
                  </div>
                ) : (
                  'Fale com a nossa equipe'
                )}
              </button>
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl text-center font-medium animate-fade-in">
                  ✅ Mensagem enviada com sucesso! Entraremos em contato em breve.
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">Informações de Contato</h3>
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 motion-reduce:group-hover:scale-100">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-2">Email</h4>
                    <a href="mailto:contato@raizeseventos.com.br" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">contato@raizeseventos.com.br</a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 motion-reduce:group-hover:scale-100">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-2">WhatsApp</h4>
                    <div className="space-y-2">
                      <a href={`https://wa.me/553195499897?text=${encodeURIComponent(WHATSAPP_MENSAGEM_PADRAO)}`} target="_blank" rel="noopener noreferrer" className="block text-primary-600 hover:text-primary-700 font-medium transition-colors">Léo Barbosa — {formatPhone('553195499897')}</a>
                      <a href={`https://wa.me/553196392292?text=${encodeURIComponent(WHATSAPP_MENSAGEM_PADRAO)}`} target="_blank" rel="noopener noreferrer" className="block text-primary-600 hover:text-primary-700 font-medium transition-colors">Thatyane Hoelzle — {formatPhone('553196392292')}</a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 motion-reduce:group-hover:scale-100">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-2">Instagram</h4>
                    <a href="https://www.instagram.com/raizeseventosltda/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">@raizeseventosltda</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
