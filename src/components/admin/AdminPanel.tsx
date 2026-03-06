import { useState } from 'react';
import { Calendar, BarChart3, LogOut, DollarSign, Users, Menu, X, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import EventManagement from './EventManagement';
import FinancialManagement from './FinancialManagement';
import SimulationManagement from './SimulationManagement';
import GestaoEventos from './GestaoEventos';
import UserManagement from './UserManagement';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('events');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();

  const baseTabs = [
    { id: 'events', label: 'Eventos', icon: <Calendar className="w-5 h-5" /> },
    { id: 'simulations', label: 'Simulações', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'scenarios', label: 'Cenários', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'gestao-eventos', label: 'Gestão de Eventos', icon: <ClipboardList className="w-5 h-5" /> },
  ];

  const tabs =
    profile?.role === 'root'
      ? [
          ...baseTabs,
          { id: 'users', label: 'Usuários', icon: <Users className="w-5 h-5" /> },
        ]
      : baseTabs;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Barra superior mobile */}
      <header className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold">
            {profile?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">
              {profile?.full_name}
            </p>
            <p className="text-[11px] text-gray-600 capitalize">{profile?.role}</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Menu lateral / drawer */}
      <aside
        className={`
          bg-white shadow-lg md:shadow-none md:border-r border-gray-200
          w-full md:w-64
          md:min-h-screen
          ${mobileMenuOpen ? 'block' : 'hidden'} md:block
        `}
      >
        {/* Cabeçalho desktop */}
        <div className="hidden md:block">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                {profile?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{profile?.full_name}</p>
                <p className="text-xs text-gray-600 capitalize">{profile?.role}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="p-4 flex flex-col max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-5rem)] overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-sm md:text-base transition ${
                activeTab === tab.id
                  ? 'bg-primary-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={signOut}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm text-sm md:text-base"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Sair do sistema</span>
              </div>
            </button>
          </div>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 w-full p-4 md:p-8 md:pt-8 md:ml-0">
        {activeTab === 'events' && <EventManagement />}
        {activeTab === 'simulations' && <SimulationManagement />}
        {activeTab === 'scenarios' && <FinancialManagement />}
        {activeTab === 'gestao-eventos' && <GestaoEventos />}
        {activeTab === 'users' && profile?.role === 'root' && <UserManagement />}
      </main>
    </div>
  );
}
