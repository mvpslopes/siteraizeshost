import { Mail, Instagram, Phone } from 'lucide-react';
import Logo from './Logo';
import { formatPhone } from '../utils/formatPhone';

const WHATSAPP_MENSAGEM_PADRAO = 'Olá, vim pelo site da Raízes Eventos!';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-earth-900 text-white py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-y-48 -translate-x-48" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400/10 rounded-full translate-y-40 translate-x-40" />
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-6 flex flex-col items-start">
            <div className="transform hover:scale-105 transition-transform duration-300 motion-reduce:hover:scale-100">
              <Logo size="xl" white align="left" />
            </div>
            <p className="text-primary-100/90 text-base leading-relaxed max-w-sm">
              Raízes Eventos — Onde a tradição do campo encontra organização e visão de futuro.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://www.instagram.com/raizeseventosltda/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl hover:bg-primary-500 transition-colors duration-200 shadow-md">
                <Instagram className="w-6 h-6 text-white" />
              </a>
              <a href={`https://wa.me/553195499897?text=${encodeURIComponent(WHATSAPP_MENSAGEM_PADRAO)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl hover:bg-primary-500 transition-colors duration-200 shadow-md" title="Léo Barbosa">
                <Phone className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-white">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { href: '#inicio', label: 'Início' },
                { href: '#sobre', label: 'Sobre' },
                { href: '#o-que-fazemos', label: 'O que fazemos' },
                { href: '#para-haras', label: 'Para haras' },
                { href: '#para-patrocinadores', label: 'Para patrocinadores' },
                { href: '#eventos', label: 'Eventos' },
                { href: '#contato', label: 'Contato' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group flex items-center text-primary-100/90 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                </a>
              </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-white">
              Contato
            </h4>
            <div className="space-y-4">
              <a href="mailto:contato@raizeseventos.com.br" className="flex items-center group">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg mr-3 group-hover:scale-105 transition-transform duration-200 motion-reduce:group-hover:scale-100">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-primary-100/90 group-hover:text-white transition-colors">contato@raizeseventos.com.br</span>
              </a>
              <a href={`https://wa.me/553195499897?text=${encodeURIComponent(WHATSAPP_MENSAGEM_PADRAO)}`} target="_blank" rel="noopener noreferrer" className="flex items-center group">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg mr-3 group-hover:scale-105 transition-transform duration-200 motion-reduce:group-hover:scale-100">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="text-primary-100/90 group-hover:text-white transition-colors">Léo Barbosa — {formatPhone('553195499897')}</span>
              </a>
              <a href={`https://wa.me/553196392292?text=${encodeURIComponent(WHATSAPP_MENSAGEM_PADRAO)}`} target="_blank" rel="noopener noreferrer" className="flex items-center group">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg mr-3 group-hover:scale-105 transition-transform duration-200 motion-reduce:group-hover:scale-100">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="text-primary-100/90 group-hover:text-white transition-colors">Thatyane Hoelzle — {formatPhone('553196392292')}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-200/80 text-sm">
              &copy; {new Date().getFullYear()} Raízes Eventos. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-200/80">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
