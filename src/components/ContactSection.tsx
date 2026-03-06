import { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, MessageCircle } from 'lucide-react';

export default function ContactSection() {
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
    <section id="contato" className="py-20 md:py-24 bg-primary-50/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className="text-center mb-14">
          <span className="section-label">Contato</span>
          <h2 className="section-title">
            <span className="block">Vamos Realizar</span>
            <span className="block section-title-accent">seu Próximo Evento</span>
          </h2>
          <p className="section-lead">
            Estamos prontos para transformar sua ideia em um evento inesquecível que conecta tradição e inovação
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
                className="w-full bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 font-semibold disabled:opacity-50 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Enviando...
                  </div>
                ) : (
                  'Enviar Mensagem'
                )}
              </button>
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl text-center font-medium">
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
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">E-mail</h4>
                    <p className="text-gray-600">contato@raizeseventos.com.br</p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Telefone</h4>
                    <p className="text-gray-600">(11) 99999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">WhatsApp</h4>
                    <a
                      href="https://wa.me/5511999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      (11) 99999-9999
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Instagram</h4>
                    <a
                      href="https://instagram.com/raizeseventos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      @raizeseventos
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Endereço</h4>
                    <p className="text-gray-600">São Paulo - SP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="h-80 rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234013.46292881698!2d-46.87501955!3d-23.6824124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce448183a461d1%3A0x9ba94b08ff335bae!2sS%C3%A3o%20Paulo%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
