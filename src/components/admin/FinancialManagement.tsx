import { useEffect, useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Filter, 
  Download, 
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Event, FinancialTransaction, FinancialCategory, FinancialType, PaymentStatus } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../lib/mockData';

export default function FinancialManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [filterType, setFilterType] = useState<FinancialType | 'todos'>('todos');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'todos'>('todos');
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    type: 'custo' as FinancialType,
    category: '' as FinancialCategory,
    description: '',
    amount: 0,
    payment_status: 'pendente' as PaymentStatus,
    due_date: '',
    payment_date: '',
    vendor: '',
    notes: ''
  });

  const categories = {
    custo: [
      { value: 'infraestrutura', label: 'Infraestrutura' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'pessoal', label: 'Pessoal' },
      { value: 'alimentacao', label: 'Alimentação' },
      { value: 'transporte', label: 'Transporte' },
      { value: 'equipamentos', label: 'Equipamentos' },
      { value: 'outros', label: 'Outros' }
    ],
    receita: [
      { value: 'ingressos', label: 'Ingressos' },
      { value: 'patrocinios', label: 'Patrocínios' },
      { value: 'vendas', label: 'Vendas' },
      { value: 'parcerias', label: 'Parcerias' },
      { value: 'governo', label: 'Governo' },
      { value: 'outros', label: 'Outros' }
    ]
  };

  const statusConfig = {
    pendente: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    pago: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    atrasado: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    cancelado: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100' }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchTransactions();
    }
  }, [selectedEvent]);

  async function fetchEvents() {
    try {
      const data = await mockApi.getEvents();
      setEvents(data.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()));
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
    setLoading(false);
  }

  async function fetchTransactions() {
    if (!selectedEvent) return;
    
    try {
      // Simular dados de transações financeiras com clientes e fornecedores
      const mockTransactions: FinancialTransaction[] = [
        {
          id: '1',
          event_id: selectedEvent.id,
          type: 'custo',
          category: 'infraestrutura',
          description: 'Aluguel do espaço',
          amount: 5000,
          payment_status: 'pago',
          due_date: '2024-01-15',
          payment_date: '2024-01-10',
          vendor: 'Centro de Eventos ABC',
          notes: 'Pagamento antecipado com desconto de 5%',
          created_by: user?.id || '',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-10T00:00:00Z'
        },
        {
          id: '2',
          event_id: selectedEvent.id,
          type: 'custo',
          category: 'alimentacao',
          description: 'Catering para 200 pessoas',
          amount: 3500,
          payment_status: 'pago',
          due_date: '2024-01-20',
          payment_date: '2024-01-18',
          vendor: 'Catering Rural',
          notes: 'Menu especial com pratos típicos da região',
          created_by: user?.id || '',
          created_at: '2024-01-05T00:00:00Z',
          updated_at: '2024-01-18T00:00:00Z'
        },
        {
          id: '3',
          event_id: selectedEvent.id,
          type: 'custo',
          category: 'equipamentos',
          description: 'Aluguel de equipamentos de som',
          amount: 1200,
          payment_status: 'pendente',
          due_date: '2024-02-01',
          vendor: 'Equipamentos Agro',
          notes: 'Sistema de som profissional para área externa',
          created_by: user?.id || '',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '4',
          event_id: selectedEvent.id,
          type: 'custo',
          category: 'marketing',
          description: 'Campanha digital e impressos',
          amount: 2500,
          payment_status: 'pago',
          due_date: '2024-01-25',
          payment_date: '2024-01-22',
          vendor: 'Agência Digital XYZ',
          notes: 'Banners, flyers e campanha no Instagram',
          created_by: user?.id || '',
          created_at: '2024-01-10T00:00:00Z',
          updated_at: '2024-01-22T00:00:00Z'
        },
        {
          id: '5',
          event_id: selectedEvent.id,
          type: 'receita',
          category: 'ingressos',
          description: 'Venda de ingressos - Fazenda São José',
          amount: 8000,
          payment_status: 'pago',
          due_date: '2024-01-30',
          payment_date: '2024-01-28',
          vendor: 'Fazenda São José',
          notes: 'Pacote premium para 50 pessoas',
          created_by: user?.id || '',
          created_at: '2024-01-20T00:00:00Z',
          updated_at: '2024-01-28T00:00:00Z'
        },
        {
          id: '6',
          event_id: selectedEvent.id,
          type: 'receita',
          category: 'patrocinios',
          description: 'Patrocínio - Cooperativa Agro Norte',
          amount: 12000,
          payment_status: 'pago',
          due_date: '2024-01-25',
          payment_date: '2024-01-25',
          vendor: 'Cooperativa Agro Norte',
          notes: 'Patrocínio master com exposição de produtos',
          created_by: user?.id || '',
          created_at: '2024-01-12T00:00:00Z',
          updated_at: '2024-01-25T00:00:00Z'
        },
        {
          id: '7',
          event_id: selectedEvent.id,
          type: 'receita',
          category: 'vendas',
          description: 'Venda de produtos - João Silva',
          amount: 2500,
          payment_status: 'pendente',
          due_date: '2024-02-05',
          vendor: 'João Silva',
          notes: 'Venda de sementes e fertilizantes',
          created_by: user?.id || '',
          created_at: '2024-01-25T00:00:00Z',
          updated_at: '2024-01-25T00:00:00Z'
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  }

  const handleEventSelect = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event || null);
    setTransactions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent || !formData.description || formData.amount <= 0) return;

    const newTransaction: FinancialTransaction = {
      id: editingTransaction?.id || Date.now().toString(),
      event_id: selectedEvent.id,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
      payment_status: formData.payment_status,
      due_date: formData.due_date,
      payment_date: formData.payment_date || undefined,
      vendor: formData.vendor || undefined,
      notes: formData.notes || undefined,
      created_by: user?.id || '',
      created_at: editingTransaction?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? newTransaction : t));
    } else {
      setTransactions([...transactions, newTransaction]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'custo',
      category: '',
      description: '',
      amount: 0,
      payment_status: 'pendente',
      due_date: '',
      payment_date: '',
      vendor: '',
      notes: ''
    });
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: FinancialTransaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      payment_status: transaction.payment_status,
      due_date: transaction.due_date,
      payment_date: transaction.payment_date || '',
      vendor: transaction.vendor || '',
      notes: transaction.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filterType === 'todos' || transaction.type === filterType;
    const statusMatch = filterStatus === 'todos' || transaction.payment_status === filterStatus;
    return typeMatch && statusMatch;
  });

  const totalCosts = transactions
    .filter(t => t.type === 'custo')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRevenues = transactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenues - totalCosts;
  const profitMargin = totalRevenues > 0 ? (netProfit / totalRevenues) * 100 : 0;

  const pendingPayments = transactions.filter(t => t.payment_status === 'pendente').length;
  const overduePayments = transactions.filter(t => t.payment_status === 'atrasado').length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
        <h1 className="text-3xl font-bold text-gray-800">Gerenciamento Financeiro</h1>
      </div>

      {/* Event Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-primary-600 font-medium mb-2">Selecionar Evento</label>
        <select
          value={selectedEvent?.id || ''}
          onChange={(e) => handleEventSelect(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">Selecione um evento...</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} - {formatDate(event.event_date)}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Custos</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCosts)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenues)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                  <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netProfit)}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <DollarSign className={`w-6 h-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Margem de Lucro</p>
                  <p className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profitMargin.toFixed(1)}%
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${profitMargin >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <TrendingUp className={`w-6 h-6 ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status Alerts */}
          {(pendingPayments > 0 || overduePayments > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {pendingPayments > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">
                      {pendingPayments} pagamento(s) pendente(s)
                    </span>
                  </div>
                </div>
              )}
              {overduePayments > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">
                      {overduePayments} pagamento(s) em atraso
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Transação
              </button>
              
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center font-medium">
                <Download className="w-5 h-5 mr-2" />
                Exportar Relatório
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FinancialType | 'todos')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="todos">Todos os tipos</option>
                <option value="custo">Custos</option>
                <option value="receita">Receitas</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as PaymentStatus | 'todos')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="todos">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="atrasado">Atrasado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Transaction Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as FinancialType, category: '' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        >
                          <option value="custo">Custo</option>
                          <option value="receita">Receita</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as FinancialCategory })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        >
                          <option value="">Selecionar categoria</option>
                          {categories[formData.type].map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        placeholder="Descrição da transação"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status do Pagamento</label>
                        <select
                          value={formData.payment_status}
                          onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as PaymentStatus })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="pago">Pago</option>
                          <option value="atrasado">Atrasado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Vencimento</label>
                        <input
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Pagamento</label>
                        <input
                          type="date"
                          value={formData.payment_date}
                          onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fornecedor/Cliente</label>
                      <input
                        type="text"
                        value={formData.vendor}
                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        placeholder="Nome do fornecedor ou cliente"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        rows={3}
                        placeholder="Observações adicionais"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                      >
                        {editingTransaction ? 'Atualizar' : 'Adicionar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Transações Financeiras</h3>
            </div>
            
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma transação encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vencimento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => {
                      const StatusIcon = statusConfig[transaction.payment_status].icon;
                      const statusColor = statusConfig[transaction.payment_status].color;
                      const statusBg = statusConfig[transaction.payment_status].bg;
                      
                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'custo' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {transaction.type === 'custo' ? 'Custo' : 'Receita'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {transaction.description}
                              </div>
                              {transaction.vendor && (
                                <div className="text-sm text-gray-500">
                                  {transaction.vendor}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {categories[transaction.type].find(c => c.value === transaction.category)?.label}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              transaction.type === 'custo' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {transaction.type === 'custo' ? '-' : '+'}{formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {transaction.payment_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(transaction.due_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}


