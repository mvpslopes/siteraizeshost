import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import EventsSection from './components/EventsSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/admin/AdminPanel';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const { user, loading } = useAuth();

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
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-700 border-t-transparent"></div>
      </div>
    );
  }

  if (currentPage === 'login' && !user) {
    return (
      <>
        <Header onNavigate={handleNavigate} />
        <LoginPage onBack={() => setCurrentPage('home')} />
      </>
    );
  }

  if (currentPage === 'admin' && user) {
    return (
      <>
        <Header onNavigate={handleNavigate} />
        <AdminPanel />
      </>
    );
  }

  return (
    <>
      <Header onNavigate={handleNavigate} />
      <main>
        <HeroSection onNavigate={handleNavigate} />
        <AboutSection />
        <EventsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
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
