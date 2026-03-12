/**
 * Cliente da API REST (PHP) - substitui dados mock.
 * Garante ids como string para compatibilidade com o frontend.
 */

import type {
  Event,
  EventFinancialItem,
  EventScenario,
  EventBarItem,
  EventBarSale,
  GalleryMedia,
  ViabilityAssessment,
  ContactMessage,
  Supplier,
} from './supabase';

export interface ScenarioItemRow {
  financial_item_id: number;
  type: 'custo' | 'receita';
  name: string;
  description: string;
  base_amount: number;
  expected_amount: number | null;
}

const BASE = '/api';

function toEvent(row: Record<string, unknown>): Event {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    type: (row.type as Event['type']) ?? 'exposicao',
    description: String(row.description ?? ''),
    location: String(row.location ?? ''),
    start_date: String((row.start_date ?? row.event_date) ?? ''),
    end_date: String((row.end_date ?? row.event_date) ?? ''),
    event_date: String(row.event_date ?? ''),
    responsible_name: String(row.responsible_name ?? ''),
    responsible_contact: String(row.responsible_contact ?? ''),
    image_url: String(row.image_url ?? ''),
    observations: String(row.observations ?? ''),
    status: (row.status as Event['status']) ?? 'rascunho',
    chosen_scenario_id:
      row.chosen_scenario_id != null ? String(row.chosen_scenario_id) : null,
    created_by: row.created_by != null ? String(row.created_by) : '',
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  };
}

function toFinancialItem(row: Record<string, unknown>): EventFinancialItem {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    type: (row.type as EventFinancialItem['type']) ?? 'custo',
    nature: (row.nature as EventFinancialItem['nature']) ?? 'fixa',
    name: String(row.name ?? ''),
    description: String(row.description ?? ''),
    category: row.category != null ? String(row.category) : undefined,
    base_amount: row.base_amount != null ? Number(row.base_amount) : undefined,
    percentage_over_revenue:
      row.percentage_over_revenue != null
        ? Number(row.percentage_over_revenue)
        : undefined,
    payment_status: (row.payment_status as EventFinancialItem['payment_status']) ?? 'previsto',
    due_date: row.due_date != null ? String(row.due_date) : undefined,
    payment_date: row.payment_date != null ? String(row.payment_date) : undefined,
    partner: row.partner != null ? String(row.partner) : undefined,
    notes: row.notes != null ? String(row.notes) : undefined,
  };
}

function toScenario(row: Record<string, unknown>): EventScenario {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    code: String(row.code ?? ''),
    name: String(row.name ?? ''),
    expected_revenue: Number(row.expected_revenue ?? 0),
  };
}

function toBarItem(row: Record<string, unknown>): EventBarItem {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    supplier_id: row.supplier_id != null ? String(row.supplier_id) : null,
    supplier_name: row.supplier_name != null ? String(row.supplier_name) : null,
    name: String(row.name ?? ''),
    description: String(row.description ?? ''),
    category: (row.category as EventBarItem['category']) ?? 'outros',
    unit: (row.unit as EventBarItem['unit']) ?? 'un',
    quantity_stock: Number(row.quantity_stock ?? 0),
    unit_price: Number(row.unit_price ?? 0),
    unit_cost: row.unit_cost != null ? Number(row.unit_cost) : null,
    quantity_sold: Number(row.quantity_sold ?? 0),
    min_stock: row.min_stock != null ? Number(row.min_stock) : null,
    closed_at: row.closed_at != null ? String(row.closed_at) : null,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  };
}

function toSupplier(row: Record<string, unknown>): Supplier {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    category: row.category != null ? String(row.category) : undefined,
    document: row.document != null ? String(row.document) : undefined,
    legal_name: row.legal_name != null ? String(row.legal_name) : undefined,
    address: row.address != null ? String(row.address) : undefined,
    responsible_name:
      row.responsible_name != null ? String(row.responsible_name) : undefined,
    email: row.email != null ? String(row.email) : undefined,
    phone: row.phone != null ? String(row.phone) : undefined,
    bank_info: row.bank_info != null ? String(row.bank_info) : undefined,
    notes: row.notes != null ? String(row.notes) : undefined,
    status: row.status != null ? (String(row.status) as Supplier['status']) : undefined,
    created_at: row.created_at != null ? String(row.created_at) : undefined,
    updated_at: row.updated_at != null ? String(row.updated_at) : undefined,
  };
}

function toBarSale(row: Record<string, unknown>): EventBarSale {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    bar_item_id: String(row.bar_item_id),
    quantity: Number(row.quantity ?? 0),
    unit_price: Number(row.unit_price ?? 0),
    total: Number(row.total ?? 0),
    sold_at: String(row.sold_at ?? row.created_at ?? ''),
    created_at: String(row.created_at ?? ''),
    item_name: row.item_name != null ? String(row.item_name) : undefined,
    item_unit: row.item_unit != null ? String(row.item_unit) : undefined,
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Resposta inválida do servidor');
  }
}

export const api = {
  async getEvents(): Promise<Event[]> {
    const res = await fetch(`${BASE}/events.php`);
    const data = await parseJson<{ events?: Record<string, unknown>[] }>(res);
    const list = Array.isArray(data.events) ? data.events : [];
    return list.map(toEvent);
  },

  async createEvent(
    body: Omit<Event, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Event> {
    const res = await fetch(`${BASE}/events.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await parseJson<{ event?: Record<string, unknown> }>(res);
    if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Erro ao criar evento');
    return toEvent(data.event ?? {});
  },

  async updateEvent(
    id: string,
    updates: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Event> {
    const res = await fetch(`${BASE}/events.php?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await parseJson<{ event?: Record<string, unknown> }>(res);
    if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Erro ao atualizar evento');
    return toEvent(data.event ?? {});
  },

  async deleteEvent(id: string): Promise<void> {
    const res = await fetch(`${BASE}/events.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await parseJson<{ error?: string }>(res);
      throw new Error(data.error ?? 'Erro ao excluir evento');
    }
  },

  async getEventFinancialItems(eventId: string): Promise<EventFinancialItem[]> {
    const res = await fetch(
      `${BASE}/financial_items.php?event_id=${encodeURIComponent(eventId)}`
    );
    const data = await parseJson<{ items?: Record<string, unknown>[] }>(res);
    const list = Array.isArray(data.items) ? data.items : [];
    return list.map(toFinancialItem);
  },

  async createEventFinancialItem(
    eventId: string,
    body: Omit<EventFinancialItem, 'id'>
  ): Promise<EventFinancialItem> {
    const res = await fetch(
      `${BASE}/financial_items.php?event_id=${encodeURIComponent(eventId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const data = await parseJson<{ item?: Record<string, unknown> }>(res);
    if (!res.ok)
      throw new Error((data as { error?: string }).error ?? 'Erro ao criar item');
    return toFinancialItem(data.item ?? {});
  },

  async updateEventFinancialItem(
    id: string,
    updates: Partial<EventFinancialItem>,
    eventId: string
  ): Promise<EventFinancialItem> {
    const res = await fetch(
      `${BASE}/financial_items.php?event_id=${encodeURIComponent(eventId)}&id=${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );
    const data = await parseJson<{ item?: Record<string, unknown> }>(res);
    if (!res.ok)
      throw new Error((data as { error?: string }).error ?? 'Erro ao atualizar item');
    return toFinancialItem(data.item ?? {});
  },

  async deleteEventFinancialItem(id: string, eventId: string): Promise<void> {
    const res = await fetch(
      `${BASE}/financial_items.php?event_id=${encodeURIComponent(eventId)}&id=${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    );
    if (!res.ok) {
      const data = await parseJson<{ error?: string }>(res);
      throw new Error(data.error ?? 'Erro ao excluir item');
    }
  },

  async getEventScenarios(eventId: string): Promise<EventScenario[]> {
    const res = await fetch(
      `${BASE}/scenarios.php?event_id=${encodeURIComponent(eventId)}`
    );
    const data = await parseJson<{ scenarios?: Record<string, unknown>[] }>(res);
    const list = Array.isArray(data.scenarios) ? data.scenarios : [];
    return list.map(toScenario);
  },

  async createEventScenario(
    eventId: string,
    body: Omit<EventScenario, 'id'>
  ): Promise<EventScenario> {
    const res = await fetch(
      `${BASE}/scenarios.php?event_id=${encodeURIComponent(eventId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const data = await parseJson<{ scenario?: Record<string, unknown> }>(res);
    if (!res.ok)
      throw new Error((data as { error?: string }).error ?? 'Erro ao criar cenário');
    return toScenario(data.scenario ?? {});
  },

  async updateEventScenario(
    id: string,
    updates: Partial<EventScenario>,
    eventId: string
  ): Promise<EventScenario> {
    const res = await fetch(
      `${BASE}/scenarios.php?event_id=${encodeURIComponent(eventId)}&id=${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );
    const data = await parseJson<{ scenario?: Record<string, unknown> }>(res);
    if (!res.ok)
      throw new Error((data as { error?: string }).error ?? 'Erro ao atualizar cenário');
    return toScenario(data.scenario ?? {});
  },

  async deleteEventScenario(id: string, eventId: string): Promise<void> {
    const res = await fetch(
      `${BASE}/scenarios.php?event_id=${encodeURIComponent(eventId)}&id=${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    );
    if (!res.ok) {
      const data = await parseJson<{ error?: string }>(res);
      throw new Error(data.error ?? 'Erro ao excluir cenário');
    }
  },

  /** Itens do cenário com valor previsto por item (comparativo). expected_amount null = usa base_amount */
  async getScenarioItems(scenarioId: string): Promise<ScenarioItemRow[]> {
    const res = await fetch(
      `${BASE}/scenario_items.php?scenario_id=${encodeURIComponent(scenarioId)}`
    );
    const data = await parseJson<{ items?: ScenarioItemRow[] }>(res);
    return Array.isArray(data.items) ? data.items : [];
  },

  async updateScenarioItems(
    scenarioId: string,
    items: { financial_item_id: number; expected_amount: number }[]
  ): Promise<void> {
    const res = await fetch(
      `${BASE}/scenario_items.php?scenario_id=${encodeURIComponent(scenarioId)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      }
    );
    if (!res.ok) {
      const data = await parseJson<{ error?: string }>(res);
      throw new Error(data.error ?? 'Erro ao salvar valores');
    }
  },

  async getBarItems(eventId: string): Promise<EventBarItem[]> {
    const res = await fetch(
      `${BASE}/bar_items.php?event_id=${encodeURIComponent(eventId)}`
    );
    const data = await parseJson<{ items?: Record<string, unknown>[] }>(res);
    const list = Array.isArray(data.items) ? data.items : [];
    return list.map(toBarItem);
  },

  async createBarItem(
    eventId: string,
    body: Omit<EventBarItem, 'id' | 'event_id' | 'created_at' | 'updated_at'>
  ): Promise<EventBarItem> {
    const res = await fetch(
      `${BASE}/bar_items.php?event_id=${encodeURIComponent(eventId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, event_id: eventId }),
      }
    );
    const data = await parseJson<{ item?: Record<string, unknown> }>(res);
    if (!res.ok)
      throw new Error((data as { error?: string }).error ?? 'Erro ao criar item do bar');
    return toBarItem(data.item ?? {});
  },

  async updateBarItem(
    id: string,
    eventId: string,
    updates: Partial<Omit<EventBarItem, 'id' | 'event_id' | 'created_at' | 'updated_at'>>
  ): Promise<EventBarItem> {
    const res = await fetch(
      `${BASE}/bar_items.php?event_id=${encodeURIComponent(eventId)}&id=${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );
    const data = await parseJson<{ item?: Record<string, unknown> }>(res);
    if (!res.ok)
      throw new Error((data as { error?: string }).error ?? 'Erro ao atualizar item do bar');
    return toBarItem(data.item ?? {});
  },

  async deleteBarItem(id: string, eventId: string): Promise<void> {
    const res = await fetch(
      `${BASE}/bar_items.php?event_id=${encodeURIComponent(eventId)}&id=${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    );
    if (!res.ok) {
      const data = await parseJson<{ error?: string }>(res);
      throw new Error(data.error ?? 'Erro ao excluir item do bar');
    }
  },

  async getBarSales(eventId: string, barItemId?: string): Promise<EventBarSale[]> {
    const url = barItemId
      ? `${BASE}/bar_sales.php?event_id=${encodeURIComponent(eventId)}&bar_item_id=${encodeURIComponent(barItemId)}`
      : `${BASE}/bar_sales.php?event_id=${encodeURIComponent(eventId)}`;
    const res = await fetch(url);
    const data = await parseJson<{ sales?: Record<string, unknown>[] }>(res);
    const list = Array.isArray(data.sales) ? data.sales : [];
    return list.map(toBarSale);
  },

  async createBarSale(
    eventId: string,
    body: { bar_item_id: string; quantity: number; unit_price?: number; sold_at?: string }
  ): Promise<EventBarSale> {
    const res = await fetch(
      `${BASE}/bar_sales.php?event_id=${encodeURIComponent(eventId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const data = await parseJson<{ sale?: Record<string, unknown>; error?: string }>(res);
    if (!res.ok) throw new Error(data.error ?? 'Erro ao registrar venda');
    return toBarSale(data.sale ?? {});
  },

  async deleteBarSale(saleId: string, eventId: string): Promise<void> {
    const res = await fetch(
      `${BASE}/bar_sales.php?event_id=${encodeURIComponent(eventId)}&id=${encodeURIComponent(saleId)}`,
      { method: 'DELETE' }
    );
    if (!res.ok) {
      const data = await parseJson<{ error?: string }>(res);
      throw new Error(data.error ?? 'Erro ao excluir venda');
    }
  },

  /** Cria ou atualiza a receita "Receita Bar" no evento com o total das vendas do bar. */
  async syncReceitaBar(eventId: string, totalReceitaBar: number): Promise<EventFinancialItem> {
    const items = await this.getEventFinancialItems(eventId);
    const receitaBar = items.find(
      (i) => i.type === 'receita' && i.name.toLowerCase().includes('receita bar')
    );
    const payload = {
      event_id: eventId,
      type: 'receita' as const,
      nature: 'fixa' as const,
      name: 'Receita Bar',
      description: 'Receita do bar do evento (atualizado pelo Estoque Bar).',
      base_amount: totalReceitaBar,
      payment_status: 'previsto' as const,
    };
    if (receitaBar) {
      return this.updateEventFinancialItem(
        receitaBar.id,
        { name: payload.name, description: payload.description, base_amount: payload.base_amount },
        eventId
      );
    }
    return this.createEventFinancialItem(eventId, payload);
  },

  // Fornecedores (cadastro geral)
  async getSuppliers(): Promise<Supplier[]> {
    const res = await fetch(`${BASE}/suppliers.php`);
    const data = await parseJson<{ suppliers?: Record<string, unknown>[] }>(res);
    const list = Array.isArray(data.suppliers) ? data.suppliers : [];
    return list.map(toSupplier);
  },

  async createSupplier(
    body: Pick<Supplier, 'name'> &
      Partial<
        Pick<
          Supplier,
          | 'category'
          | 'document'
          | 'legal_name'
          | 'address'
          | 'responsible_name'
          | 'email'
          | 'phone'
          | 'bank_info'
          | 'notes'
          | 'status'
        >
      >
  ): Promise<Supplier> {
    const res = await fetch(`${BASE}/suppliers.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await parseJson<{ supplier?: Record<string, unknown>; error?: string }>(res);
    if (!res.ok) throw new Error(data.error ?? 'Erro ao criar fornecedor');
    return toSupplier(data.supplier ?? {});
  },

  async updateSupplier(
    id: string,
    updates: Partial<
      Pick<
        Supplier,
        | 'name'
        | 'category'
        | 'document'
        | 'legal_name'
        | 'address'
        | 'responsible_name'
        | 'email'
        | 'phone'
        | 'bank_info'
        | 'notes'
        | 'status'
      >
    >
  ): Promise<Supplier> {
    const res = await fetch(`${BASE}/suppliers.php?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await parseJson<{ supplier?: Record<string, unknown>; error?: string }>(res);
    if (!res.ok) throw new Error(data.error ?? 'Erro ao atualizar fornecedor');
    return toSupplier(data.supplier ?? {});
  },

  async deleteSupplier(id: string): Promise<void> {
    const res = await fetch(`${BASE}/suppliers.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await parseJson<{ error?: string }>(res);
      throw new Error(data.error ?? 'Erro ao excluir fornecedor');
    }
  },

  // Sem backend ainda – retornam vazio
  async getViabilityAssessments(): Promise<ViabilityAssessment[]> {
    return [];
  },

  async getGalleryMedia(): Promise<GalleryMedia[]> {
    return [];
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    return [];
  },
};
