import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryMedia } from '../lib/supabase';
import { api } from '../lib/api';
import { useInView } from '../hooks/useInView';

export default function GallerySection() {
  const { ref: sectionRef, isInView } = useInView();
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    try {
      const data = await api.getGalleryMedia();
      const filteredData = data.filter(item => item.media_type === 'foto').slice(0, 10);
      setMedia(filteredData.length > 0 ? filteredData : getDefaultImages());
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
      setMedia(getDefaultImages());
    }
    setLoading(false);
  }

  function getDefaultImages(): GalleryMedia[] {
    return [
      {
        id: '2',
        event_id: null,
        media_type: 'foto',
        media_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Feira Agropecuária',
        display_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        event_id: null,
        media_type: 'foto',
        media_url: 'https://images.pexels.com/photos/162240/farm-cows-cattle-livestock-162240.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Exposição de Gado',
        display_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: '4',
        event_id: null,
        media_type: 'foto',
        media_url: 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Cavalgada Tradicional',
        display_order: 3,
        created_at: new Date().toISOString(),
      },
    ];
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <section id="galeria" className="py-20 md:py-24 bg-primary-50">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section id="galeria" ref={sectionRef as React.RefObject<HTMLElement>} className="py-20 md:py-24 bg-primary-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className={`text-center mb-14 reveal-on-scroll ${isInView ? 'visible' : ''}`}>
          <span className="section-label">Galeria</span>
          <h2 className="section-title">
            <span className="block">Momentos Únicos</span>
            <span className="block section-title-accent">que Marcam o Campo</span>
          </h2>
          <p className="section-lead">
            Reviva os momentos mais marcantes das edições anteriores e sinta a energia dos nossos eventos
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative group">
            <div
              key={currentIndex}
              className="h-96 md:h-[520px] bg-cover bg-center rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-fade-in"
              style={{
                backgroundImage: `url(${media[currentIndex]?.media_url})`,
              }}
            >
              <div className="h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <div className="max-w-2xl">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {media[currentIndex]?.caption}
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Experiências únicas que conectam tradição e inovação no agronegócio
                </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-4 rounded-2xl shadow-xl transition-all duration-300 motion-reduce:transition-none transform hover:scale-110 motion-reduce:hover:scale-100 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-4 rounded-2xl shadow-xl transition-all duration-300 motion-reduce:transition-none transform hover:scale-110 motion-reduce:hover:scale-100 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex justify-center mt-8">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-gray-100">
              <div className="flex space-x-3">
                {media.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                    className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-20 h-12 ring-4 ring-primary-500 ring-opacity-50' 
                        : 'w-16 h-10 hover:w-18 hover:h-11'
                    }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.media_url})` }}
                    >
                      <div className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentIndex ? 'bg-primary-500/20' : 'bg-black/20'
                      }`}></div>
                    </div>
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-600/50 to-transparent"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {media.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
