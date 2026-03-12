import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { Event, EventType, EventStatus } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    type: 'exposicao' as EventType,
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    responsible_name: '',
    responsible_contact: '',
    image_url: '',
    observations: '',
    status: 'rascunho' as EventStatus,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const data = await api.getEvents();
      setEvents(
        data.sort(
          (a, b) =>
            new Date(b.start_date || b.event_date).getTime() -
            new Date(a.start_date || a.event_date).getTime()
        )
      );
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        event_date: formData.start_date || '',
      };
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, payload);
      } else {
        await api.createEvent({
          ...payload,
          created_by: user?.id || '1',
        });
      }
      await fetchEvents();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      type: event.type,
      description: event.description,
      location: event.location,
      start_date: (event.start_date || event.event_date).slice(0, 16),
      end_date: event.end_date ? event.end_date.slice(0, 16) : '',
      responsible_name: event.responsible_name,
      responsible_contact: event.responsible_contact,
      image_url: event.image_url,
      observations: event.observations,
      status: event.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await api.deleteEvent(id);
        await fetchEvents();
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'exposicao',
      description: '',
      location: '',
      start_date: '',
      end_date: '',
      responsible_name: '',
      responsible_contact: '',
      image_url: '',
      observations: '',
      status: 'rascunho',
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const getStatusBadge = (status: EventStatus) => {
    const badges = {
      rascunho: 'bg-gray-200 text-gray-700',
      publicado: 'bg-primary-200 text-primary-800',
      concluido: 'bg-blue-200 text-blue-800',
      cancelado: 'bg-red-200 text-red-800',
    };
    const labels = {
      rascunho: 'Rascunho',
      publicado: 'Publicado',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getEventCode = (index: number) => {
    const sequential = index + 1;
    return sequential.toString().padStart(4, '0');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-700 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Eventos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-700 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition flex items-center font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Evento
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEvent ? 'Editar Evento' : 'Novo Evento'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Nome do Evento</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option value="exposicao">Exposição</option>
                    <option value="copa">Copa</option>
                    <option value="poerao">Poeirão</option>
                    <option value="feira">Feira</option>
                    <option value="live">Live</option>
                    <option value="leilao">Leilão</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as EventStatus })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="publicado">Publicado</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Local</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Início</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Término</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Responsável</label>
                  <input
                    type="text"
                    required
                    value={formData.responsible_name}
                    onChange={(e) => setFormData({ ...formData, responsible_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contato</label>
                  <input
                    type="text"
                    required
                    value={formData.responsible_contact}
                    onChange={(e) =>
                      setFormData({ ...formData, responsible_contact: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">URL da Imagem</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Observações</label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary-700 text-white px-6 py-2 rounded-lg hover:bg-primary-800 transition"
                >
                  {editingEvent ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nome do Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event, index) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {getEventCode(index)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{event.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.start_date || event.event_date).toLocaleDateString('pt-BR')}
                      {event.end_date && (
                        <>
                          {' '}
                          -{' '}
                          {new Date(event.end_date).toLocaleDateString('pt-BR')}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate max-w-xs inline-block align-middle">
                        {event.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(event.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
