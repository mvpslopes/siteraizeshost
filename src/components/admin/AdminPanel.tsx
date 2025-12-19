import { useState } from 'react';
import { LayoutDashboard, Calendar, BarChart3, Users, LogOut, DollarSign, FileText, UserCheck, Truck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from './Dashboard';
import EventManagement from './EventManagement';
import ViabilityAssessment from './ViabilityAssessment';
import FinancialManagement from './FinancialManagement';
import FinancialReports from './FinancialReports';
import ClientManagement from './ClientManagement';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, signOut } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'events', label: 'Eventos', icon: <Calendar className="w-5 h-5" /> },
    { id: 'viability', label: 'Viabilidade', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'financial', label: 'Financeiro', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'reports', label: 'Relatórios', icon: <FileText className="w-5 h-5" /> },
    { id: 'clients', label: 'Clientes', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'suppliers', label: 'Fornecedores', icon: <Truck className="w-5 h-5" /> },
  ];

  if (profile?.role === 'admin') {
    tabs.push({ id: 'users', label: 'Usuários', icon: <Users className="w-5 h-5" /> });
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="flex">
        <aside className="w-64 bg-white h-[calc(100vh-5rem)] fixed left-0 top-20 shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                {profile?.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{profile?.full_name}</p>
                <p className="text-xs text-gray-600 capitalize">{profile?.role}</p>
              </div>
            </div>
          </div>
          <nav className="p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
                  activeTab === tab.id
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
            <button
              onClick={signOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mt-8 text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-8 pt-20">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'events' && <EventManagement />}
          {activeTab === 'viability' && <ViabilityAssessment />}
          {activeTab === 'financial' && <FinancialManagement />}
          {activeTab === 'reports' && <FinancialReports />}
          {activeTab === 'clients' && <ClientManagement />}
          {activeTab === 'suppliers' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center space-x-3 mb-8">
                <Truck className="w-8 h-8 text-primary-600" />
                <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Fornecedores</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Fornecedores</p>
                      <p className="text-2xl font-bold text-primary-600">12</p>
                    </div>
                    <Truck className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fornecedores Ativos</p>
                      <p className="text-2xl font-bold text-green-600">10</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categorias</p>
                      <p className="text-2xl font-bold text-blue-600">8</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fornecedores Cadastrados</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">Centro de Eventos ABC</h4>
                        <p className="text-sm text-gray-600">Infraestrutura • 4.8 ⭐ • R$ 45.000 em contratos</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Ativo</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">Catering Rural</h4>
                        <p className="text-sm text-gray-600">Alimentação • 4.5 ⭐ • R$ 28.000 em contratos</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Ativo</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">Equipamentos Agro</h4>
                        <p className="text-sm text-gray-600">Equipamentos • 4.2 ⭐ • R$ 15.000 em contratos</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Suspenso</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition">
                    Gerenciar Fornecedores
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'users' && profile?.role === 'admin' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Gerenciamento de Usuários</h1>
              <p className="text-gray-600">
                Sistema de gerenciamento de usuários em desenvolvimento.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
