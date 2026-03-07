import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const SECTION_IDS = ['sobre', 'o-que-fazemos', 'para-haras', 'para-patrocinadores', 'eventos', 'contato'];

interface HeaderProps {
  onNavigate: (section: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const { user, signOut } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute('id');
          if (id) setActiveSection(id);
          break;
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    const observer = observerRef.current;
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 100) setActiveSection('inicio');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const menuItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'o-que-fazemos', label: 'O que fazemos' },
    { id: 'para-haras', label: 'Para haras' },
    { id: 'para-patrocinadores', label: 'Para patrocinadores' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 motion-reduce:transition-none ${
        scrolled
          ? 'border-gray-200/90 shadow-md shadow-gray-900/5'
          : 'border-gray-100/80'
      }`}
    >
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/25 to-transparent pointer-events-none"
        aria-hidden
      />
      <div className="relative container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        <div
          className="cursor-pointer group"
          onClick={() => onNavigate('inicio')}
        >
          <div className="transform group-hover:scale-[1.03] transition-transform duration-300 ease-out motion-reduce:transition-none motion-reduce:scale-100">
            <Logo size="sm" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative font-medium text-sm py-2 group transition-colors duration-200 motion-reduce:transition-none ${
                  isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-primary-500 transition-all duration-300 ease-out motion-reduce:transition-none ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            );
          })}
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
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 motion-reduce:transition-none font-medium text-sm shadow-md hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.98] motion-reduce:active:scale-100"
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

      <div
        className={`md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
          mobileMenuOpen
            ? 'max-h-[80vh] opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-primary-900/98 backdrop-blur-md shadow-lg border-t border-white/10">
          <nav className="container mx-auto px-4 py-5 flex flex-col gap-1 max-w-7xl">
            {menuItems.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left font-medium py-3 px-4 rounded-xl transition-all duration-200 motion-reduce:transition-none hover:bg-white/10 ${
                    mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  } ${isActive ? 'text-white bg-white/15' : 'text-primary-100/90 hover:text-white'}`}
                  style={
                    mobileMenuOpen
                      ? { transitionDelay: `${index * 40}ms` }
                      : { transitionDelay: '0ms' }
                  }
                >
                  {item.label}
                </button>
              );
            })}
            {user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-primary-600 font-medium py-3 px-4 rounded-xl hover:bg-primary-50/80 transition-all duration-200 motion-reduce:transition-none"
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
                  className="w-full bg-primary-600 text-white px-6 py-3.5 rounded-xl hover:bg-primary-700 font-medium shadow-md transition-colors motion-reduce:transition-none"
                >
                  Acesso ao Sistema
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
