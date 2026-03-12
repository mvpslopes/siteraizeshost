import { useEffect, useState, useMemo } from 'react';
import { ClipboardList, DollarSign, Save, AlertCircle, Clock, TrendingUp, Wallet } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Event, EventFinancialItem, EventScenario, PaymentStatus } from '../../lib/supabase';
import { api, type ScenarioItemRow } from '../../lib/api';

const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'previsto', label: 'Previsto' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'cancelado', label: 'Cancelado' },
];

type ItemWithExpected = EventFinancialItem & { expected_amount: number };

export default function GestaoEventos() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [chosenScenario, setChosenScenario] = useState<EventScenario | null>(null);
  const [items, setItems] = useState<ItemWithExpected[]>([]);
  const [scenarioItems, setScenarioItems] = useState<ScenarioItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    api.getEvents()
      .then(data => {
        setEvents(
          data.sort(
            (a, b) =>
              new Date(b.start_date || b.event_date).getTime() -
              new Date(a.start_date || a.event_date).getTime()
          )
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedEvent) {
      setChosenScenario(null);
      setItems([]);
      setScenarioItems([]);
      return;
    }

    const scenarioId = selectedEvent.chosen_scenario_id;

    if (!scenarioId) {
      setChosenScenario(null);
      setScenarioItems([]);
      api
        .getEventFinancialItems(selectedEvent.id)
        .then(financialItems => {
          const merged: ItemWithExpected[] = financialItems.map(item => ({
            ...item,
            expected_amount: item.base_amount ?? 0,
          }));
          setItems(merged);
        })
        .catch(console.error);
      return;
    }

    Promise.all([
      api.getEventScenarios(selectedEvent.id),
      api.getEventFinancialItems(selectedEvent.id),
      api.getScenarioItems(scenarioId),
    ]).then(([scenarios, financialItems, scenarioItemsList]) => {
      const scenario = scenarios.find(s => s.id === scenarioId) || null;
      setChosenScenario(scenario);
      setScenarioItems(scenarioItemsList);
      const byId: Record<number, number> = {};
      scenarioItemsList.forEach(row => {
        byId[row.financial_item_id] =
          row.expected_amount ?? row.base_amount ?? 0;
      });
      const merged: ItemWithExpected[] = financialItems.map(item => ({
        ...item,
        expected_amount: byId[Number(item.id)] ?? item.base_amount ?? 0,
      }));
      setItems(merged);
    }).catch(console.error);
  }, [selectedEvent?.id, selectedEvent?.chosen_scenario_id]);

  const handleEventSelect = (eventId: string) => {
    const event = events.find(e => e.id === eventId) || null;
    setSelectedEvent(event);
  };

  const updateItemField = (
    id: string,
    field: 'payment_status' | 'due_date' | 'payment_date',
    value: string
  ) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value || undefined } : item
      )
    );
  };

  const saveItem = async (item: ItemWithExpected) => {
    if (!selectedEvent) return;
    setSavingId(item.id);
    try {
      const updated = await api.updateEventFinancialItem(
        item.id,
        {
          payment_status: item.payment_status,
          due_date: item.due_date,
          payment_date: item.payment_date,
        },
        selectedEvent.id
      );
      setItems(prev =>
        prev.map(p => (p.id === updated.id ? { ...p, ...updated, expected_amount: p.expected_amount } : p))
      );
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setSavingId(null);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDateInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toISOString().slice(0, 10);
  };

  const dashboard = useMemo(() => {
    const notCanceled = items.filter(i => i.payment_status !== 'cancelado');
    const receitas = notCanceled.filter(i => i.type === 'receita');
    const despesas = notCanceled.filter(i => i.type === 'custo');
    const totalReceitas = receitas.reduce((s, i) => s + i.expected_amount, 0);
    const totalDespesas = despesas.reduce((s, i) => s + i.expected_amount, 0);
    const saldoPrevisto = totalReceitas - totalDespesas;

    const pendentes = items.filter(
      i => (i.payment_status === 'pendente' || i.payment_status === 'atrasado') && i.payment_status !== 'cancelado'
    );
    const valorPendente = pendentes.reduce((s, i) => s + i.expected_amount, 0);

    const atrasados = items.filter(i => i.payment_status === 'atrasado');
    const valorAtrasado = atrasados.reduce((s, i) => s + i.expected_amount, 0);

    const pagos = items.filter(i => i.payment_status === 'pago');
    const receitasPagas = pagos.filter(i => i.type === 'receita').reduce((s, i) => s + i.expected_amount, 0);
    const despesasPagas = pagos.filter(i => i.type === 'custo').reduce((s, i) => s + i.expected_amount, 0);
    const saldoRealizado = receitasPagas - despesasPagas;

    return {
      totalReceitas,
      totalDespesas,
      saldoPrevisto,
      pendentes: { count: pendentes.length, valor: valorPendente },
      atrasados: { count: atrasados.length, valor: valorAtrasado },
      saldoRealizado,
    };
  }, [items]);

  const buildTableRows = () =>
    items.map(item => ({
      item: item.name,
      tipo: item.type === 'receita' ? 'Receita' : 'Custo',
      valorPrevisto: formatCurrency(item.expected_amount),
      status:
        PAYMENT_STATUS_OPTIONS.find(opt => opt.value === item.payment_status)?.label ??
        item.payment_status,
      vencimento: item.due_date ? new Date(item.due_date).toLocaleDateString('pt-BR') : '-',
      pagamento: item.payment_date ? new Date(item.payment_date).toLocaleDateString('pt-BR') : '-',
    }));

  const handleExportExcel = () => {
    if (!selectedEvent) {
      alert('Selecione um evento para exportar.');
      return;
    }
    const rows = buildTableRows();

    const worksheetData = [
      [
        'Item',
        'Tipo',
        'Valor previsto',
        'Status',
        'Vencimento',
        'Data pagamento',
      ],
      ...rows.map(row => [
        row.item,
        row.tipo,
        row.valorPrevisto,
        row.status,
        row.vencimento,
        row.pagamento,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gestão de Eventos');

    const fileName = `gestao-evento-${selectedEvent.name
      .replace(/\s+/g, '-')
      .toLowerCase()}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const handleExportPDF = () => {
    if (!selectedEvent) {
      alert('Selecione um evento para exportar.');
      return;
    }
    const doc = new jsPDF('p', 'mm', 'a4');

    const primary600 = [109, 122, 68]; // #6d7a44
    const primary800 = [69, 77, 47]; // #454d2f
    const secondary400 = [242, 147, 51]; // #f29333
    const neutralBackground = [245, 245, 244];

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 16;

    doc.setFillColor(neutralBackground[0], neutralBackground[1], neutralBackground[2]);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

    doc.setFillColor(primary600[0], primary600[1], primary600[2]);
    doc.rect(0, 0, pageWidth, 42, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Gestão de Eventos', marginX, 20);

    doc.setDrawColor(secondary400[0], secondary400[1], secondary400[2]);
    doc.setLineWidth(0.7);
    doc.line(marginX, 26, pageWidth - marginX, 26);

    doc.setFontSize(11);
    const eventName = selectedEvent.name;
    const eventDate = selectedEvent.start_date
      ? new Date(selectedEvent.start_date).toLocaleDateString('pt-BR')
      : selectedEvent.event_date
      ? new Date(selectedEvent.event_date).toLocaleDateString('pt-BR')
      : '';
    doc.setFont('helvetica', 'normal');
    doc.text(`Evento: ${eventName}`, marginX, 32);
    if (eventDate) {
      doc.text(`Data: ${eventDate}`, marginX, 38);
    }

    const cardX = marginX;
    const cardY = 50;
    const cardW = pageWidth - marginX * 2;
    const cardH = 34;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(secondary400[0], secondary400[1], secondary400[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(cardX, cardY, cardW, cardH, 3, 3, 'FD');

    doc.setTextColor(secondary400[0], secondary400[1], secondary400[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Resumo financeiro do cenário', cardX + 4, cardY + 7);

    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const resumoLeft = [
      `Saldo previsto: ${formatCurrency(dashboard.saldoPrevisto)}`,
      `Total receitas: ${formatCurrency(dashboard.totalReceitas)}`,
      `Total despesas: ${formatCurrency(dashboard.totalDespesas)}`,
    ];
    const resumoRight = [
      `Saldo realizado: ${formatCurrency(dashboard.saldoRealizado)}`,
      `Pendências: ${dashboard.pendentes.count} itens (${formatCurrency(
        dashboard.pendentes.valor
      )})`,
      `Atrasados: ${dashboard.atrasados.count} itens (${formatCurrency(
        dashboard.atrasados.valor
      )})`,
    ];
    resumoLeft.forEach((line, index) => {
      doc.text(line, cardX + 4, cardY + 13 + index * 4.5);
    });
    resumoRight.forEach((line, index) => {
      doc.text(
        line,
        cardX + cardW / 2,
        cardY + 13 + index * 4.5
      );
    });

    const startTableY = cardY + cardH + 14;
    const rows = buildTableRows();
    const colHeaders = ['Item', 'Tipo', 'Valor previsto', 'Status', 'Venc.', 'Pgto.'];
    const colWidths = [76, 22, 30, 30, 22, 22];

    let currentY = startTableY;

    doc.setFillColor(primary800[0], primary800[1], primary800[2]);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    let x = cardX;
    const headerHeight = 7;
    colHeaders.forEach((header, idx) => {
      const w = colWidths[idx];
      doc.rect(x, currentY, w, headerHeight, 'F');
      doc.text(header, x + 2, currentY + 4.5);
      x += w;
    });
    currentY += headerHeight;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    const rowHeight = 7;
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 20;

    rows.forEach((row, rowIndex) => {
      if (currentY + rowHeight > pageHeight - bottomMargin) {
        doc.addPage();
        doc.setFillColor(neutralBackground[0], neutralBackground[1], neutralBackground[2]);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        currentY = 24;

        doc.setFillColor(primary800[0], primary800[1], primary800[2]);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        let headerX = cardX;
        colHeaders.forEach((header, idx) => {
          const w = colWidths[idx];
          doc.rect(headerX, currentY, w, headerHeight, 'F');
          doc.text(header, headerX + 2, currentY + 4.5);
          headerX += w;
        });
        currentY += headerHeight;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
      }

      const isStriped = rowIndex % 2 === 0;
      let rowX = cardX;
      if (isStriped) {
        doc.setFillColor(248, 248, 248);
        doc.rect(rowX, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
      }

      const values = [
        row.item,
        row.tipo,
        row.valorPrevisto,
        row.status,
        row.vencimento,
        row.pagamento,
      ];
      values.forEach((value, idx) => {
        const w = colWidths[idx];
        const textX = rowX + 2;
        const textY = currentY + 4;
        doc.text(String(value), textX, textY, { maxWidth: w - 4 });
        rowX += w;
      });

      currentY += rowHeight;
    });

    doc.save(
      `gestao-evento-${selectedEvent.name.replace(/\s+/g, '-').toLowerCase()}.pdf`
    );
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
        <ClipboardList className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-800">Gestão de Eventos</h1>
        {selectedEvent && items.length > 0 && (
          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-4 py-2 rounded-lg border border-primary-200 text-primary-700 text-sm font-medium hover:bg-primary-50 transition-colors"
            >
              Exportar Excel
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 shadow-sm transition-colors"
            >
              Exportar PDF
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-primary-600 font-medium mb-2">
          Selecionar Evento
        </label>
        <select
          value={selectedEvent?.id ?? ''}
          onChange={e => handleEventSelect(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">Selecione um evento...</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name}
              {event.chosen_scenario_id
                ? ' (cenário aplicado)'
                : ''}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          {chosenScenario ? (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center gap-4 flex-wrap">
              <span className="text-gray-600">
                Cenário em uso: <strong>{chosenScenario.name}</strong> ({chosenScenario.code})
              </span>
            </div>
          ) : (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4 flex items-center gap-4 flex-wrap">
              <span className="text-primary-800 text-sm">
                <strong>Gestão direta</strong> — sem cenário. Você pode gerenciar pagamentos e datas dos itens cadastrados em Simulações. Opcionalmente, use <strong>Cenários</strong> para planejar mais de uma previsão e aplicar uma ao evento.
              </span>
            </div>
          )}

          {/* Dashboard geral */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Visão geral
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <div
                className={`bg-white rounded-xl shadow-sm border-l-4 p-6 min-h-[120px] flex flex-col justify-between ${
                  dashboard.saldoPrevisto >= 0 ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      dashboard.saldoPrevisto >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Saldo previsto</span>
                </div>
                <p className={`text-2xl font-bold tabular-nums mt-2 ${dashboard.saldoPrevisto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dashboard.saldoPrevisto)}
                </p>
                <p className="text-xs text-gray-500 mt-1.5">Receitas − Despesas do cenário</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-6 min-h-[120px] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Total receitas</span>
                </div>
                <p className="text-2xl font-bold text-green-700 tabular-nums mt-2">
                  {formatCurrency(dashboard.totalReceitas)}
                </p>
                <p className="text-xs text-gray-500 mt-1.5">Soma prevista do cenário</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-6 min-h-[120px] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Total despesas</span>
                </div>
                <p className="text-2xl font-bold text-red-700 tabular-nums mt-2">
                  {formatCurrency(dashboard.totalDespesas)}
                </p>
                <p className="text-xs text-gray-500 mt-1.5">Soma prevista do cenário</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border-l-4 border-amber-500 p-6 min-h-[120px] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Pendências</span>
                </div>
                <p className="text-2xl font-bold text-amber-700 tabular-nums mt-2">
                  {formatCurrency(dashboard.pendentes.valor)}
                </p>
                <p className="text-xs text-gray-500 mt-1.5">
                  {dashboard.pendentes.count} item(ns) pendente(s) ou atrasado(s)
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-400 p-6 min-h-[120px] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Atrasados</span>
                </div>
                <p className="text-2xl font-bold text-red-600 tabular-nums mt-2">
                  {formatCurrency(dashboard.atrasados.valor)}
                </p>
                <p className="text-xs text-gray-500 mt-1.5">
                  {dashboard.atrasados.count} item(ns) atrasado(s)
                </p>
              </div>

              <div
                className={`bg-white rounded-xl shadow-sm border-l-4 p-6 min-h-[120px] flex flex-col justify-between ${
                  dashboard.saldoRealizado >= 0 ? 'border-blue-500' : 'border-red-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      dashboard.saldoRealizado >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Saldo realizado</span>
                </div>
                <p className={`text-2xl font-bold tabular-nums mt-2 ${dashboard.saldoRealizado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dashboard.saldoRealizado)}
                </p>
                <p className="text-xs text-gray-500 mt-1.5">Receitas pagas − Despesas pagas</p>
              </div>
            </div>
          </section>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-600" />
              Itens – pagamentos e datas
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-sm text-gray-600">
                    <th className="p-3 font-medium">Item</th>
                    <th className="p-3 font-medium">Tipo</th>
                    <th className="p-3 font-medium">Valor previsto</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Vencimento</th>
                    <th className="p-3 font-medium">Data pagamento</th>
                    <th className="p-3 font-medium w-20">Salvar</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="p-3">
                        <span className="font-medium text-gray-800">{item.name}</span>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white capitalize ${
                            item.type === 'receita'
                              ? 'bg-green-600'
                              : 'bg-red-600'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3 font-medium">
                        {formatCurrency(item.expected_amount)}
                      </td>
                      <td className="p-3">
                        <select
                          value={item.payment_status}
                          onChange={e =>
                            updateItemField(
                              item.id,
                              'payment_status',
                              e.target.value as PaymentStatus
                            )
                          }
                          className="w-full max-w-[140px] px-2 py-1.5 border border-gray-300 rounded text-sm"
                        >
                          {PAYMENT_STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          value={formatDateInput(item.due_date)}
                          onChange={e =>
                            updateItemField(item.id, 'due_date', e.target.value)
                          }
                          className="w-full max-w-[160px] px-2 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          value={formatDateInput(item.payment_date)}
                          onChange={e =>
                            updateItemField(item.id, 'payment_date', e.target.value)
                          }
                          className="w-full max-w-[160px] px-2 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => saveItem(item)}
                          disabled={savingId === item.id}
                          className="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1"
                          title="Salvar alterações"
                        >
                          <Save className="w-4 h-4" />
                          {savingId === item.id ? '...' : ''}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {items.length === 0 && (
              <p className="p-6 text-gray-500 text-center">
                Nenhum item financeiro neste evento. Cadastre receitas e despesas em
                Simulações.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
