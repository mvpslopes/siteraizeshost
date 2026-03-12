import { useEffect, useState } from 'react';
import { Calendar, MapPin, User } from 'lucide-react';
import { Event, EventType } from '../lib/supabase';
import { api } from '../lib/api';
import { useInView } from '../hooks/useInView';

export default function EventsSection() {
  const { ref: sectionRef, isInView } = useInView();
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
      let filteredEvents = data.filter(event => {
        const start = new Date(event.start_date || event.event_date);
        const end = event.end_date ? new Date(event.end_date) : start;
        const now = new Date();
        return event.status === 'publicado' && end >= now;
      });

      if (filter !== 'todos') {
        filteredEvents = filteredEvents.filter(event => event.type === filter);
      }

      setEvents(
        filteredEvents.sort(
          (a, b) =>
            new Date(a.start_date || a.event_date).getTime() -
            new Date(b.start_date || b.event_date).getTime()
        )
      );
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
    setLoading(false);
  }

  const eventTypes = [
    { value: 'todos', label: 'Todos' },
    { value: 'exposicao', label: 'Exposições' },
    { value: 'copa', label: 'Copas' },
    { value: 'poerao', label: 'Poeirões' },
    { value: 'feira', label: 'Feiras' },
    { value: 'live', label: 'Lives' },
    { value: 'leilao', label: 'Leilões' },
  ];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatEventPeriod = (event: Event) => {
    const start = event.start_date || event.event_date;
    const end = event.end_date;
    if (!start) return '-';
    if (!end || start.slice(0, 10) === end.slice(0, 10)) {
      return formatDateTime(start);
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    const sameMonth =
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear();
    const startStr = startDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: sameMonth ? undefined : 'short',
    });
    const endStr = endDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `${startStr} a ${endStr}`;
  };

  const getTypeLabel = (type: EventType) => {
    const labels = {
      exposicao: 'Exposição',
      copa: 'Copa',
      poerao: 'Poeirão',
      feira: 'Feira',
      live: 'Live',
      leilao: 'Leilão',
    };
    return labels[type];
  };

  return (
    <section id="eventos" ref={sectionRef as React.RefObject<HTMLElement>} className="py-20 md:py-24 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-earth-900">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-y-48 -translate-x-48 pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400/10 rounded-full translate-y-40 translate-x-40 pointer-events-none" aria-hidden />
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className={`text-center mb-14 reveal-on-scroll ${isInView ? 'visible' : ''}`}>
          <span className="section-label !text-white font-semibold uppercase tracking-widest">Eventos</span>
          <h2 className="section-title !text-white">
            <span className="block !text-white">Projetos e experiências</span>
            <span className="block !text-white">que valorizam o agro</span>
          </h2>
          <p className="section-lead !text-white">
            A Raízes Eventos trabalha na criação e desenvolvimento de eventos que fortalecem a cultura do campo e promovem encontros importantes para o setor.
          </p>
          <p className="!text-white mt-2">
            Nesta seção você poderá acompanhar nossos projetos, iniciativas e eventos realizados.
          </p>
        </div>

        <div className="flex justify-center mb-14">
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/20">
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilter(type.value as EventType | 'todos')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 motion-reduce:transition-none ${
                    filter === type.value
                      ? 'bg-white text-primary-800 shadow-lg transform scale-105 motion-reduce:scale-100'
                      : 'text-white hover:bg-white/20 hover:text-white'
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
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500 rounded-2xl mb-4">
              <div className="animate-spin rounded-full h-7 w-7 border-2 border-white border-t-transparent" />
            </div>
            <p className="text-white">Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <p className="text-white text-lg">Nenhum evento encontrado nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 motion-reduce:transition-none border border-gray-100/80 reveal-on-scroll ${isInView ? 'visible' : ''}`}
                style={{ transitionDelay: isInView ? `${index * 80}ms` : '0ms' }}
              >
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110 motion-reduce:group-hover:scale-100"
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
                      <span className="font-medium">{formatEventPeriod(event)}</span>
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
                    <button className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-all duration-300 motion-reduce:transition-none transform hover:scale-[1.02] motion-reduce:hover:scale-100 shadow-lg hover:shadow-xl">
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
