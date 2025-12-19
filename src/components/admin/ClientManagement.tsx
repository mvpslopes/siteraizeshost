import { useEffect, useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  User,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Client, ClientType, Contact, ContactType } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ClientType | 'todos'>('todos');
  const [filterStatus, setFilterStatus] = useState<'ativo' | 'inativo' | 'suspenso' | 'todos'>('todos');
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    type: 'pessoa_fisica' as ClientType,
    document: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    contacts: [] as Contact[],
    notes: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'suspenso'
  });

  const [newContact, setNewContact] = useState({
    type: 'telefone' as ContactType,
    value: '',
    is_primary: false
  });

  const contactTypes = [
    { value: 'telefone', label: 'Telefone', icon: Phone },
    { value: 'email', label: 'E-mail', icon: Mail },
    { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
    { value: 'site', label: 'Site', icon: Mail }
  ];

  const statusConfig = {
    ativo: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Ativo' },
    inativo: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Inativo' },
    suspenso: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Suspenso' }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, filterType, filterStatus]);

  async function fetchClients() {
    try {
      // Dados fictícios inteligentes para demonstração
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'Fazenda São José',
          type: 'pessoa_juridica',
          document: '12.345.678/0001-90',
          email: 'contato@fazendasaojose.com.br',
          phone: '(11) 99999-1234',
          address: {
            street: 'Rodovia SP-348, Km 45',
            number: 'S/N',
            neighborhood: 'Zona Rural',
            city: 'Campinas',
            state: 'SP',
            zipCode: '13000-000'
          },
          contacts: [
            { id: '1', type: 'telefone', value: '(11) 99999-1234', is_primary: true },
            { id: '2', type: 'email', value: 'contato@fazendasaojose.com.br', is_primary: false },
            { id: '3', type: 'whatsapp', value: '(11) 99999-1234', is_primary: false }
          ],
          notes: 'Cliente premium, sempre pontual nos pagamentos. Prefere eventos de exposição agropecuária.',
          total_events: 8,
          total_spent: 125000,
          last_event_date: '2024-01-15',
          status: 'ativo',
          created_by: user?.id || '',
          created_at: '2023-06-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'João Silva',
          type: 'pessoa_fisica',
          document: '123.456.789-00',
          email: 'joao.silva@email.com',
          phone: '(11) 88888-5678',
          address: {
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apto 45',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01000-000'
          },
          contacts: [
            { id: '1', type: 'telefone', value: '(11) 88888-5678', is_primary: true },
            { id: '2', type: 'email', value: 'joao.silva@email.com', is_primary: false }
          ],
          notes: 'Produtor rural, interessado em eventos de cavalgada e leilões.',
          total_events: 3,
          total_spent: 25000,
          last_event_date: '2023-12-10',
          status: 'ativo',
          created_by: user?.id || '',
          created_at: '2023-08-20T00:00:00Z',
          updated_at: '2023-12-10T00:00:00Z'
        },
        {
          id: '3',
          name: 'Cooperativa Agro Norte',
          type: 'pessoa_juridica',
          document: '98.765.432/0001-10',
          email: 'eventos@coopagronorte.com.br',
          phone: '(11) 77777-9012',
          address: {
            street: 'Av. Industrial',
            number: '456',
            neighborhood: 'Distrito Industrial',
            city: 'Ribeirão Preto',
            state: 'SP',
            zipCode: '14000-000'
          },
          contacts: [
            { id: '1', type: 'telefone', value: '(11) 77777-9012', is_primary: true },
            { id: '2', type: 'email', value: 'eventos@coopagronorte.com.br', is_primary: false },
            { id: '3', type: 'site', value: 'www.coopagronorte.com.br', is_primary: false }
          ],
          notes: 'Cooperativa grande, organiza feiras anuais. Contrato de longo prazo.',
          total_events: 12,
          total_spent: 280000,
          last_event_date: '2024-02-20',
          status: 'ativo',
          created_by: user?.id || '',
          created_at: '2023-03-10T00:00:00Z',
          updated_at: '2024-02-20T00:00:00Z'
        },
        {
          id: '4',
          name: 'Maria Santos',
          type: 'pessoa_fisica',
          document: '987.654.321-00',
          email: 'maria.santos@email.com',
          phone: '(11) 66666-3456',
          address: {
            street: 'Rua do Campo',
            number: '789',
            neighborhood: 'Vila Rural',
            city: 'Sorocaba',
            state: 'SP',
            zipCode: '18000-000'
          },
          contacts: [
            { id: '1', type: 'telefone', value: '(11) 66666-3456', is_primary: true },
            { id: '2', type: 'whatsapp', value: '(11) 66666-3456', is_primary: false }
          ],
          notes: 'Pequena produtora, eventos simples. Pagamento sempre em dia.',
          total_events: 2,
          total_spent: 8000,
          last_event_date: '2023-11-05',
          status: 'ativo',
          created_by: user?.id || '',
          created_at: '2023-09-15T00:00:00Z',
          updated_at: '2023-11-05T00:00:00Z'
        },
        {
          id: '5',
          name: 'Agropecuária Central Ltda',
          type: 'pessoa_juridica',
          document: '11.222.333/0001-44',
          email: 'admin@agrocentral.com.br',
          phone: '(11) 55555-7890',
          address: {
            street: 'Rua Comercial',
            number: '321',
            neighborhood: 'Centro Comercial',
            city: 'Piracicaba',
            state: 'SP',
            zipCode: '13400-000'
          },
          contacts: [
            { id: '1', type: 'telefone', value: '(11) 55555-7890', is_primary: true },
            { id: '2', type: 'email', value: 'admin@agrocentral.com.br', is_primary: false }
          ],
          notes: 'Cliente com histórico de atrasos no pagamento. Requer atenção especial.',
          total_events: 5,
          total_spent: 45000,
          last_event_date: '2023-10-30',
          status: 'suspenso',
          created_by: user?.id || '',
          created_at: '2023-05-20T00:00:00Z',
          updated_at: '2023-10-30T00:00:00Z'
        }
      ];

      setClients(mockClients);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
    setLoading(false);
  }

  function filterClients() {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.document.includes(searchTerm)
      );
    }

    if (filterType !== 'todos') {
      filtered = filtered.filter(client => client.type === filterType);
    }

    if (filterStatus !== 'todos') {
      filtered = filtered.filter(client => client.status === filterStatus);
    }

    setFilteredClients(filtered);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.document) return;

    const newClient: Client = {
      id: editingClient?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      document: formData.document,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      contacts: formData.contacts,
      notes: formData.notes,
      total_events: editingClient?.total_events || 0,
      total_spent: editingClient?.total_spent || 0,
      last_event_date: editingClient?.last_event_date,
      status: formData.status,
      created_by: user?.id || '',
      created_at: editingClient?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? newClient : c));
    } else {
      setClients([...clients, newClient]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'pessoa_fisica',
      document: '',
      email: '',
      phone: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      contacts: [],
      notes: '',
      status: 'ativo'
    });
    setNewContact({
      type: 'telefone',
      value: '',
      is_primary: false
    });
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      type: client.type,
      document: client.document,
      email: client.email,
      phone: client.phone,
      address: client.address,
      contacts: client.contacts,
      notes: client.notes || '',
      status: client.status
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const addContact = () => {
    if (newContact.value) {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact
      };
      setFormData({
        ...formData,
        contacts: [...formData.contacts, contact]
      });
      setNewContact({
        type: 'telefone',
        value: '',
        is_primary: false
      });
    }
  };

  const removeContact = (contactId: string) => {
    setFormData({
      ...formData,
      contacts: formData.contacts.filter(c => c.id !== contactId)
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'ativo').length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.total_spent, 0);
  const averageSpent = totalClients > 0 ? totalRevenue / totalClients : 0;

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
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Clientes</h1>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-primary-600">{totalClients}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activeClients}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(averageSpent)}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, email ou documento..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ClientType | 'todos')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option value="todos">Todos os tipos</option>
              <option value="pessoa_fisica">Pessoa Física</option>
              <option value="pessoa_juridica">Pessoa Jurídica</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ativo' | 'inativo' | 'suspenso' | 'todos')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option value="todos">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="suspenso">Suspenso</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('todos');
                setFilterStatus('todos');
              }}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Client Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome/Razão Social *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ClientType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      required
                    >
                      <option value="pessoa_fisica">Pessoa Física</option>
                      <option value="pessoa_juridica">Pessoa Jurídica</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.type === 'pessoa_fisica' ? 'CPF *' : 'CNPJ *'}
                    </label>
                    <input
                      type="text"
                      value={formData.document}
                      onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder={formData.type === 'pessoa_fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ativo' | 'inativo' | 'suspenso' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="suspenso">Suspenso</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, street: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                      <input
                        type="text"
                        value={formData.address.number}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, number: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                      <input
                        type="text"
                        value={formData.address.complement}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, complement: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                      <input
                        type="text"
                        value={formData.address.neighborhood}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, neighborhood: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                      <input
                        type="text"
                        value={formData.address.zipCode}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, zipCode: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        placeholder="00000-000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, city: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, state: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        placeholder="SP"
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Contacts */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contatos Adicionais</h3>
                  
                  <div className="space-y-4">
                    {formData.contacts.map((contact) => {
                      const ContactIcon = contactTypes.find(c => c.value === contact.type)?.icon || Phone;
                      return (
                        <div key={contact.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <ContactIcon className="w-5 h-5 text-gray-600" />
                          <div className="flex-1">
                            <span className="font-medium text-gray-800">{contact.value}</span>
                            <span className="ml-2 text-sm text-gray-600">
                              ({contactTypes.find(c => c.value === contact.type)?.label})
                            </span>
                            {contact.is_primary && (
                              <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                                Principal
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeContact(contact.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex space-x-4 mt-4">
                    <select
                      value={newContact.type}
                      onChange={(e) => setNewContact({ ...newContact, type: e.target.value as ContactType })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      {contactTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newContact.value}
                      onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                      placeholder="Valor do contato"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newContact.is_primary}
                        onChange={(e) => setNewContact({ ...newContact, is_primary: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Principal</span>
                    </label>
                    <button
                      type="button"
                      onClick={addContact}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    rows={3}
                    placeholder="Observações sobre o cliente..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
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
                    {editingClient ? 'Atualizar' : 'Criar'} Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Clientes ({filteredClients.length})
          </h3>
        </div>
        
        {filteredClients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eventos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Gasto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => {
                  const StatusIcon = statusConfig[client.status].icon;
                  const statusColor = statusConfig[client.status].color;
                  const statusBg = statusConfig[client.status].bg;
                  
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            {client.type === 'pessoa_fisica' ? (
                              <User className="w-5 h-5 text-primary-600" />
                            ) : (
                              <Building className="w-5 h-5 text-primary-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.document}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {client.type === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.total_events}</div>
                        {client.last_event_date && (
                          <div className="text-sm text-gray-500">
                            Último: {formatDate(client.last_event_date)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(client.total_spent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[client.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
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
    </div>
  );
}


