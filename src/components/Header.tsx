import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

interface HeaderProps {
  onNavigate: (section: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'galeria', label: 'Galeria' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-white/20"></div>
      <div className="relative container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="cursor-pointer -m-2 group" onClick={() => onNavigate('inicio')}>
          <div className="transform group-hover:scale-105 transition-transform duration-300">
          <Logo size="lg" />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative text-neutral-700 hover:text-primary-700 font-medium transition-all duration-300 group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
          {user ? (
            <>
              <button
                onClick={() => onNavigate('admin')}
                className="relative text-neutral-700 hover:text-primary-700 font-medium transition-all duration-300 group"
              >
                Painel Administrativo
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={signOut}
                className="relative text-neutral-700 hover:text-accent-600 font-medium transition-all duration-300 group"
              >
                Sair
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-600 to-accent-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="relative text-neutral-700 hover:text-primary-700 font-medium transition-all duration-300 group"
            >
              Acesso Interno
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 transition-all duration-300 group-hover:w-full"></span>
            </button>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
        <button
          onClick={() => onNavigate('login')}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Acesso ao Sistema
        </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 hover:text-primary-700 transition-colors p-2 rounded-lg hover:bg-white/50"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-white/20 shadow-xl">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-neutral-700 hover:text-primary-700 font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary-50 group"
              >
                <span className="relative">
                {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </button>
            ))}
            {user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-neutral-700 hover:text-primary-700 font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary-50 group"
                >
                  <span className="relative">
                  Painel Administrativo
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-neutral-700 hover:text-primary-600 font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary-50 group"
                >
                  <span className="relative">
                  Sair
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-neutral-700 hover:text-primary-700 font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary-50 group"
              >
                <span className="relative">
                Acesso Interno
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </button>
            )}
            <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onNavigate('login');
                setMobileMenuOpen(false);
              }}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Acesso ao Sistema
            </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
