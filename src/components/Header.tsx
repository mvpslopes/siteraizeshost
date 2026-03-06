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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100/80">
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md" />
      <div className="relative container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        <div className="cursor-pointer group" onClick={() => onNavigate('inicio')}>
          <div className="transform group-hover:scale-[1.02] transition-transform duration-300">
            <Logo size="sm" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors duration-200 py-2 group"
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
          {user ? (
            <>
              <button
                onClick={() => onNavigate('admin')}
                className="relative text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors duration-200 py-2 group"
              >
                Painel
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full" />
              </button>
              <button
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors duration-200 py-2"
              >
                Sair
              </button>
            </>
          ) : null}
        </nav>

        {!user && (
          <div className="hidden md:block">
            <button
              onClick={() => onNavigate('login')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
            >
              Acesso ao Sistema
            </button>
          </div>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md shadow-lg border-t border-gray-100">
          <nav className="container mx-auto px-4 py-5 flex flex-col gap-1 max-w-7xl">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-primary-600 font-medium py-3 px-4 rounded-xl hover:bg-primary-50/80 transition-colors"
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-primary-600 font-medium py-3 px-4 rounded-xl hover:bg-primary-50/80 transition-colors"
                >
                  Painel
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-500 hover:text-gray-700 font-medium py-3 px-4 rounded-xl"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="pt-3 mt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-primary-600 text-white px-6 py-3.5 rounded-xl hover:bg-primary-700 font-medium shadow-md"
                >
                  Acesso ao Sistema
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
