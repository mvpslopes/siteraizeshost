// Dados mock para demonstração do sistema sem Supabase
// Atualizado em: 2024-12-19 22:25:00
import { Event, ViabilityAssessment, GalleryMedia, ContactMessage } from './supabase';

// Eventos de exemplo - DADOS FICTÍCIOS INTELIGENTES
let mockEvents: Event[] = [
  {
    id: '1',
    name: 'Exposição Agropecuária de Campinas 2024',
    type: 'exposicao',
    description: 'A maior exposição agropecuária da região de Campinas, reunindo produtores, criadores e empresas do setor rural. Evento com exposição de gado, cavalos, equipamentos agrícolas e palestras técnicas.',
    location: 'Centro de Eventos ABC - Campinas/SP',
    event_date: '2024-03-15',
    responsible_name: 'Carlos Mendes',
    responsible_contact: '(19) 99999-1234',
    image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Evento anual com expectativa de 5.000 visitantes. Parceria com Sindicato Rural de Campinas.',
    status: 'publicado',
    created_by: 'admin-1',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Feira de Cavalos Crioulos - Sorocaba',
    type: 'feira',
    description: 'Feira especializada em cavalos crioulos, com julgamentos, leilões e exposição de animais premiados. Inclui competições de laço e provas de resistência.',
    location: 'Parque de Exposições de Sorocaba - Sorocaba/SP',
    event_date: '2024-04-20',
    responsible_name: 'Maria Santos',
    responsible_contact: '(15) 88888-5678',
    image_url: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Evento tradicional com 30 anos de história. Expectativa de 2.000 visitantes especializados.',
    status: 'publicado',
    created_by: 'admin-1',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'Leilão de Gado Nelore - Piracicaba',
    type: 'leilao',
    description: 'Leilão especializado em gado Nelore de alta genética, com animais premiados em exposições nacionais. Inclui tour pela fazenda e palestra sobre melhoramento genético.',
    location: 'Fazenda São José - Piracicaba/SP',
    event_date: '2024-05-10',
    responsible_name: 'João Silva',
    responsible_contact: '(19) 77777-9012',
    image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Leilão premium com animais de elite. Expectativa de venda de R$ 2.000.000.',
    status: 'publicado',
    created_by: 'admin-1',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z'
  },
  {
    id: '4',
    name: 'Cavalgada da Tradição - Ribeirão Preto',
    type: 'cavalgada',
    description: 'Cavalgada tradicional que percorre 15km pelas fazendas históricas da região, com paradas para almoço típico e apresentações folclóricas. Evento familiar com foco na preservação da cultura rural.',
    location: 'Fazenda Boa Vista - Ribeirão Preto/SP',
    event_date: '2024-06-15',
    responsible_name: 'Ana Costa',
    responsible_contact: '(16) 66666-3456',
    image_url: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Evento cultural com 500 cavaleiros esperados. Inclui almoço típico e apresentações.',
    status: 'publicado',
    created_by: 'admin-1',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Exposição de Equipamentos Agrícolas - Bauru',
    type: 'exposicao',
    description: 'Exposição de máquinas e equipamentos agrícolas de última geração, com demonstrações práticas e palestras sobre agricultura de precisão. Inclui test drive de tratores e implementos.',
    location: 'Centro de Convenções de Bauru - Bauru/SP',
    event_date: '2024-07-22',
    responsible_name: 'Roberto Lima',
    responsible_contact: '(14) 55555-7890',
    image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Evento técnico com foco em inovação. Expectativa de 3.000 visitantes profissionais.',
    status: 'rascunho',
    created_by: 'admin-1',
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z'
  },
  {
    id: '6',
    name: 'Feira de Sementes e Fertilizantes - Marília',
    type: 'feira',
    description: 'Feira especializada em insumos agrícolas, com lançamentos de novas variedades de sementes e fertilizantes. Inclui palestras técnicas sobre manejo e produtividade.',
    location: 'Parque de Exposições de Marília - Marília/SP',
    event_date: '2024-08-18',
    responsible_name: 'Pedro Oliveira',
    responsible_contact: '(14) 44444-1234',
    image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Evento B2B com foco em produtores rurais. Expectativa de 1.500 visitantes.',
    status: 'rascunho',
    created_by: 'admin-1',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z'
  },
  {
    id: '7',
    name: 'Leilão de Cavalos Quarto de Milha - Araçatuba',
    type: 'leilao',
    description: 'Leilão especializado em cavalos Quarto de Milha para trabalho e competição, com animais de linhagem comprovada e certificados de pedigree.',
    location: 'Haras do Vale - Araçatuba/SP',
    event_date: '2024-09-12',
    responsible_name: 'Fernanda Rocha',
    responsible_contact: '(18) 33333-5678',
    image_url: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Leilão premium com animais de alta qualidade. Expectativa de venda de R$ 800.000.',
    status: 'rascunho',
    created_by: 'admin-1',
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z'
  },
  {
    id: '8',
    name: 'Cavalgada do Peão - Presidente Prudente',
    type: 'cavalgada',
    description: 'Cavalgada tradicional em homenagem aos peões da região, com percurso de 20km pelas fazendas históricas. Inclui almoço típico, apresentações musicais e premiação dos melhores trajes.',
    location: 'Fazenda Santa Helena - Presidente Prudente/SP',
    event_date: '2024-10-05',
    responsible_name: 'José Carlos',
    responsible_contact: '(18) 22222-9012',
    image_url: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Evento cultural com 800 cavaleiros esperados. Inclui competição de trajes típicos.',
    status: 'rascunho',
    created_by: 'admin-1',
    created_at: '2024-02-25T00:00:00Z',
    updated_at: '2024-02-25T00:00:00Z'
  },
  {
    id: '9',
    name: 'Exposição de Gado Leiteiro - São José do Rio Preto',
    type: 'exposicao',
    description: 'Exposição especializada em gado leiteiro de alta produção, com julgamentos, palestras sobre manejo nutricional e demonstrações de ordenha mecânica.',
    location: 'Parque de Exposições de São José do Rio Preto - São José do Rio Preto/SP',
    event_date: '2024-11-08',
    responsible_name: 'Lucia Mendes',
    responsible_contact: '(17) 11111-3456',
    image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Evento técnico com foco em produtividade leiteira. Expectativa de 2.500 visitantes.',
    status: 'rascunho',
    created_by: 'admin-1',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z'
  },
  {
    id: '10',
    name: 'Feira de Ovinos e Caprinos - Franca',
    type: 'feira',
    description: 'Feira especializada em ovinos e caprinos, com julgamentos, palestras sobre manejo sanitário e exposição de produtos derivados. Inclui degustação de queijos artesanais.',
    location: 'Centro de Eventos de Franca - Franca/SP',
    event_date: '2024-12-14',
    responsible_name: 'Antonio Silva',
    responsible_contact: '(16) 99999-7890',
    image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    observations: 'Evento especializado com foco em pequenos ruminantes. Expectativa de 1.200 visitantes.',
    status: 'rascunho',
    created_by: 'admin-1',
    created_at: '2024-03-05T00:00:00Z',
    updated_at: '2024-03-05T00:00:00Z'
  }
];

// Avaliações de viabilidade de exemplo - DADOS FICTÍCIOS
let mockViabilityAssessments: ViabilityAssessment[] = [
  {
    id: '1',
    event_name: 'Exposição Agropecuária de Campinas 2024',
    location_adequate: true,
    estimated_audience: 5000,
    operational_costs: 45000,
    estimated_revenue: 75000,
    local_partnerships: true,
    environmental_impact_score: 8,
    location_score: 9,
    audience_score: 9,
    financial_score: 8,
    partnership_score: 9,
    total_score: 43,
    viability_level: 'alta',
    notes: 'Evento com excelente potencial. Local adequado, parcerias sólidas e expectativa de público alta. Recomendado para aprovação.',
    assessed_by: 'admin-1',
    created_at: '2024-01-16T00:00:00Z'
  },
  {
    id: '2',
    event_name: 'Feira de Cavalos Crioulos - Sorocaba',
    location_adequate: true,
    estimated_audience: 2000,
    operational_costs: 18000,
    estimated_revenue: 35000,
    local_partnerships: true,
    environmental_impact_score: 7,
    location_score: 8,
    audience_score: 8,
    financial_score: 7,
    partnership_score: 8,
    total_score: 38,
    viability_level: 'alta',
    notes: 'Evento tradicional com boa viabilidade. Público especializado e parcerias locais estabelecidas.',
    assessed_by: 'admin-1',
    created_at: '2024-01-21T00:00:00Z'
  },
  {
    id: '3',
    event_name: 'Leilão de Gado Nelore - Piracicaba',
    location_adequate: true,
    estimated_audience: 800,
    operational_costs: 25000,
    estimated_revenue: 200000,
    local_partnerships: true,
    environmental_impact_score: 6,
    location_score: 9,
    audience_score: 7,
    financial_score: 9,
    partnership_score: 8,
    total_score: 39,
    viability_level: 'alta',
    notes: 'Leilão premium com excelente retorno financeiro. Animais de alta qualidade garantem boa arrecadação.',
    assessed_by: 'admin-1',
    created_at: '2024-01-26T00:00:00Z'
  },
  {
    id: '4',
    event_name: 'Cavalgada da Tradição - Ribeirão Preto',
    location_adequate: true,
    estimated_audience: 500,
    operational_costs: 12000,
    estimated_revenue: 20000,
    local_partnerships: true,
    environmental_impact_score: 8,
    location_score: 7,
    audience_score: 6,
    financial_score: 6,
    partnership_score: 7,
    total_score: 34,
    viability_level: 'media',
    notes: 'Evento cultural com viabilidade média. Foco na tradição, mas com retorno financeiro limitado.',
    assessed_by: 'admin-1',
    created_at: '2024-02-02T00:00:00Z'
  },
  {
    id: '5',
    event_name: 'Exposição de Equipamentos Agrícolas - Bauru',
    location_adequate: true,
    estimated_audience: 3000,
    operational_costs: 35000,
    estimated_revenue: 55000,
    local_partnerships: false,
    environmental_impact_score: 7,
    location_score: 8,
    audience_score: 8,
    financial_score: 7,
    partnership_score: 5,
    total_score: 35,
    viability_level: 'media',
    notes: 'Evento técnico com boa audiência, mas falta de parcerias locais pode impactar o sucesso.',
    assessed_by: 'admin-1',
    created_at: '2024-02-11T00:00:00Z'
  }
];

// Mídia da galeria de exemplo - DADOS FICTÍCIOS EXPANDIDOS
export const mockGalleryMedia: GalleryMedia[] = [
  {
    id: '1',
    event_id: '1',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Exposição de gado Nelore na feira agropecuária de Campinas',
    display_order: 1,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    event_id: '1',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Visitantes conferindo os equipamentos agrícolas',
    display_order: 2,
    created_at: '2024-01-15T11:00:00Z'
  },
  {
    id: '3',
    event_id: '1',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Palestra técnica sobre manejo de pastagens',
    display_order: 3,
    created_at: '2024-01-15T14:00:00Z'
  },
  {
    id: '4',
    event_id: '2',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Cavalos crioulos premiados na feira de Sorocaba',
    display_order: 1,
    created_at: '2024-01-20T14:00:00Z'
  },
  {
    id: '5',
    event_id: '2',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Competição de laço durante a feira',
    display_order: 2,
    created_at: '2024-01-20T16:00:00Z'
  },
  {
    id: '6',
    event_id: '3',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Gado Nelore de elite no leilão de Piracicaba',
    display_order: 1,
    created_at: '2024-01-25T10:00:00Z'
  },
  {
    id: '7',
    event_id: '3',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Compradores avaliando os animais no leilão',
    display_order: 2,
    created_at: '2024-01-25T11:30:00Z'
  },
  {
    id: '8',
    event_id: '4',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Cavalgada da Tradição percorrendo as fazendas históricas',
    display_order: 1,
    created_at: '2024-02-01T08:00:00Z'
  },
  {
    id: '9',
    event_id: '4',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Almoço típico durante a cavalgada',
    display_order: 2,
    created_at: '2024-02-01T12:00:00Z'
  },
  {
    id: '10',
    event_id: '5',
    media_type: 'foto',
    media_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Tratores de última geração na exposição de Bauru',
    display_order: 1,
    created_at: '2024-02-10T09:00:00Z'
  }
];

// Mensagens de contato de exemplo - DADOS FICTÍCIOS REALISTAS
export const mockContactMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'Pedro Costa',
    email: 'pedro.costa@fazendasaojose.com.br',
    message: 'Gostaria de informações sobre como participar da próxima Exposição Agropecuária de Campinas. Tenho gado Nelore de alta qualidade e gostaria de expor. Qual o processo de inscrição e custos envolvidos?',
    status: 'novo',
    created_at: '2024-01-25T09:00:00Z'
  },
  {
    id: '2',
    name: 'Ana Ferreira',
    email: 'ana.ferreira@harasdovale.com.br',
    message: 'Tenho interesse em expor meus cavalos crioulos na feira de Sorocaba. Como posso me inscrever? Preciso de informações sobre os requisitos sanitários e documentação necessária.',
    status: 'lido',
    created_at: '2024-01-24T15:30:00Z'
  },
  {
    id: '3',
    name: 'Roberto Silva',
    email: 'roberto.silva@coopagronorte.com.br',
    message: 'Parabéns pela organização dos eventos! Excelente qualidade e profissionalismo. Gostaria de estabelecer uma parceria para patrocínio dos próximos eventos. Podemos agendar uma reunião?',
    status: 'respondido',
    created_at: '2024-01-23T11:20:00Z'
  },
  {
    id: '4',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    message: 'Sou produtora rural de pequeno porte e gostaria de participar da Cavalgada da Tradição. Qual o valor da inscrição e o que está incluído? Há desconto para grupos?',
    status: 'novo',
    created_at: '2024-01-26T14:15:00Z'
  },
  {
    id: '5',
    name: 'João Oliveira',
    email: 'joao.oliveira@equipamentosagro.com.br',
    message: 'Represento uma empresa de equipamentos agrícolas e gostaria de ser fornecedor dos eventos. Como funciona o processo de credenciamento? Quais são os requisitos?',
    status: 'lido',
    created_at: '2024-01-25T16:45:00Z'
  },
  {
    id: '6',
    name: 'Lucia Mendes',
    email: 'lucia.mendes@fazendaboa vista.com.br',
    message: 'Excelente trabalho na organização do leilão de gado Nelore! Os animais estavam de primeira qualidade. Quando será o próximo leilão? Tenho interesse em participar como compradora.',
    status: 'respondido',
    created_at: '2024-01-24T10:30:00Z'
  }
];

// Funções para simular operações CRUD
export const mockApi = {
  // Eventos
  getEvents: async (): Promise<Event[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('🔍 Carregando eventos:', mockEvents.length, 'eventos encontrados');
    return [...mockEvents];
  },

  createEvent: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  updateEvent: async (id: string, updates: Partial<Event>): Promise<Event> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...updates, updated_at: new Date().toISOString() };
      return mockEvents[index];
    }
    throw new Error('Evento não encontrado');
  },

  deleteEvent: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEvents.splice(index, 1);
    }
  },

  // Avaliações
  getViabilityAssessments: async (): Promise<ViabilityAssessment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockViabilityAssessments];
  },

  createViabilityAssessment: async (assessment: Omit<ViabilityAssessment, 'id' | 'created_at'>): Promise<ViabilityAssessment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAssessment: ViabilityAssessment = {
      ...assessment,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    mockViabilityAssessments.push(newAssessment);
    return newAssessment;
  },

  // Galeria
  getGalleryMedia: async (): Promise<GalleryMedia[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockGalleryMedia;
  },

  // Mensagens
  getContactMessages: async (): Promise<ContactMessage[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockContactMessages;
  },

  updateMessageStatus: async (id: string, status: ContactMessage['status']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const message = mockContactMessages.find(m => m.id === id);
    if (message) {
      message.status = status;
    }
  }
};
