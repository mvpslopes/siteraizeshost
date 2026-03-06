import { useEffect, useState } from 'react';
import { Calendar, FileText, Users, TrendingUp, DollarSign, AlertCircle, UserCheck, Truck } from 'lucide-react';
import { api } from '../../lib/api';

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

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const [events, assessments] = await Promise.all([
      api.getEvents(),
      api.getViabilityAssessments()
    ]);

    const upcomingEvents = events.filter(event => 
      event.status === 'publicado' && 
      new Date(event.event_date) > new Date()
    );

    const highViability = assessments.filter(assessment => 
      assessment.viability_level === 'alta'
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
      totalEvents: events.length,
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
      currency: 'BRL'
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Bem-vindo ao Painel Administrativo</h2>
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
    </div>
  );
}
