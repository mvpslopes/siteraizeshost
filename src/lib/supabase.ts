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

export type EventType = 'exposicao' | 'feira' | 'leilao' | 'cavalgada';
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
  event_date: string;
  responsible_name: string;
  responsible_contact: string;
  image_url: string;
  observations: string;
  status: EventStatus;
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

export type FinancialCategory = 'infraestrutura' | 'marketing' | 'pessoal' | 'alimentacao' | 'transporte' | 'equipamentos' | 'ingressos' | 'patrocinios' | 'vendas' | 'parcerias' | 'governo' | 'outros';
export type FinancialType = 'custo' | 'receita';
export type PaymentStatus = 'pendente' | 'pago' | 'atrasado' | 'cancelado';

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
export type SupplierCategory = 'infraestrutura' | 'alimentacao' | 'equipamentos' | 'marketing' | 'transporte' | 'seguranca' | 'limpeza' | 'outros';
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

export interface Supplier {
  id: string;
  name: string;
  document: string; // CNPJ
  email: string;
  phone: string;
  category: SupplierCategory;
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
  services: string[];
  payment_terms: string;
  rating: number; // 1-5 estrelas
  notes?: string;
  total_contracts: number;
  total_value: number;
  last_contract_date?: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  created_by: string;
  created_at: string;
  updated_at: string;
}
