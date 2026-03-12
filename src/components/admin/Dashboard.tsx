import { useEffect, useState } from 'react';
import { Calendar, FileText, Users, TrendingUp, DollarSign, AlertCircle, UserCheck, Truck } from 'lucide-react';
import { api } from '../../lib/api';
import type { Event } from '../../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAssessments: 0,
    highViability: 0,
    totalRevenue: 0,
    totalCosts: 0,
    pendingPayments: 0,
    overduePayments: 0,
    totalClients: 0,
    activeClients: 0,
    totalSuppliers: 0,
    activeSuppliers: 0,
  });
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const [eventsList, assessments] = await Promise.all([
      api.getEvents(),
      api.getViabilityAssessments(),
    ]);

    const sortedEvents = [...eventsList].sort(
      (a, b) =>
        new Date(a.start_date || a.event_date).getTime() -
        new Date(b.start_date || b.event_date).getTime()
    );

    setEvents(sortedEvents);

    const upcomingEvents = eventsList.filter(event => {
      const start = new Date(event.start_date || event.event_date);
      const end = event.end_date ? new Date(event.end_date) : start;
      const now = new Date();
      return event.status === 'publicado' && end > now;
    });

    const highViability = assessments.filter(
      assessment => assessment.viability_level === 'alta'
    );

    // Simular dados financeiros e de clientes/fornecedores baseados nos eventos
    const totalRevenue = 385000; // Soma das receitas dos eventos
    const totalCosts = 135000; // Soma dos custos dos eventos
    const pendingPayments = 5;
    const overduePayments = 2;
    const totalClients = 5;
    const activeClients = 4;
    const totalSuppliers = 12;
    const activeSuppliers = 10;

    setStats({
      totalEvents: eventsList.length,
      upcomingEvents: upcomingEvents.length,
      totalAssessments: assessments.length,
      highViability: highViability.length,
      totalRevenue,
      totalCosts,
      pendingPayments,
      overduePayments,
      totalClients,
      activeClients,
      totalSuppliers,
      activeSuppliers,
    });
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const cards = [
    {
      title: 'Total de Eventos',
      value: stats.totalEvents,
      icon: <Calendar className="w-8 h-8 text-primary-600" />,
      color: 'bg-primary-50',
    },
    {
      title: 'Próximos Eventos',
      value: stats.upcomingEvents,
      icon: <FileText className="w-8 h-8 text-primary-600" />,
      color: 'bg-primary-50',
    },
    {
      title: 'Avaliações Realizadas',
      value: stats.totalAssessments,
      icon: <Users className="w-8 h-8 text-primary-600" />,
      color: 'bg-primary-50',
    },
    {
      title: 'Alta Viabilidade',
      value: stats.highViability,
      icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
      color: 'bg-primary-50',
    },
    {
      title: 'Receita Total',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Custos Totais',
      value: formatCurrency(stats.totalCosts),
      icon: <DollarSign className="w-8 h-8 text-red-600" />,
      color: 'bg-red-50',
    },
    {
      title: 'Pagamentos Pendentes',
      value: stats.pendingPayments,
      icon: <AlertCircle className="w-8 h-8 text-yellow-600" />,
      color: 'bg-yellow-50',
    },
    {
      title: 'Pagamentos em Atraso',
      value: stats.overduePayments,
      icon: <AlertCircle className="w-8 h-8 text-red-600" />,
      color: 'bg-red-50',
    },
    {
      title: 'Total de Clientes',
      value: stats.totalClients,
      icon: <UserCheck className="w-8 h-8 text-primary-600" />,
      color: 'bg-primary-50',
    },
    {
      title: 'Clientes Ativos',
      value: stats.activeClients,
      icon: <UserCheck className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Total de Fornecedores',
      value: stats.totalSuppliers,
      icon: <Truck className="w-8 h-8 text-primary-600" />,
      color: 'bg-primary-50',
    },
    {
      title: 'Fornecedores Ativos',
      value: stats.activeSuppliers,
      icon: <Truck className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
    },
  ];

  const formatDateRange = (event: Event) => {
    const start = event.start_date || event.event_date;
    const end = event.end_date;
    if (!start) return '-';
    const startDate = new Date(start);
    if (!end) {
      return startDate.toLocaleDateString('pt-BR');
    }
    const endDate = new Date(end);
    const sameDay = startDate.toDateString() === endDate.toDateString();
    if (sameDay) {
      return startDate.toLocaleDateString('pt-BR');
    }
    return `${startDate.toLocaleDateString('pt-BR')} → ${endDate.toLocaleDateString('pt-BR')}`;
  };

  const typeLabels: Record<Event['type'], string> = {
    exposicao: 'Exposição',
    copa: 'Copa',
    poerao: 'Poeirão',
    feira: 'Feira',
    live: 'Live',
    leilao: 'Leilão',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-lg p-6 shadow-md hover:shadow-lg transition`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Bem-vindo ao Painel Administrativo
        </h2>
        <p className="text-gray-600 mb-4">
          Gerencie eventos, avalie a viabilidade de novos projetos e acompanhe o desempenho da
          Raízes Eventos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Gerenciar Eventos</h3>
            <p className="text-sm text-gray-600">
              Cadastre novos eventos, edite informações e acompanhe o status de publicação.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Avaliar Viabilidade</h3>
            <p className="text-sm text-gray-600">
              Utilize o sistema de pontuação para avaliar a viabilidade de novos eventos.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Gerenciamento Financeiro</h3>
            <p className="text-sm text-gray-600">
              Controle custos, receitas e acompanhe o desempenho financeiro dos eventos.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Clientes e Fornecedores</h3>
            <p className="text-sm text-gray-600">
              Gerencie o relacionamento com clientes e fornecedores do seu negócio.
            </p>
          </div>
        </div>
      </div>

      {/* Resumo por evento */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Eventos cadastrados</h2>
            <p className="text-sm text-gray-600">
              Visão geral por evento, além dos indicadores acumulados.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium">
            {events.length} evento(s)
          </span>
        </div>

        {events.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum evento cadastrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Evento</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Tipo</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Período</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <p className="font-semibold text-gray-900">{ev.name}</p>
                      {ev.location && (
                        <p className="text-xs text-gray-500">{ev.location}</p>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                        {typeLabels[ev.type]}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{formatDateRange(ev)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          ev.status === 'publicado'
                            ? 'bg-green-50 text-green-700'
                            : ev.status === 'concluido'
                            ? 'bg-blue-50 text-blue-700'
                            : ev.status === 'cancelado'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ev.status === 'rascunho'
                          ? 'Rascunho'
                          : ev.status === 'publicado'
                          ? 'Publicado'
                          : ev.status === 'concluido'
                          ? 'Concluído'
                          : 'Cancelado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
