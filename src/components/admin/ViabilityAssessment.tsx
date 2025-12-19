import { useEffect, useState } from 'react';
import { Plus, Calculator, DollarSign, TrendingUp, Trash2, Save, Download, Upload } from 'lucide-react';
import { Event } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../lib/mockData';

interface Cost {
  id: string;
  category: string;
  description: string;
  value: number;
}

interface Revenue {
  id: string;
  category: string;
  description: string;
  value: number;
}

export default function ViabilityAssessmentComponent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Form states
  const [showCostForm, setShowCostForm] = useState(false);
  const [showRevenueForm, setShowRevenueForm] = useState(false);
  const [costForm, setCostForm] = useState({
    category: '',
    description: '',
    value: 0
  });
  const [revenueForm, setRevenueForm] = useState({
    category: '',
    description: '',
    value: 0
  });

  const costCategories = [
    'Infraestrutura',
    'Marketing',
    'Pessoal',
    'Alimentação',
    'Transporte',
    'Equipamentos',
    'Outros'
  ];

  const revenueCategories = [
    'Ingressos',
    'Patrocínios',
    'Vendas',
    'Parcerias',
    'Governo',
    'Outros'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const data = await mockApi.getEvents();
      setEvents(data.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()));
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
    setLoading(false);
  }

  const handleEventSelect = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event || null);
    // Reset costs and revenues when selecting new event
    setCosts([]);
    setRevenues([]);
  };

  const addCost = () => {
    if (costForm.description && costForm.value > 0) {
      const newCost: Cost = {
        id: Date.now().toString(),
        ...costForm
      };
      setCosts([...costs, newCost]);
      setCostForm({ category: '', description: '', value: 0 });
      setShowCostForm(false);
    }
  };

  const addRevenue = () => {
    if (revenueForm.description && revenueForm.value > 0) {
      const newRevenue: Revenue = {
        id: Date.now().toString(),
        ...revenueForm
      };
      setRevenues([...revenues, newRevenue]);
      setRevenueForm({ category: '', description: '', value: 0 });
      setShowRevenueForm(false);
    }
  };

  const removeCost = (id: string) => {
    setCosts(costs.filter(cost => cost.id !== id));
  };

  const removeRevenue = (id: string) => {
    setRevenues(revenues.filter(revenue => revenue.id !== id));
  };

  const totalCosts = costs.reduce((sum, cost) => sum + cost.value, 0);
  const totalRevenues = revenues.reduce((sum, revenue) => sum + revenue.value, 0);
  const finalBalance = totalRevenues - totalCosts;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-700 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <Calculator className="w-8 h-8 text-primary-700" />
        <h1 className="text-3xl font-bold text-gray-800">Calculadora de Viabilidade de Eventos</h1>
      </div>

      {/* Event Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-primary-700 font-medium mb-2">Selecionar Evento</label>
        <select
          value={selectedEvent?.id || ''}
          onChange={(e) => handleEventSelect(e.target.value)}
          className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
        >
          <option value="">Selecione um evento...</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} - {new Date(event.event_date).toLocaleDateString('pt-BR')}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          {/* Cost and Revenue Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Add Cost Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Adicionar Custo</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-primary-700 font-medium mb-2">Categoria</label>
                  <select
                    value={costForm.category}
                    onChange={(e) => setCostForm({ ...costForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
                  >
                    <option value="">Selecionar categoria</option>
                    {costCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-primary-700 font-medium mb-2">Descrição do Custo</label>
                  <input
                    type="text"
                    value={costForm.description}
                    onChange={(e) => setCostForm({ ...costForm, description: e.target.value })}
                    placeholder="Descrição do Custo"
                    className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
                  />
                </div>

                <div>
                  <label className="block text-primary-700 font-medium mb-2">Valor do Custo (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costForm.value}
                    onChange={(e) => setCostForm({ ...costForm, value: parseFloat(e.target.value) || 0 })}
                    placeholder="Valor do Custo (R$)"
                    className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
                  />
                </div>

                <button
                  onClick={addCost}
                  className="w-full bg-primary-700 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition flex items-center justify-center font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Custo
                </button>
              </div>
            </div>

            {/* Add Revenue Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Adicionar Receita</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-primary-700 font-medium mb-2">Categoria</label>
                  <select
                    value={revenueForm.category}
                    onChange={(e) => setRevenueForm({ ...revenueForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
                  >
                    <option value="">Selecionar categoria</option>
                    {revenueCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-primary-700 font-medium mb-2">Descrição da Receita</label>
                  <input
                    type="text"
                    value={revenueForm.description}
                    onChange={(e) => setRevenueForm({ ...revenueForm, description: e.target.value })}
                    placeholder="Descrição da Receita"
                    className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
                  />
                </div>

                <div>
                  <label className="block text-primary-700 font-medium mb-2">Valor da Receita (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={revenueForm.value}
                    onChange={(e) => setRevenueForm({ ...revenueForm, value: parseFloat(e.target.value) || 0 })}
                    placeholder="Valor da Receita (R$)"
                    className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
                  />
                </div>

                <button
                  onClick={addRevenue}
                  className="w-full bg-primary-700 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition flex items-center justify-center font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Receita
                </button>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-earth-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Costs Table */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">-</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Custos</h3>
                </div>
                
                {costs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum custo adicionado</p>
                ) : (
                  <div className="space-y-2">
                    {costs.map((cost) => (
                      <div key={cost.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{cost.description}</p>
                          <p className="text-sm text-gray-600">{cost.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-red-600">{formatCurrency(cost.value)}</span>
                          <button
                            onClick={() => removeCost(cost.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Revenues Table */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">+</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Receitas</h3>
                </div>
                
                {revenues.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma receita adicionada</p>
                ) : (
                  <div className="space-y-2">
                    {revenues.map((revenue) => (
                      <div key={revenue.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{revenue.description}</p>
                          <p className="text-sm text-gray-600">{revenue.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-green-600">{formatCurrency(revenue.value)}</span>
                          <button
                            onClick={() => removeRevenue(revenue.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Costs */}
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Total de Custos</h4>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCosts)}</p>
              </div>

              {/* Total Revenues */}
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Total de Receitas</h4>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenues)}</p>
              </div>

              {/* Final Balance */}
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Saldo Final</h4>
                <p className={`text-2xl font-bold ${finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(finalBalance)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary-700 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition flex items-center font-medium">
              <Save className="w-5 h-5 mr-2" />
              Salvar Análise
            </button>
            <button className="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition flex items-center font-medium">
              <Download className="w-5 h-5 mr-2" />
              Exportar Relatório
            </button>
            <button className="bg-neutral-200 text-neutral-700 px-6 py-3 rounded-lg hover:bg-neutral-300 transition flex items-center font-medium">
              <Upload className="w-5 h-5 mr-2" />
              Importar Dados
            </button>
          </div>
        </>
      )}
    </div>
  );
}