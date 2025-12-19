import { Mail, Instagram, Phone } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-earth-900 via-earth-800 to-primary-900 text-white py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full -translate-y-48 -translate-x-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-primary-500/10 to-transparent rounded-full translate-y-40 translate-x-40"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-6">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <Logo size="md" />
            </div>
            <p className="text-neutral-300 text-base leading-relaxed max-w-sm">
              Conectando o agronegócio através de eventos memoráveis que celebram nossa cultura rural e tradições.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://instagram.com/raizeseventos"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
              >
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
                { href: '#eventos', label: 'Eventos' },
                { href: '#galeria', label: 'Galeria' },
                { href: '#contato', label: 'Contato' },
              ].map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="group flex items-center text-neutral-300 hover:text-white transition-all duration-300"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
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
              <div className="flex items-center group">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-white" />
              </div>
                <span className="text-neutral-300 group-hover:text-white transition-colors">
                  contato@raizeseventos.com.br
                </span>
              </div>
              <div className="flex items-center group">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="text-neutral-300 group-hover:text-white transition-colors">
                  (11) 99999-9999
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm">
              &copy; {new Date().getFullYear()} Raízes Eventos. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-6 text-sm text-neutral-400">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
