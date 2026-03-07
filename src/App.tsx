import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SocialProofSection from './components/SocialProofSection';
import PartnersSection from './components/PartnersSection';
import AboutSection from './components/AboutSection';
import OQueFazemosSection from './components/OQueFazemosSection';
import ParaHarasSection from './components/ParaHarasSection';
import ParaPatrocinadoresSection from './components/ParaPatrocinadoresSection';
import EventsSection from './components/EventsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/admin/AdminPanel';
import SplashScreen from './components/SplashScreen';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const { user, loading, loggingIn, loggingOut } = useAuth();

  useEffect(() => {
    if (user) {
      setCurrentPage('admin');
    }
  }, [user]);

  const handleNavigate = (section: string) => {
    if (section === 'inicio') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'login') {
      setCurrentPage('login');
    } else if (section === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  if (loading) {
    return <SplashScreen subtitle="Carregando..." />;
  }

  if (loggingIn) {
    return <SplashScreen subtitle="Entrando..." />;
  }

  if (loggingOut) {
    return <SplashScreen subtitle="Saindo..." />;
  }

  if (currentPage === 'login' && !user) {
    return <LoginPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'admin' && user) {
    return <AdminPanel />;
  }

  return (
    <>
      <Header onNavigate={handleNavigate} />
      <main>
        <HeroSection onNavigate={handleNavigate} />
        <AboutSection />
        <OQueFazemosSection />
        <ParaHarasSection />
        <ParaPatrocinadoresSection />
        <EventsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
