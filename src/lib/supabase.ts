import { createClient } from '@supabase/supabase-js';

// Suporta variáveis de ambiente (desenvolvimento) e configuração via window (produção)
// Para produção na Hostinger, crie um arquivo config.js na pasta public
declare global {
  interface Window {
    APP_CONFIG?: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    };
  }
}

const supabaseUrl = 
  (typeof window !== 'undefined' && window.APP_CONFIG?.VITE_SUPABASE_URL) ||
  import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey = 
  (typeof window !== 'undefined' && window.APP_CONFIG?.VITE_SUPABASE_ANON_KEY) ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

// Só inicializa o Supabase se as variáveis de ambiente estiverem disponíveis
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type EventType = 'exposicao' | 'copa' | 'poerao' | 'feira' | 'live' | 'leilao';
export type EventStatus = 'rascunho' | 'publicado' | 'concluido' | 'cancelado';
export type UserRole = 'admin' | 'colaborador' | 'avaliador';
export type ViabilityLevel = 'baixa' | 'media' | 'alta';
export type MediaType = 'foto' | 'video';
export type MessageStatus = 'novo' | 'lido' | 'respondido';

export interface Event {
  id: string;
  name: string;
  type: EventType;
  description: string;
  location: string;
  /** Data e hora de início do evento */
  start_date: string;
  /** Data e hora de término do evento */
  end_date: string;
  /** Campo legado mantido para compatibilidade; use start_date/end_date no restante do sistema */
  event_date: string;
  responsible_name: string;
  responsible_contact: string;
  image_url: string;
  observations: string;
  status: EventStatus;
  /** Cenário usado como plano do evento (Gestão de Eventos / pagamentos). */
  chosen_scenario_id?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ViabilityAssessment {
  id: string;
  event_name: string;
  location_adequate: boolean;
  estimated_audience: number;
  operational_costs: number;
  estimated_revenue: number;
  local_partnerships: boolean;
  environmental_impact_score: number;
  location_score: number;
  audience_score: number;
  financial_score: number;
  partnership_score: number;
  total_score: number;
  viability_level: ViabilityLevel;
  notes: string;
  assessed_by: string;
  created_at: string;
}

export interface GalleryMedia {
  id: string;
  event_id: string | null;
  media_type: MediaType;
  media_url: string;
  caption: string;
  display_order: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export type FinancialCategory =
  | 'infraestrutura'
  | 'marketing'
  | 'pessoal'
  | 'alimentacao'
  | 'transporte'
  | 'equipamentos'
  | 'ingressos'
  | 'patrocinios'
  | 'vendas'
  | 'parcerias'
  | 'governo'
  | 'outros';

export type FinancialType = 'custo' | 'receita';

// Inclui "previsto" para planejamento financeiro de cenários
export type PaymentStatus = 'previsto' | 'pendente' | 'pago' | 'atrasado' | 'cancelado';

export type FinancialNature = 'fixa' | 'variavel';

export interface FinancialTransaction {
  id: string;
  event_id: string;
  type: FinancialType;
  category: FinancialCategory;
  description: string;
  amount: number;
  payment_status: PaymentStatus;
  due_date: string;
  payment_date?: string;
  vendor?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Planejamento financeiro por evento (itens e cenários)

export interface EventFinancialItem {
  id: string;
  event_id: string;
  type: FinancialType;           // custo ou receita
  nature: FinancialNature;       // fixa ou variavel
  name: string;                  // ex.: Buffet, Inscrição embriões
  description: string;           // descrição detalhada
  category?: string;             // categoria livre (Buffet, Empresa Leiloeira, etc.)
  base_amount?: number;          // valor fixo em R$ (para natureza = fixa)
  percentage_over_revenue?: number; // percentual do faturamento (0.05 = 5%), para variavel
  payment_status: PaymentStatus; // previsto/pendente/pago/atrasado/cancelado
  due_date?: string;
  payment_date?: string;
  partner?: string;              // fornecedor/cliente (Grupo Raça, Empresa Leiloeira, etc.)
  notes?: string;
}

export interface EventScenario {
  id: string;
  event_id: string;
  code: string;              // A, B, C...
  name: string;              // Cenário A, Cenário B...
  expected_revenue: number;  // faturamento previsto do cenário
}

export interface FinancialReport {
  event_id: string;
  total_costs: number;
  total_revenues: number;
  net_profit: number;
  profit_margin: number;
  cost_breakdown: Record<FinancialCategory, number>;
  revenue_breakdown: Record<FinancialCategory, number>;
  generated_at: string;
}

export type ClientType = 'pessoa_fisica' | 'pessoa_juridica';
export type SupplierCategory =
  | 'infraestrutura'
  | 'alimentacao'
  | 'equipamentos'
  | 'marketing'
  | 'transporte'
  | 'seguranca'
  | 'limpeza'
  | 'outros';
export type ContactType = 'telefone' | 'email' | 'whatsapp' | 'site';

export interface Contact {
  id: string;
  type: ContactType;
  value: string;
  is_primary: boolean;
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  document: string; // CPF ou CNPJ
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contacts: Contact[];
  notes?: string;
  total_events: number;
  total_spent: number;
  last_event_date?: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  created_by: string;
  created_at: string;
  updated_at: string;
}

/**
 * Cadastro geral de fornecedores (fora do contexto de um evento específico).
 * A tabela no backend pode ser mais simples; os campos extras são opcionais.
 */
export interface Supplier {
  id: string;
  /** Nome curto para exibição (FORNECEDOR) */
  name: string;
  /** Categoria do fornecedor: CREPE, AÇAÍ, HAMBURGUER, etc. */
  category?: SupplierCategory | string;
  /** CNPJ ou CPF */
  document?: string;
  /** Razão Social ou Nome fantasia completo */
  legal_name?: string;
  /** Endereço completo em uma string */
  address?: string;
  /** Nome do responsável de contato */
  responsible_name?: string;
  email?: string;
  phone?: string;
  /** Conta / dados de depósito, transferência ou PIX */
  bank_info?: string;
  /** Observações gerais adicionais */
  notes?: string;
  status?: 'ativo' | 'inativo' | 'suspenso';
  created_at?: string;
  updated_at?: string;
}

/** Categorias do bar */
export type BarItemCategory = 'bebidas' | 'comidas' | 'outros';

/** Unidade de medida do item do bar */
export type BarItemUnit = 'un' | 'cx' | 'garrafa' | 'litro' | 'dose' | 'outro';

/** Item do bar (cadastro + estoque) por evento */
export interface EventBarItem {
  id: string;
  event_id: string;
  /** Fornecedor responsável por este item no evento (opcional para manter compatibilidade com dados antigos) */
  supplier_id?: string | null;
  /** Nome do fornecedor já resolvido pelo backend (join) para exibição rápida */
  supplier_name?: string | null;
  name: string;
  description: string;
  category: BarItemCategory;
  unit: BarItemUnit;
  quantity_stock: number;
  unit_price: number;
  unit_cost: number | null;
  quantity_sold: number;
  min_stock: number | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Lançamento de venda do bar (uma venda = um registro; dá baixa no estoque) */
export interface EventBarSale {
  id: string;
  event_id: string;
  bar_item_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  sold_at: string;
  created_at: string;
  item_name?: string;
  item_unit?: string;
}
