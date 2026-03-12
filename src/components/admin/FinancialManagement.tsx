import { useEffect, useState } from 'react';
import { DollarSign, Plus, Calendar, Edit, Trash2, XCircle, Check, ClipboardList } from 'lucide-react';
import { Event, EventScenario } from '../../lib/supabase';
import { api, type ScenarioItemRow } from '../../lib/api';

type ScenarioFormState = {
  code: string;
  name: string;
  expected_revenue: number;
};

export default function FinancialManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [scenarios, setScenarios] = useState<EventScenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [scenarioItems, setScenarioItems] = useState<ScenarioItemRow[]>([]);
  const [scenarioItemValues, setScenarioItemValues] = useState<Record<number, number>>({});
  const [savingScenarioItems, setSavingScenarioItems] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showScenarioForm, setShowScenarioForm] = useState(false);
  const [editingScenario, setEditingScenario] = useState<EventScenario | null>(null);
  const [scenarioForm, setScenarioForm] = useState<ScenarioFormState>({
    code: '',
    name: '',
    expected_revenue: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchPlanning(selectedEvent.id);
    } else {
      setScenarios([]);
      setSelectedScenarioId('');
      setScenarioItems([]);
      setScenarioItemValues({});
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedScenarioId && selectedEvent) {
      api.getScenarioItems(selectedScenarioId).then(list => {
        setScenarioItems(list);
        const vals: Record<number, number> = {};
        list.forEach(i => {
          vals[i.financial_item_id] = i.expected_amount ?? i.base_amount ?? 0;
        });
        setScenarioItemValues(vals);
      });
    } else {
      setScenarioItems([]);
      setScenarioItemValues({});
    }
  }, [selectedScenarioId, selectedEvent?.id]);

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

  async function fetchPlanning(eventId: string) {
    try {
      const eventScenarios = await api.getEventScenarios(eventId);
      setScenarios(eventScenarios);
      if (eventScenarios.length > 0) {
        setSelectedScenarioId(eventScenarios[0].id);
      } else {
        setSelectedScenarioId('');
      }
    } catch (error) {
      console.error('Erro ao carregar cenários:', error);
    }
  }

  const handleEventSelect = (eventId: string) => {
    const event = events.find(e => e.id === eventId) || null;
    setSelectedEvent(event);
  };

  const handleScenarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      if (editingScenario) {
        const updated = await api.updateEventScenario(
          editingScenario.id,
          {
            name: scenarioForm.name.trim() || editingScenario.name,
            expected_revenue: scenarioForm.expected_revenue,
          },
          selectedEvent.id
        );
        setScenarios(prev => prev.map(s => (s.id === updated.id ? updated : s)));
      } else {
        const created = await api.createEventScenario(selectedEvent.id, {
          event_id: selectedEvent.id,
          code: '',
          name: scenarioForm.name.trim(),
          expected_revenue: scenarioForm.expected_revenue,
        });
        setScenarios(prev => [...prev, created]);
        setSelectedScenarioId(created.id);
      }
      resetScenarioForm();
    } catch (error) {
      console.error('Erro ao salvar cenário:', error);
    }
  };

  const resetScenarioForm = () => {
    setScenarioForm({
      code: '',
      name: '',
      expected_revenue: 0,
    });
    setEditingScenario(null);
    setShowScenarioForm(false);
  };

  const handleScenarioEdit = (scenario: EventScenario) => {
    setEditingScenario(scenario);
    setScenarioForm({
      code: scenario.code,
      name: scenario.name,
      expected_revenue: scenario.expected_revenue,
    });
    setShowScenarioForm(true);
  };

  const handleScenarioDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cenário?')) return;
    try {
      await api.deleteEventScenario(id, selectedEvent.id);
      setScenarios(prev => prev.filter(s => s.id !== id));
      if (selectedScenarioId === id) {
        setSelectedScenarioId(prev =>
          prev === id && scenarios.length > 1 ? scenarios[0].id : ''
        );
      }
    } catch (error) {
      console.error('Erro ao excluir cenário:', error);
    }
  };

  const handleUseAsEventPlan = async (scenarioId: string) => {
    if (!selectedEvent) return;
    try {
      const updated = await api.updateEvent(selectedEvent.id, {
        chosen_scenario_id: scenarioId,
      });
      setEvents(prev =>
        prev.map(e => (e.id === updated.id ? updated : e))
      );
      setSelectedEvent(updated);
    } catch (error) {
      console.error('Erro ao definir cenário do evento:', error);
      alert('Erro ao definir cenário. Tente novamente.');
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || null;

  function getTotalsFromScenarioItems() {
    let totalReceitas = 0;
    let totalDespesas = 0;
    scenarioItems.forEach(row => {
      const value = scenarioItemValues[row.financial_item_id] ?? row.expected_amount ?? row.base_amount ?? 0;
      if (row.type === 'receita') totalReceitas += value;
      else totalDespesas += value;
    });
    const totalRevenues = totalReceitas;
    const totalCosts = totalDespesas;
    const netProfit = totalRevenues - totalCosts;
    const margin = totalRevenues > 0 ? (netProfit / totalRevenues) * 100 : 0;
    return { totalReceitas, totalDespesas, totalRevenues, totalCosts, netProfit, margin };
  }

  const totals = selectedScenario ? getTotalsFromScenarioItems() : {
    totalReceitas: 0,
    totalDespesas: 0,
    totalRevenues: 0,
    totalCosts: 0,
    netProfit: 0,
    margin: 0,
  };

  const handleScenarioItemValueChange = (financialItemId: number, value: number) => {
    setScenarioItemValues(prev => ({ ...prev, [financialItemId]: value }));
  };

  const handleSaveScenarioItems = async () => {
    if (!selectedScenarioId) return;
    setSavingScenarioItems(true);
    try {
      const payload = scenarioItems.map(row => ({
        financial_item_id: row.financial_item_id,
        expected_amount: scenarioItemValues[row.financial_item_id] ?? row.expected_amount ?? row.base_amount ?? 0,
      }));
      await api.updateScenarioItems(selectedScenarioId, payload);
      setScenarioItems(prev => prev.map(p => ({
        ...p,
        expected_amount: scenarioItemValues[p.financial_item_id] ?? p.expected_amount ?? p.base_amount ?? 0,
      })));
    } catch (err) {
      console.error('Erro ao salvar valores do cenário:', err);
      alert('Erro ao salvar. Verifique se a tabela event_scenario_items existe no banco.');
    } finally {
      setSavingScenarioItems(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <DollarSign className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-800">Cenários de Faturamento</h1>
      </div>

      {/* Seleção de Evento */}
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
          {/* Cenários de Faturamento (em cima) */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Cenários de Faturamento
              </h2>
              <button
                onClick={() => {
                  setEditingScenario(null);
                  setScenarioForm({
                    code: '',
                    name: '',
                    expected_revenue: 0,
                  });
                  setShowScenarioForm(true);
                }}
                className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Novo Cenário
              </button>
            </div>

            {scenarios.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhum cenário cadastrado. Crie um cenário para definir a meta e os valores previstos por item.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {scenarios.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenarioId(scenario.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border text-left min-w-[200px] ${
                      selectedScenarioId === scenario.id
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {scenario.name} ({scenario.code})
                      </p>
                      <p className="text-xs text-gray-600">
                        Meta: {formatCurrency(scenario.expected_revenue)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {selectedEvent?.chosen_scenario_id === scenario.id && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded" title="Usado na Gestão de Eventos">
                          Em uso
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleUseAsEventPlan(scenario.id);
                        }}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Usar como evento cadastrado (Gestão de Eventos)"
                      >
                        <ClipboardList className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleScenarioEdit(scenario);
                        }}
                        className="text-primary-600 hover:text-primary-800 p-1"
                        title="Editar cenário"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleScenarioDelete(scenario.id);
                        }}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Excluir cenário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Resumo e valores previstos */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Resumo do Evento {selectedScenario && `- ${selectedScenario.name}`}
              </h2>

              {selectedScenario ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                    <div className="bg-primary-50 rounded-lg p-4 min-w-[140px]">
                      <p className="text-xs font-medium text-gray-600 mb-1">Meta de faturamento</p>
                      <p className="text-base sm:text-lg font-bold text-primary-700 overflow-x-auto">
                        {formatCurrency(selectedScenario.expected_revenue)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 min-w-[140px]">
                      <p className="text-xs font-medium text-gray-600 mb-1">Total Receitas</p>
                      <p className="text-base sm:text-lg font-bold text-green-600 overflow-x-auto">
                        {formatCurrency(totals.totalRevenues)}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 min-w-[140px]">
                      <p className="text-xs font-medium text-gray-600 mb-1">Total Despesas</p>
                      <p className="text-base sm:text-lg font-bold text-red-600 overflow-x-auto">
                        {formatCurrency(totals.totalCosts)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 min-w-[140px]">
                      <p className="text-xs font-medium text-gray-600 mb-1">Resultado</p>
                      <p
                        className={`text-base sm:text-lg font-bold overflow-x-auto ${
                          totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(totals.netProfit)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 min-w-[140px]">
                      <p className="text-xs font-medium text-gray-600 mb-1">Margem</p>
                      <p
                        className={`text-base sm:text-lg font-bold overflow-x-auto ${
                          totals.margin >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {totals.margin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Ajuste os valores previstos e clique no botão verde (✓) ao lado para salvar o cenário.
                  </p>

                  {/* Tabela de valores previstos por item (comparativo) */}
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">
                      Valores previstos neste cenário
                    </h3>
                    {scenarioItems.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Cadastre receitas e despesas na tela Simulações para este evento; depois os itens aparecerão aqui.
                      </p>
                    ) : (
                      <>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left font-medium text-gray-600">Tipo</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600">Nome</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-600">Valor previsto (R$) / Salvar</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {scenarioItems.map(row => (
                                <tr key={row.financial_item_id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2">
                                    <span
                                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                        row.type === 'custo' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                      }`}
                                    >
                                      {row.type === 'custo' ? 'Despesa' : 'Receita'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-gray-900">{row.name}</td>
                                  <td className="px-4 py-2">
                                    <div className="flex items-center justify-end gap-2">
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={scenarioItemValues[row.financial_item_id] ?? row.expected_amount ?? row.base_amount ?? 0}
                                        onChange={e =>
                                          handleScenarioItemValueChange(
                                            row.financial_item_id,
                                            parseFloat(e.target.value) || 0
                                          )
                                        }
                                        onBlur={handleSaveScenarioItems}
                                        className="w-full max-w-[120px] px-2 py-1.5 border border-gray-300 rounded text-right focus:ring-2 focus:ring-primary-600"
                                      />
                                      <button
                                        type="button"
                                        onClick={handleSaveScenarioItems}
                                        disabled={savingScenarioItems}
                                        className="flex-shrink-0 p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                                        title="Salvar cenário"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Selecione ou crie um cenário acima para visualizar o resumo e definir os valores previstos por item.
                </p>
              )}
          </div>
        </>
      )}

      {/* Modal de Cenário */}
      {showScenarioForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingScenario ? 'Editar Cenário' : 'Novo Cenário'}
              </h2>
              <button
                onClick={resetScenarioForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleScenarioSubmit} className="p-6 space-y-4">
              {editingScenario ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <p className="text-gray-900 font-medium">{editingScenario.code}</p>
                </div>
              ) : null}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do cenário
                </label>
                <input
                  type="text"
                  value={scenarioForm.name}
                  onChange={e =>
                    setScenarioForm(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={editingScenario ? undefined : 'Ex.: Cenário conservador (deixe em branco para "Cenário A")'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
                {!editingScenario && (
                  <p className="text-xs text-gray-500 mt-1">
                    Opcional. Se deixar em branco, será usado &quot;Cenário A&quot;, &quot;Cenário B&quot;, etc.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta de faturamento (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={scenarioForm.expected_revenue}
                  onChange={e =>
                    setScenarioForm(prev => ({
                      ...prev,
                      expected_revenue: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetScenarioForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  {editingScenario ? 'Atualizar' : 'Criar cenário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
