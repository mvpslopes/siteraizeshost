import { useEffect, useState } from 'react';
import { DollarSign, Plus, Trash2, Edit, Calendar, XCircle } from 'lucide-react';
import { Event, EventFinancialItem, FinancialType } from '../../lib/supabase';
import { api } from '../../lib/api';

type ItemFormState = {
  type: FinancialType;
  name: string;
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
};

export default function SimulationManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [items, setItems] = useState<EventFinancialItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EventFinancialItem | null>(null);
  const [form, setForm] = useState<ItemFormState>({
    type: 'receita',
    name: '',
    description: '',
    quantity: 1,
    unitAmount: 0,
    amount: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchItems(selectedEvent.id);
    } else {
      setItems([]);
    }
  }, [selectedEvent]);

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

  async function fetchItems(eventId: string) {
    try {
      const data = await api.getEventFinancialItems(eventId);
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar simulações:', error);
    }
  }

  const handleEventSelect = (eventId: string) => {
    const event = events.find(e => e.id === eventId) || null;
    setSelectedEvent(event);
  };

  const handleNewItem = (type: FinancialType) => {
    setEditingItem(null);
    setForm({
      type,
      name: '',
      description: '',
      quantity: 1,
      unitAmount: 0,
      amount: 0,
    });
    setShowForm(true);
  };

  const handleEditItem = (item: EventFinancialItem) => {
    setEditingItem(item);
    const base = item.base_amount || 0;
    setForm({
      type: item.type,
      name: item.name,
      description: item.description,
      quantity: 1,
      unitAmount: base,
      amount: base,
    });
    setShowForm(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    try {
      await api.deleteEventFinancialItem(id, selectedEvent.id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao excluir item de simulação:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    if (!form.name || form.quantity <= 0 || form.unitAmount <= 0) return;

    const total = form.quantity * form.unitAmount;

    const payloadBase: Omit<EventFinancialItem, 'id'> = {
      event_id: selectedEvent.id,
      type: form.type,
      nature: 'fixa',
      name: form.name,
      description: form.description,
      category: undefined,
      base_amount: total,
      percentage_over_revenue: undefined,
      payment_status: 'previsto',
      due_date: undefined,
      payment_date: undefined,
      partner: undefined,
      notes: undefined,
    };

    try {
      if (editingItem) {
        const updated = await api.updateEventFinancialItem(editingItem.id, payloadBase, selectedEvent.id);
        setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
      } else {
        const created = await api.createEventFinancialItem(selectedEvent.id, payloadBase);
        setItems(prev => [...prev, created]);
      }
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar item de simulação:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm({
      type: 'receita',
      name: '',
      description: '',
      quantity: 1,
      unitAmount: 0,
      amount: 0,
    });
  };

  const incomes = items.filter(item => item.type === 'receita');
  const expenses = items.filter(item => item.type === 'custo');

  const totalIncomes = incomes.reduce((sum, i) => sum + (i.base_amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, i) => sum + (i.base_amount || 0), 0);
  const balance = totalIncomes - totalExpenses;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR');

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <DollarSign className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-800">Simulações de Receitas e Despesas</h1>
      </div>

      {/* Seleção de evento */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-primary-600 font-medium mb-2">
          Selecionar Evento
        </label>
        <select
          value={selectedEvent?.id || ''}
          onChange={e => handleEventSelect(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">Selecione um evento...</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} - {formatDate(event.start_date || event.event_date)}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          {/* Comparativo superior */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm font-medium text-gray-600 mb-1">Total de Receitas</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncomes)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm font-medium text-gray-600 mb-1">Total de Despesas</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm font-medium text-gray-600 mb-1">Saldo Geral Previsto</p>
              <p
                className={`text-2xl font-bold ${
                  balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </div>
          </div>

          {/* Duas colunas: Receitas e Despesas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Receitas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Receitas</h2>
                <button
                  onClick={() => handleNewItem('receita')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar receita
                </button>
              </div>

              {incomes.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  Nenhuma receita cadastrada para este evento.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {incomes.map(item => (
                    <li key={item.id} className="px-6 py-4 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-green-600">
                          {formatCurrency(item.base_amount || 0)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Despesas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Despesas</h2>
                <button
                  onClick={() => handleNewItem('custo')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar despesa
                </button>
              </div>

              {expenses.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  Nenhuma despesa cadastrada para este evento.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {expenses.map(item => (
                    <li key={item.id} className="px-6 py-4 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-red-600">
                          {formatCurrency(item.base_amount || 0)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingItem
                  ? form.type === 'receita'
                    ? 'Editar receita'
                    : 'Editar despesa'
                  : form.type === 'receita'
                  ? 'Nova receita'
                  : 'Nova despesa'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder={
                    form.type === 'receita'
                      ? 'Ex.: Inscrição embriões'
                      : 'Ex.: Buffet, Empresa leiloeira...'
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={form.description}
                  onChange={e =>
                    setForm(prev => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Detalhe como esse valor é composto (lotes, pessoas, percentual etc.)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      quantity: parseInt(e.target.value || '1', 10) || 1,
                      amount: (parseInt(e.target.value || '1', 10) || 1) * prev.unitAmount,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor unitário (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.unitAmount}
                  onChange={e =>
                    setForm(prev => {
                      const unit = parseFloat(e.target.value) || 0;
                      return {
                        ...prev,
                        unitAmount: unit,
                        amount: unit * prev.quantity,
                      };
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor total (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  {editingItem ? 'Salvar alterações' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

