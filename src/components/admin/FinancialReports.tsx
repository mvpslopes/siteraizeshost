import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  DollarSign,
  Target
} from 'lucide-react';
import { Event, FinancialTransaction } from '../../lib/supabase';
import { mockApi } from '../../lib/mockData';

interface FinancialSummary {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;
  costBreakdown: Record<string, number>;
  revenueBreakdown: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    costs: number;
    profit: number;
  }>;
}

export default function FinancialReports() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      generateReport();
    }
  }, [selectedEvent, dateRange]);

  async function fetchEvents() {
    try {
      const data = await mockApi.getEvents();
      setEvents(data.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()));
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
    setLoading(false);
  }

  async function generateReport() {
    if (!selectedEvent) return;

    // Simular dados de relatório financeiro
    const mockSummary: FinancialSummary = {
      totalRevenue: 150000,
      totalCosts: 95000,
      netProfit: 55000,
      profitMargin: 36.7,
      costBreakdown: {
        'Infraestrutura': 35000,
        'Marketing': 20000,
        'Pessoal': 25000,
        'Alimentação': 10000,
        'Transporte': 3000,
        'Equipamentos': 2000
      },
      revenueBreakdown: {
        'Ingressos': 80000,
        'Patrocínios': 45000,
        'Vendas': 20000,
        'Parcerias': 5000
      },
      monthlyTrend: [
        { month: 'Jan', revenue: 25000, costs: 15000, profit: 10000 },
        { month: 'Fev', revenue: 30000, costs: 18000, profit: 12000 },
        { month: 'Mar', revenue: 35000, costs: 20000, profit: 15000 },
        { month: 'Abr', revenue: 40000, costs: 22000, profit: 18000 },
        { month: 'Mai', revenue: 20000, costs: 20000, profit: 0 }
      ]
    };

    setSummary(mockSummary);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const exportToPDF = () => {
    // Implementar exportação para PDF
    console.log('Exportando relatório para PDF...');
  };

  const exportToExcel = () => {
    // Implementar exportação para Excel
    console.log('Exportando relatório para Excel...');
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-800">Relatórios Financeiros</h1>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center font-medium"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center font-medium"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Event Selection and Date Range */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-primary-600 font-medium mb-2">Selecionar Evento</label>
            <select
              value={selectedEvent?.id || ''}
              onChange={(e) => {
                const event = events.find(ev => ev.id === e.target.value);
                setSelectedEvent(event || null);
              }}
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

          <div>
            <label className="block text-primary-600 font-medium mb-2">Data Inicial</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <div>
            <label className="block text-primary-600 font-medium mb-2">Data Final</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>
      </div>

      {selectedEvent && summary && (
        <>
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Custos Totais</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalCosts)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                  <p className="text-2xl font-bold text-primary-600">{formatCurrency(summary.netProfit)}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Margem de Lucro</p>
                  <p className="text-2xl font-bold text-primary-600">{summary.profitMargin.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Custos</h3>
              <div className="space-y-3">
                {Object.entries(summary.costBreakdown).map(([category, amount]) => {
                  const percentage = (amount / summary.totalCosts) * 100;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{category}</span>
                          <span className="text-gray-600">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{formatCurrency(amount)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Receitas</h3>
              <div className="space-y-3">
                {Object.entries(summary.revenueBreakdown).map(([category, amount]) => {
                  const percentage = (amount / summary.totalRevenue) * 100;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{category}</span>
                          <span className="text-gray-600">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{formatCurrency(amount)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Tendência Mensal</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Mês</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Receita</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Custos</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Lucro</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Margem</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.monthlyTrend.map((month, index) => {
                    const margin = month.revenue > 0 ? (month.profit / month.revenue) * 100 : 0;
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{month.month}</td>
                        <td className="py-3 px-4 text-right text-green-600 font-medium">
                          {formatCurrency(month.revenue)}
                        </td>
                        <td className="py-3 px-4 text-right text-red-600 font-medium">
                          {formatCurrency(month.costs)}
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${
                          month.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(month.profit)}
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${
                          margin >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {margin.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Principais Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-800">Maior fonte de receita</p>
                    <p className="text-sm text-gray-600">
                      {Object.entries(summary.revenueBreakdown)
                        .sort(([,a], [,b]) => b - a)[0][0]} representa a maior parte das receitas
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-800">Maior categoria de custo</p>
                    <p className="text-sm text-gray-600">
                      {Object.entries(summary.costBreakdown)
                        .sort(([,a], [,b]) => b - a)[0][0]} é o maior gasto do evento
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-800">Margem de lucro</p>
                    <p className="text-sm text-gray-600">
                      {summary.profitMargin.toFixed(1)}% de margem indica um evento {summary.profitMargin > 30 ? 'muito lucrativo' : 'lucrativo'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-800">Recomendação</p>
                    <p className="text-sm text-gray-600">
                      {summary.profitMargin > 30 
                        ? 'Continue com a estratégia atual' 
                        : 'Considere otimizar custos ou aumentar receitas'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedEvent && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Selecione um Evento</h3>
          <p className="text-gray-600">
            Escolha um evento para visualizar os relatórios financeiros detalhados.
          </p>
        </div>
      )}
    </div>
  );
}


