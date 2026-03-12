import { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  XCircle,
  Download,
  Lock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Building2,
} from 'lucide-react';
import {
  Event,
  EventBarItem,
  EventBarSale,
  BarItemCategory,
  BarItemUnit,
  Supplier,
} from '../../lib/supabase';
import { api } from '../../lib/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const CATEGORIAS: { value: BarItemCategory; label: string }[] = [
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'comidas', label: 'Comidas' },
  { value: 'outros', label: 'Outros' },
];

const UNIDADES: { value: BarItemUnit; label: string }[] = [
  { value: 'un', label: 'Unidade' },
  { value: 'cx', label: 'Caixa' },
  { value: 'garrafa', label: 'Garrafa' },
  { value: 'litro', label: 'Litro' },
  { value: 'dose', label: 'Dose' },
  { value: 'outro', label: 'Outro' },
];

const RECEITA_BAR_NAME = 'Receita Bar';

type FormState = {
  name: string;
  description: string;
  category: BarItemCategory;
  unit: BarItemUnit;
  supplier_id: string;
  quantity_stock: number;
  unit_price: number;
  unit_cost: number | null;
  quantity_sold: number;
  min_stock: number | null;
};

const emptyForm: FormState = {
  name: '',
  description: '',
  category: 'outros',
  unit: 'un',
  supplier_id: '',
  quantity_stock: 0,
  unit_price: 0,
  unit_cost: null,
  quantity_sold: 0,
  min_stock: null,
};

export default function EstoqueBar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [items, setItems] = useState<EventBarItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EventBarItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [closing, setClosing] = useState(false);
  const [sales, setSales] = useState<EventBarSale[]>([]);
  const [tab, setTab] = useState<'produtos' | 'vendas'>('produtos');
  const [saleItem, setSaleItem] = useState<EventBarItem | null>(null);
  const [saleQty, setSaleQty] = useState<string>('');
  const [saleDate, setSaleDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 16)
  );
  const [savingSale, setSavingSale] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState<{
    name: string;
    category: string;
    document: string;
    legal_name: string;
    address: string;
    responsible_name: string;
    email: string;
    phone: string;
    bank_info: string;
    notes: string;
  }>({
    name: '',
    category: '',
    document: '',
    legal_name: '',
    address: '',
    responsible_name: '',
    email: '',
    phone: '',
    bank_info: '',
    notes: '',
  });
  const [savingSupplier, setSavingSupplier] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getEvents(),
      api.getSuppliers().catch((err) => {
        console.error(err);
        return [];
      }),
    ])
      .then(([eventsData, suppliersData]) => {
        setEvents(
          eventsData.sort(
            (a, b) =>
              new Date(b.start_date || b.event_date).getTime() -
              new Date(a.start_date || a.event_date).getTime()
          )
        );
        setSuppliers(suppliersData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedEvent) {
      setItems([]);
      setSales([]);
      return;
    }
    api.getBarItems(selectedEvent.id).then(setItems).catch(console.error);
    api.getBarSales(selectedEvent.id).then(setSales).catch(() => setSales([]));
  }, [selectedEvent?.id]);

  const handleEventSelect = (eventId: string) => {
    const event = events.find((e) => e.id === eventId) ?? null;
    setSelectedEvent(event);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '';

  const itemsFiltrados =
    selectedSupplierId && selectedSupplierId !== 'all'
      ? items.filter((i) => i.supplier_id === selectedSupplierId)
      : items;
  const barItemIdsFiltrados = new Set(itemsFiltrados.map((i) => i.id));
  const salesFiltradas =
    selectedSupplierId && selectedSupplierId !== 'all'
      ? sales.filter((s) => barItemIdsFiltrados.has(s.bar_item_id))
      : sales;

  const selectedSupplier =
    selectedSupplierId && selectedSupplierId !== 'all'
      ? suppliers.find((s) => s.id === selectedSupplierId) ?? null
      : null;

  // Receita do bar = valor total dos lançamentos de venda (fonte: tabela de vendas)
  const receitaRealizada =
    salesFiltradas.length > 0
      ? salesFiltradas.reduce((s, v) => s + v.total, 0)
      : itemsFiltrados.reduce(
          (s, i) => s + (i.quantity_sold || 0) * (i.unit_price || 0),
          0
        );
  const custoTotal = itemsFiltrados.reduce(
    (s, i) => s + (i.quantity_sold || 0) * (i.unit_cost ?? 0),
    0
  );
  const lucroBar = receitaRealizada - custoTotal;
  const margemPercent = receitaRealizada > 0 ? (lucroBar / receitaRealizada) * 100 : 0;

  const barFechado =
    itemsFiltrados.length > 0 && itemsFiltrados.every((i) => i.closed_at);
  const estoqueAtual = (item: EventBarItem) => (item.quantity_stock || 0) - (item.quantity_sold || 0);
  const lowStockItems = itemsFiltrados.filter(
    (i) => i.min_stock != null && estoqueAtual(i) < i.min_stock
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    if (!form.name.trim() || form.unit_price < 0) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || '',
        category: form.category,
        unit: form.unit,
        supplier_id: form.supplier_id || null,
        quantity_stock: form.quantity_stock,
        unit_price: form.unit_price,
        unit_cost: form.unit_cost ?? undefined,
        min_stock: form.min_stock ?? undefined,
      };
      if (editingItem) {
        const updated = await api.updateBarItem(editingItem.id, selectedEvent.id, payload);
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      } else {
        const created = await api.createBarItem(selectedEvent.id, { ...payload, quantity_sold: 0 });
        setItems((prev) => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleEdit = (item: EventBarItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description || '',
      category: item.category,
      unit: item.unit,
      supplier_id: item.supplier_id || '',
      quantity_stock: item.quantity_stock,
      unit_price: item.unit_price,
      unit_cost: item.unit_cost ?? null,
      quantity_sold: item.quantity_sold,
      min_stock: item.min_stock ?? null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!selectedEvent) return;
    if (!confirm('Excluir este item do bar? O produto será removido. Os lançamentos de venda deste item deixarão de aparecer na aba Vendas.')) return;
    try {
      await api.deleteBarItem(id, selectedEvent.id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      const updatedSales = await api.getBarSales(selectedEvent.id);
      setSales(updatedSales);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir.');
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    if (!selectedEvent) return;
    if (!confirm('Excluir este lançamento de venda? A quantidade será devolvida ao estoque do produto.')) return;
    try {
      await api.deleteBarSale(saleId, selectedEvent.id);
      setSales((prev) => prev.filter((s) => s.id !== saleId));
      const updatedItems = await api.getBarItems(selectedEvent.id);
      setItems(updatedItems);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir venda.');
    }
  };

  const handleSyncReceita = async () => {
    if (!selectedEvent) return;
    setSyncing(true);
    try {
      await api.syncReceitaBar(selectedEvent.id, receitaRealizada);
      alert('Receita do bar incluída/atualizada no evento (Simulações / Gestão de Eventos).');
    } catch (err) {
      console.error(err);
      alert('Erro ao sincronizar receita.');
    } finally {
      setSyncing(false);
    }
  };

  const handleRegistrarVenda = async () => {
    if (!selectedEvent || !saleItem) return;
    const qty = parseFloat(saleQty.replace(',', '.'));
    if (!Number.isFinite(qty) || qty <= 0) {
      alert('Informe uma quantidade válida.');
      return;
    }
    const atual = estoqueAtual(saleItem);
    if (qty > atual) {
      if (!confirm(`Estoque atual é ${atual}. Deseja mesmo registrar venda de ${qty}? (ficará negativo)`)) return;
    }
    setSavingSale(true);
    try {
      const soldAt = saleDate.trim()
        ? `${saleDate.replace('T', ' ')}:00`.slice(0, 19)
        : undefined;
      const newSale = await api.createBarSale(selectedEvent.id, {
        bar_item_id: saleItem.id,
        quantity: qty,
        sold_at: soldAt,
      });
      setSales((prev) => [newSale, ...prev]);
      const updatedItems = await api.getBarItems(selectedEvent.id);
      setItems(updatedItems);
      setSaleItem(null);
      setSaleQty('');
      setSaleDate(new Date().toISOString().slice(0, 16));
      setShowSaleModal(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar venda.');
    } finally {
      setSavingSale(false);
    }
  };

  const handleFecharBar = async () => {
    if (!selectedEvent || itemsFiltrados.length === 0) return;
    if (!confirm('Fechar o bar deste evento? As quantidades vendidas ficarão bloqueadas para edição.')) return;
    setClosing(true);
    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      for (const item of itemsFiltrados) {
        if (!item.closed_at) {
          const updated = await api.updateBarItem(item.id, selectedEvent.id, { closed_at: now });
          setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao fechar bar.');
    } finally {
      setClosing(false);
    }
  };

  const handleExportExcel = () => {
    if (!selectedEvent) return;
    const rows = [
      ['Item', 'Descrição', 'Categoria', 'Unidade', 'Qtd estoque', 'Est. mín', 'Valor unit.', 'Custo unit.', 'Qtd vendida', 'Subtotal'],
      ...itemsFiltrados.map((i) => [
        i.name,
        i.description || '',
        i.category,
        i.unit,
        i.quantity_stock,
        i.min_stock ?? '',
        i.unit_price,
        i.unit_cost ?? '',
        i.quantity_sold,
        (i.quantity_sold || 0) * (i.unit_price || 0),
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Produtos & Vendas');

    const baseName = selectedEvent.name.replace(/\s+/g, '-').toLowerCase();
    const supplierSlug = selectedSupplier?.name
      ? `-${selectedSupplier.name.replace(/\s+/g, '-').toLowerCase()}`
      : '';

    XLSX.writeFile(wb, `produtos-vendas-${baseName}${supplierSlug}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!selectedEvent) return;
    const doc = new jsPDF('p', 'mm', 'a4');
    const primary = [109, 122, 68];
    const secondary = [242, 147, 51];
    doc.setFillColor(...primary);
    doc.rect(0, 0, 210, 36, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Produtos & Vendas – Relatório', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Evento: ${selectedEvent.name}`, 14, 26);
    let y = 48;
    if (selectedSupplier?.name) {
      doc.text(`Fornecedor: ${selectedSupplier.name}`, 14, 32);
      doc.text(
        `Data: ${formatDate(selectedEvent.start_date || selectedEvent.event_date)}`,
        14,
        38
      );
      y = 50;
    } else {
      doc.text(
        `Data: ${formatDate(selectedEvent.start_date || selectedEvent.event_date)}`,
        14,
        32
      );
      y = 48;
    }

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Receita realizada: ${formatCurrency(receitaRealizada)}`, 14, y);
    y += 6;
    doc.text(`Custo total: ${formatCurrency(custoTotal)}`, 14, y);
    y += 6;
    doc.text(`Lucro: ${formatCurrency(lucroBar)} | Margem: ${margemPercent.toFixed(1)}%`, 14, y);
    y += 12;

    doc.setFillColor(240, 240, 240);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const headers = ['Item', 'Categoria', 'Qtd vendida', 'Valor unit.', 'Subtotal'];
    const colW = [60, 25, 25, 30, 30];
    let x = 14;
    headers.forEach((h, i) => {
      doc.rect(x, y, colW[i], 7, 'F');
      doc.text(h, x + 2, y + 4.5);
      x += colW[i];
    });
    y += 7;
    doc.setFont('helvetica', 'normal');
    itemsFiltrados.forEach((i) => {
      const subtotal = (i.quantity_sold || 0) * (i.unit_price || 0);
      doc.text(i.name.slice(0, 35), 16, y + 4);
      doc.text(i.category, 76, y + 4);
      doc.text(String(i.quantity_sold), 101, y + 4);
      doc.text(formatCurrency(i.unit_price), 126, y + 4);
      doc.text(formatCurrency(subtotal), 156, y + 4);
      y += 6;
    });

    const baseName = selectedEvent.name.replace(/\s+/g, '-').toLowerCase();
    const supplierSlug = selectedSupplier?.name
      ? `-${selectedSupplier.name.replace(/\s+/g, '-').toLowerCase()}`
      : '';
    doc.save(`produtos-vendas-${baseName}${supplierSlug}.pdf`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <Package className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-800">Produtos & Vendas do Evento</h1>
        {selectedEvent && itemsFiltrados.length > 0 && (
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-4 py-2 rounded-lg border border-primary-200 text-primary-700 text-sm font-medium hover:bg-primary-50"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Excel
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
            >
              <Download className="w-4 h-4 inline mr-1" />
              PDF
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-primary-600 font-medium mb-2">Selecionar Evento</label>
        <select
          value={selectedEvent?.id ?? ''}
          onChange={(e) => handleEventSelect(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
        >
          <option value="">Selecione um evento...</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name} – {formatDate(ev.start_date || ev.event_date)}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-primary-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Fornecedores deste evento</h2>
                <p className="text-sm text-gray-600">
                  Selecione um fornecedor para ver o estoque de produtos e as vendas vinculadas a ele.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">Todos os fornecedores</option>
                  {suppliers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSupplier(null);
                    setSupplierForm({
                      name: '',
                      category: '',
                      document: '',
                      legal_name: '',
                      address: '',
                      responsible_name: '',
                      email: '',
                      phone: '',
                      bank_info: '',
                      notes: '',
                    });
                    setShowSupplierModal(true);
                  }}
                  className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo fornecedor
                </button>
              </div>
            </div>
          </div>

          {lowStockItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Estoque baixo:</strong> {lowStockItems.map((i) => i.name).join(', ')} (abaixo do mínimo).
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-4">
              <p className="text-sm font-medium text-gray-600">Receita realizada</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(receitaRealizada)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-4">
              <p className="text-sm font-medium text-gray-600">Custo total</p>
              <p className="text-xl font-bold text-red-700">{formatCurrency(custoTotal)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-l-4 border-primary-500 p-4">
              <p className="text-sm font-medium text-gray-600">Lucro</p>
              <p className={`text-xl font-bold ${lucroBar >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(lucroBar)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-l-4 border-primary-500 p-4">
              <p className="text-sm font-medium text-gray-600">Margem</p>
              <p className={`text-xl font-bold ${margemPercent >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {margemPercent.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex border-b border-gray-200 mb-4">
            <button
              type="button"
              onClick={() => setTab('produtos')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${tab === 'produtos' ? 'bg-white border border-b-0 border-gray-200 text-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Produtos (estoque)
            </button>
            <button
              type="button"
              onClick={() => setTab('vendas')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${tab === 'vendas' ? 'bg-white border border-b-0 border-gray-200 text-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Vendas (lançamentos)
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {tab === 'produtos' && !barFechado && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setForm(emptyForm);
                  setShowForm(true);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Adicionar item
              </button>
            )}
            <button
              type="button"
              onClick={handleSyncReceita}
              disabled={syncing || itemsFiltrados.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              {syncing ? 'Sincronizando...' : 'Incluir / Atualizar receita no evento'}
            </button>
            {tab === 'vendas' && !barFechado && itemsFiltrados.length > 0 && (
              <button
                type="button"
                onClick={() => { setSaleItem(null); setSaleQty(''); setSaleDate(new Date().toISOString().slice(0, 16)); setShowSaleModal(true); }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                Registrar venda
              </button>
            )}
            {itemsFiltrados.length > 0 && !barFechado && (
              <button
                type="button"
                onClick={handleFecharBar}
                disabled={closing}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
              >
                <Lock className="w-4 h-4" />
                {closing ? 'Fechando...' : 'Fechar bar'}
              </button>
            )}
          </div>

          {tab === 'produtos' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-600" />
              Produtos do bar por fornecedor (cadastro e estoque)
              {barFechado && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Bar fechado</span>
              )}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left font-medium text-gray-600">Item</th>
                    <th className="p-3 text-left font-medium text-gray-600">Fornecedor</th>
                    <th className="p-3 text-left font-medium text-gray-600">Categoria</th>
                    <th className="p-3 text-left font-medium text-gray-600">Unidade</th>
                    <th className="p-3 text-right font-medium text-gray-600">Qtd disponível</th>
                    <th className="p-3 text-right font-medium text-gray-600">Estoque atual</th>
                    <th className="p-3 text-right font-medium text-gray-600">Est. mín</th>
                    <th className="p-3 text-right font-medium text-gray-600">Valor unit.</th>
                    <th className="p-3 text-right font-medium text-gray-600">Custo unit.</th>
                    <th className="p-3 text-right font-medium text-gray-600">Qtd vendida</th>
                    <th className="p-3 text-right font-medium text-gray-600">Subtotal</th>
                    {!barFechado && <th className="p-3 w-28">Ações</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {itemsFiltrados.map((item) => {
                    const subtotal = (item.quantity_sold || 0) * (item.unit_price || 0);
                    const atual = estoqueAtual(item);
                    const lowStock = item.min_stock != null && atual < item.min_stock;
                    return (
                      <tr key={item.id} className={lowStock ? 'bg-amber-50/50' : ''}>
                        <td className="p-3">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">{item.description}</p>
                          )}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {item.supplier_name || '–'}
                        </td>
                        <td className="p-3">{CATEGORIAS.find((c) => c.value === item.category)?.label ?? item.category}</td>
                        <td className="p-3">{UNIDADES.find((u) => u.value === item.unit)?.label ?? item.unit}</td>
                        <td className="p-3 text-right tabular-nums">{item.quantity_stock}</td>
                        <td className="p-3 text-right tabular-nums font-medium">
                          <span className={atual < 0 ? 'text-red-600' : ''}>{atual}</span>
                        </td>
                        <td className="p-3 text-right tabular-nums">{item.min_stock ?? '–'}</td>
                        <td className="p-3 text-right tabular-nums">{formatCurrency(item.unit_price)}</td>
                        <td className="p-3 text-right tabular-nums">
                          {item.unit_cost != null ? formatCurrency(item.unit_cost) : '–'}
                        </td>
                        <td className="p-3 text-right tabular-nums font-medium">{item.quantity_sold}</td>
                        <td className="p-3 text-right tabular-nums font-medium">{formatCurrency(subtotal)}</td>
                        {!barFechado && (
                          <td className="p-3">
                            <div className="flex gap-1 flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSaleItem(item);
                                  setSaleQty('');
                                  setSaleDate(new Date().toISOString().slice(0, 16));
                                  setShowSaleModal(true);
                                }}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                title="Registrar venda (dar baixa no estoque)"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                className="p-1.5 text-primary-600 hover:bg-primary-50 rounded"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {itemsFiltrados.length === 0 && (
              <p className="p-6 text-gray-500 text-center">
                Nenhum produto cadastrado. Clique em &quot;Adicionar item&quot; para começar.
              </p>
            )}
          </div>
          )}

          {tab === 'vendas' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              Lançamentos de vendas (receita do bar)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left font-medium text-gray-600">Data / Hora</th>
                    <th className="p-3 text-left font-medium text-gray-600">Produto</th>
                    <th className="p-3 text-right font-medium text-gray-600">Quantidade</th>
                    <th className="p-3 text-right font-medium text-gray-600">Valor unit.</th>
                    <th className="p-3 text-right font-medium text-gray-600">Total</th>
                    {!barFechado && <th className="p-3 w-20">Ações</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {salesFiltradas.map((s) => (
                    <tr key={s.id}>
                      <td className="p-3 text-gray-600">
                        {new Date(s.sold_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-3 font-medium text-gray-900">{s.item_name ?? '–'}</td>
                      <td className="p-3 text-right tabular-nums">{s.quantity}</td>
                      <td className="p-3 text-right tabular-nums">{formatCurrency(s.unit_price)}</td>
                      <td className="p-3 text-right tabular-nums font-medium">{formatCurrency(s.total)}</td>
                      {!barFechado && (
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleDeleteSale(s.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Excluir lançamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sales.length === 0 && (
              <p className="p-6 text-gray-500 text-center">
                Nenhuma venda lançada. Use &quot;Registrar venda&quot; para dar baixa no estoque e gerar receita.
              </p>
            )}
          </div>
          )}
        </>
      )}

      {showForm && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingItem ? 'Editar item do bar' : 'Novo item do bar'}
              </h2>
              <button type="button" onClick={resetForm} className="p-1 text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  placeholder="Ex.: Cerveja 350ml"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor responsável
                </label>
                <select
                  value={form.supplier_id}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      supplier_id: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">Selecione um fornecedor...</option>
                  {suppliers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  O produto ficará vinculado a este fornecedor apenas neste evento.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  placeholder="Opcional"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as BarItemCategory }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value as BarItemUnit }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  >
                    {UNIDADES.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade em estoque</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.quantity_stock}
                    onChange={(e) => setForm((p) => ({ ...p, quantity_stock: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estoque mínimo (alerta)</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.min_stock ?? ''}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, min_stock: e.target.value === '' ? null : parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor unitário (venda) R$ *</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.unit_price}
                    onChange={(e) => setForm((p) => ({ ...p, unit_price: parseFloat(e.target.value) || 0 }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custo unitário R$</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.unit_cost ?? ''}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        unit_cost: e.target.value === '' ? null : parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : editingItem ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSaleModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">Registrar venda (lançamento)</h2>
              <button
                type="button"
                onClick={() => { setSaleItem(null); setSaleQty(''); setSaleDate(new Date().toISOString().slice(0, 16)); setShowSaleModal(false); }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            {!saleItem ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                <select
                  value=""
                  onChange={(e) => {
                    const id = e.target.value;
                    const item = itemsFiltrados.find((i) => i.id === id) ?? null;
                    setSaleItem(item);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 mb-3"
                >
                  <option value="">Selecione o produto...</option>
                  {itemsFiltrados.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} — estoque atual: {estoqueAtual(i)}
                    </option>
                  ))}
                </select>
                {itemsFiltrados.length === 0 && (
                  <p className="text-sm text-gray-500 mb-3">Cadastre produtos na aba Produtos primeiro.</p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{saleItem.name}</strong> — Estoque atual: <strong>{estoqueAtual(saleItem)}</strong> {UNIDADES.find((u) => u.value === saleItem.unit)?.label ?? saleItem.unit}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Um lançamento de venda será criado e o estoque terá baixa automática. O valor entra na receita do bar.
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data da venda</label>
                <input
                  type="datetime-local"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 mb-3"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade vendida</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={saleQty}
                  onChange={(e) => setSaleQty(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 mb-4"
                  autoFocus
                />
              </>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setSaleItem(null); setSaleQty(''); setSaleDate(new Date().toISOString().slice(0, 16)); setShowSaleModal(false); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRegistrarVenda}
                disabled={savingSale || !saleItem || !saleQty.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {savingSale ? 'Salvando...' : 'Registrar venda'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {editingSupplier ? 'Editar fornecedor' : 'Novo fornecedor'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowSupplierModal(false);
                  setEditingSupplier(null);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form
              className="p-4 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!supplierForm.name.trim()) return;
                setSavingSupplier(true);
                try {
                  if (editingSupplier) {
                    const updated = await api.updateSupplier(editingSupplier.id, {
                      name: supplierForm.name.trim(),
                      category: supplierForm.category.trim() || undefined,
                      document: supplierForm.document.trim() || undefined,
                      legal_name: supplierForm.legal_name.trim() || undefined,
                      address: supplierForm.address.trim() || undefined,
                      responsible_name:
                        supplierForm.responsible_name.trim() || undefined,
                      email: supplierForm.email.trim() || undefined,
                      phone: supplierForm.phone.trim() || undefined,
                      bank_info: supplierForm.bank_info.trim() || undefined,
                      notes: supplierForm.notes.trim() || undefined,
                    });
                    setSuppliers((prev) =>
                      prev.map((s) => (s.id === updated.id ? updated : s))
                    );
                  } else {
                    const created = await api.createSupplier({
                      name: supplierForm.name.trim(),
                      category: supplierForm.category.trim() || undefined,
                      document: supplierForm.document.trim() || undefined,
                      legal_name: supplierForm.legal_name.trim() || undefined,
                      address: supplierForm.address.trim() || undefined,
                      responsible_name:
                        supplierForm.responsible_name.trim() || undefined,
                      email: supplierForm.email.trim() || undefined,
                      phone: supplierForm.phone.trim() || undefined,
                      bank_info: supplierForm.bank_info.trim() || undefined,
                      notes: supplierForm.notes.trim() || undefined,
                    });
                    setSuppliers((prev) => [...prev, created]);
                    setSelectedSupplierId((prev) => prev || created.id);
                  }
                  setShowSupplierModal(false);
                  setEditingSupplier(null);
                } catch (err) {
                  console.error(err);
                  alert('Erro ao salvar fornecedor. Tente novamente.');
                } finally {
                  setSavingSupplier(false);
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do fornecedor *
                </label>
                <input
                  type="text"
                  value={supplierForm.name}
                  onChange={(e) =>
                    setSupplierForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria (ex.: CREPE, AÇAÍ)
                  </label>
                  <input
                    type="text"
                    value={supplierForm.category}
                    onChange={(e) =>
                      setSupplierForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ / CPF
                  </label>
                  <input
                    type="text"
                    value={supplierForm.document}
                    onChange={(e) =>
                      setSupplierForm((p) => ({ ...p, document: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razão Social ou Nome fantasia
                </label>
                <input
                  type="text"
                  value={supplierForm.legal_name}
                  onChange={(e) =>
                    setSupplierForm((p) => ({ ...p, legal_name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço completo
                </label>
                <input
                  type="text"
                  value={supplierForm.address}
                  onChange={(e) =>
                    setSupplierForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do responsável
                  </label>
                  <input
                    type="text"
                    value={supplierForm.responsible_name}
                    onChange={(e) =>
                      setSupplierForm((p) => ({
                        ...p,
                        responsible_name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) =>
                      setSupplierForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={supplierForm.phone}
                    onChange={(e) =>
                      setSupplierForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conta depósito / transferência / PIX
                  </label>
                  <textarea
                    value={supplierForm.bank_info}
                    onChange={(e) =>
                      setSupplierForm((p) => ({ ...p, bank_info: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={supplierForm.notes}
                  onChange={(e) =>
                    setSupplierForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSupplierModal(false);
                    setEditingSupplier(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingSupplier}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {savingSupplier ? 'Salvando...' : 'Salvar fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
