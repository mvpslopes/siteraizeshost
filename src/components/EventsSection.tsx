import { useEffect, useState } from 'react';
import { Calendar, MapPin, User } from 'lucide-react';
import { Event, EventType } from '../lib/supabase';
import { api } from '../lib/api';

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<EventType | 'todos'>('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const data = await api.getEvents();
      let filteredEvents = data.filter(event => 
        event.status === 'publicado' && 
        new Date(event.event_date) >= new Date()
      );

      if (filter !== 'todos') {
        filteredEvents = filteredEvents.filter(event => event.type === filter);
      }

      setEvents(filteredEvents.sort((a, b) => 
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ));
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
    setLoading(false);
  }

  const eventTypes = [
    { value: 'todos', label: 'Todos' },
    { value: 'exposicao', label: 'Exposições' },
    { value: 'feira', label: 'Feiras' },
    { value: 'leilao', label: 'Leilões' },
    { value: 'cavalgada', label: 'Cavalgadas' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: EventType) => {
    const labels = {
      exposicao: 'Exposição',
      feira: 'Feira',
      leilao: 'Leilão',
      cavalgada: 'Cavalgada',
    };
    return labels[type];
  };

  return (
    <section id="eventos" className="py-20 md:py-24 bg-gray-50/80 relative overflow-hidden">
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className="text-center mb-14">
          <span className="section-label">Próximos eventos</span>
          <h2 className="section-title">
            <span className="block">Eventos que Conectam</span>
            <span className="block section-title-accent">o Campo e a Tradição</span>
          </h2>
          <p className="section-lead">
            Confira a programação dos nossos eventos e participe de experiências únicas que celebram o agronegócio
          </p>
        </div>

        <div className="flex justify-center mb-14">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilter(type.value as EventType | 'todos')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filter === type.value
                      ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4">
              <div className="animate-spin rounded-full h-7 w-7 border-2 border-white border-t-transparent" />
            </div>
            <p className="text-gray-600">Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">Nenhum evento encontrado nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100/80"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: event.image_url
                        ? `url(${event.image_url})`
                        : 'url(https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800)',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        {getTypeLabel(event.type)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-700 transition-colors duration-300">
                    {event.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-lg mr-3">
                        <Calendar className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-medium">{formatDate(event.event_date)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-lg mr-3">
                        <MapPin className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-200 rounded-lg mr-3">
                        <User className="w-4 h-4 text-primary-700" />
                      </div>
                      <span className="font-medium">{event.responsible_name}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Saiba Mais
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
