/**
 * Cliente da API REST (PHP) - substitui dados mock.
 * Garante ids como string para compatibilidade com o frontend.
 */

import type {
  Event,
  EventFinancialItem,
  EventScenario,
  GalleryMedia,
  ViabilityAssessment,
  ContactMessage,
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
