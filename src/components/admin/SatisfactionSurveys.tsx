import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  Plus, Edit, Trash2, Eye, QrCode, X, ChevronDown, ChevronUp,
  BarChart2, ClipboardList, ExternalLink, Copy, CheckCircle2,
  Save, ArrowLeft, GripVertical, Upload, Loader2, Link, Star,
  MessageSquare, TrendingUp,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../lib/api';
import type {
  SatisfactionSurvey, SurveyQuestion, SurveyResults, SurveyQuestionStat,
} from '../../lib/supabase';
import type { Event } from '../../lib/supabase';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<SatisfactionSurvey['status'], string> = {
  rascunho: 'Rascunho',
  publicada: 'Publicada',
  encerrada: 'Encerrada',
};

const STATUS_COLORS: Record<SatisfactionSurvey['status'], string> = {
  rascunho: 'bg-gray-100 text-gray-700',
  publicada: 'bg-green-100 text-green-800',
  encerrada: 'bg-blue-100 text-blue-700',
};

const QUESTION_TYPE_LABELS: Record<SurveyQuestion['type'], string> = {
  nota: 'Nota (1-5)',
  texto: 'Resposta livre',
  multipla_escolha: 'Múltipla escolha',
  sim_nao: 'Sim / Não',
  nps: 'NPS (0-10)',
};

function publicUrl(slug: string): string {
  return `${window.location.origin}/pesquisa/${slug}`;
}

// ─────────────────────────────────────────────────────────────
// Upload de imagem
// ─────────────────────────────────────────────────────────────

function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload.php', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro no upload');
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Imagem de capa
        <span className="ml-1 text-xs text-gray-400 font-normal">(recomendado 1920×1080 · JPG/PNG/WebP · máx 10 MB)</span>
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
          <img
            src={value}
            alt="capa"
            className="w-full h-36 object-cover"
            onError={e => { (e.target as HTMLImageElement).src = ''; }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-100 transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Trocar
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remover
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition"
        >
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-primary-500 animate-spin" />
              <span className="text-sm text-gray-500">Enviando...</span>
            </>
          ) : (
            <>
              <Upload className="w-7 h-7 text-gray-300" />
              <span className="text-sm text-gray-500">Clique ou arraste a imagem aqui</span>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QR Code modal
// ─────────────────────────────────────────────────────────────

type QRDownloadFormat = 'png' | 'svg' | 'pdf';

function QRModal({ survey, onClose }: { survey: SatisfactionSurvey; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<QRDownloadFormat>('png');
  const [downloading, setDownloading] = useState(false);
  const [faviconDataUrl, setFaviconDataUrl] = useState('');
  const svgRef = useRef<HTMLDivElement>(null);
  const url = publicUrl(survey.slug);

  useEffect(() => {
    async function loadFavicon() {
      try {
        const res = await fetch('/favicon.png');
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => setFaviconDataUrl(String(reader.result));
        reader.readAsDataURL(blob);
      } catch {
        setFaviconDataUrl('');
      }
    }

    loadFavicon();
  }, []);

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getSerializedSvg() {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) throw new Error('QR Code não encontrado');
    return new XMLSerializer().serializeToString(svg);
  }

  function downloadBlob(blob: Blob, filename: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function svgToPngDataUrl(svgStr: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1200;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Canvas não disponível'));
          return;
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Não foi possível gerar o PNG'));
      };

      img.src = objectUrl;
    });
  }

  async function downloadQR() {
    setDownloading(true);
    try {
      const svgStr = getSerializedSvg();

      if (downloadFormat === 'svg') {
        downloadBlob(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }), `qrcode-${survey.slug}.svg`);
        return;
      }

      const pngDataUrl = await svgToPngDataUrl(svgStr);

      if (downloadFormat === 'png') {
        const res = await fetch(pngDataUrl);
        downloadBlob(await res.blob(), `qrcode-${survey.slug}.png`);
        return;
      }

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const qrSize = 120;
      const x = (pageWidth - qrSize) / 2;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('QR Code da Pesquisa', pageWidth / 2, 24, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(survey.title, pageWidth / 2, 33, { align: 'center', maxWidth: 170 });

      pdf.addImage(pngDataUrl, 'PNG', x, 45, qrSize, qrSize);

      pdf.setFontSize(9);
      pdf.setTextColor(90, 90, 90);
      pdf.text(url, pageWidth / 2, 174, { align: 'center', maxWidth: 170 });

      pdf.save(`qrcode-${survey.slug}.pdf`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao baixar QR Code');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center gap-6">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary-700" /> QR Code da Pesquisa
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 text-center -mt-2">{survey.title}</p>
        <div ref={svgRef} className="p-4 bg-white rounded-xl border-2 border-gray-100 shadow-inner">
          <QRCodeSVG
            value={url}
            size={220}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: faviconDataUrl || '/favicon.png',
              x: undefined,
              y: undefined,
              height: 42,
              width: 42,
              excavate: true,
            }}
          />
        </div>
        <div className="w-full bg-gray-50 rounded-lg px-4 py-2 flex items-center justify-between gap-2 border border-gray-200">
          <span className="text-xs text-gray-600 truncate flex-1">{url}</span>
          <button onClick={copyLink} className="shrink-0 text-primary-700 hover:text-primary-900 transition" title="Copiar link">
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-gray-500 hover:text-gray-800 transition" title="Abrir link">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="w-full">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Formato do download
          </label>
          <select
            value={downloadFormat}
            onChange={e => setDownloadFormat(e.target.value as QRDownloadFormat)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="png">PNG - imagem</option>
            <option value="svg">SVG - vetor</option>
            <option value="pdf">PDF - impressão</option>
          </select>
          <p className="text-[11px] text-gray-400 mt-1">
            O favicon é embutido no arquivo para sair no centro do QR Code.
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={downloadQR}
            disabled={downloading}
            className="flex-1 bg-primary-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
            Baixar {downloadFormat.toUpperCase()}
          </button>
          <button onClick={onClose} className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dashboard de resultados
// ─────────────────────────────────────────────────────────────

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={`text-xl ${n <= Math.round(value) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
      <span className="ml-2 text-lg font-bold text-gray-800">{value.toFixed(1)}</span>
    </div>
  );
}

function BarChart({ distribution, max }: { distribution: Record<string, number>; max: number }) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-1.5 mt-2">
      {Object.entries(distribution).sort(([a], [b]) => Number(a) - Number(b)).map(([key, count]) => {
        const pct = max > 0 ? (count / max) * 100 : 0;
        const pctTotal = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={key} className="flex items-center gap-2 text-sm">
            <span className="w-8 text-right text-gray-500 shrink-0">{key}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-16 text-xs text-gray-500 shrink-0">{count}× ({pctTotal}%)</span>
          </div>
        );
      })}
    </div>
  );
}

function NpsMeter({ score }: { score: number }) {
  const clamp = Math.max(-100, Math.min(100, score));
  const pct = ((clamp + 100) / 200) * 100;
  const color = clamp >= 50 ? 'text-green-600' : clamp >= 0 ? 'text-yellow-600' : 'text-red-600';
  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
        <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-full" style={{ width: '100%', opacity: 0.3 }} />
        <div className="absolute top-0 h-full bg-primary-600 rounded-full transition-all duration-700" style={{ width: `${pct}%`, opacity: 0.8 }} />
      </div>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{score}</p>
      <p className="text-xs text-gray-500">NPS Score (de -100 a 100)</p>
    </div>
  );
}

function StatCard({ stat }: { stat: SurveyQuestionStat }) {
  const [expanded, setExpanded] = useState(false);
  const maxCount = stat.distribution ? Math.max(...Object.values(stat.distribution)) : 1;
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="font-semibold text-gray-800 mb-1 leading-snug">{stat.question_text}</p>
      <span className="inline-block text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5 mb-3">
        {QUESTION_TYPE_LABELS[stat.type]} · {stat.answer_count} resposta(s)
      </span>
      {stat.type === 'nota' && stat.average != null && (
        <><StarRating value={stat.average} />{stat.distribution && <BarChart distribution={stat.distribution} max={maxCount} />}</>
      )}
      {stat.type === 'nps' && stat.nps_score != null && <NpsMeter score={stat.nps_score} />}
      {(stat.type === 'sim_nao' || stat.type === 'multipla_escolha') && stat.distribution && (
        <BarChart distribution={stat.distribution} max={maxCount} />
      )}
      {stat.type === 'texto' && stat.text_answers && (
        <>
          <div className="space-y-2 mt-1">
            {(expanded ? stat.text_answers : stat.text_answers.slice(0, 3)).map((ans, i) => (
              <blockquote key={i} className="border-l-4 border-primary-300 pl-3 text-sm text-gray-700 italic">"{ans}"</blockquote>
            ))}
          </div>
          {stat.text_answers.length > 3 && (
            <button onClick={() => setExpanded(v => !v)} className="mt-2 text-xs text-primary-700 hover:underline flex items-center gap-1">
              {expanded ? <><ChevronUp className="w-3 h-3" /> ver menos</> : <><ChevronDown className="w-3 h-3" /> ver todas ({stat.text_answers.length})</>}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'gray',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  tone?: 'primary' | 'green' | 'blue' | 'yellow' | 'gray';
}) {
  const tones = {
    primary: 'bg-primary-50 text-primary-700',
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    gray: 'bg-gray-50 text-gray-700',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ResultsDashboard({ survey, onBack }: { survey: SatisfactionSurvey; onBack: () => void }) {
  const [results, setResults] = useState<SurveyResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    api.getSurveyResults(survey.id).then(r => { setResults(r); setLoading(false); }).catch(() => setLoading(false));
  }, [survey.id]);

  const scoreStats = results?.stats.filter(stat => stat.type === 'nota' && stat.average != null) ?? [];
  const scoreAnswerCount = scoreStats.reduce((sum, stat) => sum + stat.answer_count, 0);
  const averageScore = scoreAnswerCount > 0
    ? scoreStats.reduce((sum, stat) => sum + (stat.average ?? 0) * stat.answer_count, 0) / scoreAnswerCount
    : null;

  const npsStats = results?.stats.filter(stat => stat.type === 'nps' && stat.nps_score != null) ?? [];
  const npsAnswerCount = npsStats.reduce((sum, stat) => sum + stat.answer_count, 0);
  const averageNps = npsAnswerCount > 0
    ? Math.round(npsStats.reduce((sum, stat) => sum + (stat.nps_score ?? 0) * stat.answer_count, 0) / npsAnswerCount)
    : null;

  const openAnswers = results?.stats
    .filter(stat => stat.type === 'texto')
    .reduce((sum, stat) => sum + (stat.text_answers?.length ?? stat.answer_count), 0) ?? 0;

  const answeredQuestions = results?.stats.filter(stat => stat.answer_count > 0).length ?? 0;
  const coverage = results?.stats.length
    ? Math.round((answeredQuestions / results.stats.length) * 100)
    : 0;

  async function clearAllResponses() {
    if (!results?.total_responses) return;

    const typed = window.prompt(
      `Atenção: esta ação vai apagar TODAS as ${results.total_responses} resposta(s) desta pesquisa e não poderá ser desfeita.\n\nDigite LIMPAR para confirmar.`
    );

    if (typed !== 'LIMPAR') {
      return;
    }

    setClearing(true);
    try {
      await api.clearSurveyResponses(survey.id);
      const freshResults = await api.getSurveyResults(survey.id);
      setResults(freshResults);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao limpar respostas');
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para pesquisas
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">
              Dashboard de respostas
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">{survey.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{survey.event_name}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_COLORS[survey.status]}`}>
              {STATUS_LABELS[survey.status]}
            </span>
            {results && results.total_responses > 0 && (
              <button
                onClick={clearAllResponses}
                disabled={clearing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-60"
                title="Apagar todas as respostas desta pesquisa"
              >
                {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Limpar respostas
              </button>
            )}
            {survey.status === 'publicada' && (
              <a
                href={publicUrl(survey.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir pesquisa
              </a>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : !results ? (
        <p className="text-gray-500">Não foi possível carregar os resultados.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
            <MetricCard
              title="Respostas"
              value={results.total_responses}
              subtitle="envios recebidos"
              icon={<CheckCircle2 className="w-5 h-5" />}
              tone="primary"
            />
            <MetricCard
              title="Perguntas"
              value={results.stats.length}
              subtitle={`${answeredQuestions} com resposta`}
              icon={<ClipboardList className="w-5 h-5" />}
              tone="gray"
            />
            <MetricCard
              title="Nota média"
              value={averageScore != null ? averageScore.toFixed(1) : '—'}
              subtitle={scoreAnswerCount > 0 ? `${scoreAnswerCount} avaliação(ões)` : 'sem avaliações'}
              icon={<Star className="w-5 h-5" />}
              tone="yellow"
            />
            <MetricCard
              title="NPS"
              value={averageNps ?? '—'}
              subtitle={npsAnswerCount > 0 ? `${npsAnswerCount} resposta(s)` : 'sem NPS'}
              icon={<TrendingUp className="w-5 h-5" />}
              tone={averageNps != null && averageNps >= 50 ? 'green' : averageNps != null && averageNps >= 0 ? 'yellow' : 'gray'}
            />
            <MetricCard
              title="Abertas"
              value={openAnswers}
              subtitle="comentários enviados"
              icon={<MessageSquare className="w-5 h-5" />}
              tone="blue"
            />
            <MetricCard
              title="Cobertura"
              value={`${coverage}%`}
              subtitle="perguntas respondidas"
              icon={<BarChart2 className="w-5 h-5" />}
              tone="green"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Detalhamento por pergunta</h3>
                <p className="text-sm text-gray-500">
                  Médias, distribuições e respostas abertas coletadas nesta pesquisa.
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {results.total_responses} resposta(s) totais
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.stats.map(stat => <StatCard key={stat.question_id} stat={stat} />)}
            </div>
          </div>

          {results.total_responses === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 shadow-sm text-gray-500">
              <BarChart2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>Nenhuma resposta recebida ainda.</p>
              <p className="text-sm mt-1">Compartilhe o link ou o QR code para começar a coletar feedback.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Editor de perguntas
// ─────────────────────────────────────────────────────────────

function QuestionEditor({ surveyId, onClose }: { surveyId: string; onClose: () => void }) {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newQ, setNewQ] = useState<{ text: string; type: SurveyQuestion['type']; required: boolean; options: string }>
    ({ text: '', type: 'nota', required: true, options: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ text: string; required: boolean; options: string }>
    ({ text: '', required: true, options: '' });

  async function load() {
    setLoading(true);
    const qs = await api.getSurveyQuestions(surveyId);
    setQuestions(qs);
    setLoading(false);
  }

  useEffect(() => { load(); }, [surveyId]);

  async function addQuestion() {
    if (!newQ.text.trim()) return;
    const opts = newQ.type === 'multipla_escolha' ? newQ.options.split('\n').map(s => s.trim()).filter(Boolean) : undefined;
    await api.createSurveyQuestion(surveyId, { text: newQ.text, type: newQ.type, required: newQ.required, display_order: questions.length, options: opts });
    setNewQ({ text: '', type: 'nota', required: true, options: '' });
    setAdding(false);
    load();
  }

  async function saveEdit(q: SurveyQuestion) {
    const opts = q.type === 'multipla_escolha' ? editData.options.split('\n').map(s => s.trim()).filter(Boolean) : undefined;
    await api.updateSurveyQuestion(surveyId, q.id, { text: editData.text, required: editData.required, options: opts });
    setEditId(null);
    load();
  }

  async function deleteQuestion(q: SurveyQuestion) {
    if (!confirm('Excluir esta pergunta?')) return;
    await api.deleteSurveyQuestion(surveyId, q.id);
    load();
  }

  async function moveQuestion(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= questions.length) return;
    const reordered = [...questions];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    await fetch(`/api/survey_questions.php?survey_id=${surveyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reorder: reordered.map((q, i) => ({ id: Number(q.id), display_order: i })) }),
    });
    load();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary-700" /> Gerenciar Perguntas
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" /></div>
          ) : (
            questions.map((q, i) => (
              <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                {editId === q.id ? (
                  <div className="space-y-3">
                    <textarea value={editData.text} onChange={e => setEditData({ ...editData, text: e.target.value })} rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" checked={editData.required} onChange={e => setEditData({ ...editData, required: e.target.checked })} className="accent-primary-700" />
                      Obrigatória
                    </label>
                    {q.type === 'multipla_escolha' && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Opções (uma por linha)</p>
                        <textarea value={editData.options} onChange={e => setEditData({ ...editData, options: e.target.value })} rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(q)} className="bg-primary-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-800 transition flex items-center gap-1">
                        <Save className="w-3.5 h-3.5" /> Salvar
                      </button>
                      <button onClick={() => setEditId(null)} className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium leading-snug">{q.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">{QUESTION_TYPE_LABELS[q.type]}</span>
                        {!q.required && <span className="text-xs text-gray-400">opcional</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => moveQuestion(i, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition"><ChevronUp className="w-4 h-4" /></button>
                      <button onClick={() => moveQuestion(i, 1)} disabled={i === questions.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition"><ChevronDown className="w-4 h-4" /></button>
                      <button onClick={() => { setEditId(q.id); setEditData({ text: q.text, required: q.required, options: q.options?.join('\n') ?? '' }); }}
                        className="p-1 text-blue-500 hover:text-blue-700 transition"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deleteQuestion(q)} className="p-1 text-red-400 hover:text-red-700 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {adding ? (
            <div className="border-2 border-primary-200 bg-primary-50 rounded-xl p-4 space-y-3">
              <textarea autoFocus value={newQ.text} onChange={e => setNewQ({ ...newQ, text: e.target.value })}
                placeholder="Texto da pergunta" rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
                  <select value={newQ.type} onChange={e => setNewQ({ ...newQ, type: e.target.value as SurveyQuestion['type'] })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    {(Object.keys(QUESTION_TYPE_LABELS) as SurveyQuestion['type'][]).map(t => (
                      <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={newQ.required} onChange={e => setNewQ({ ...newQ, required: e.target.checked })} className="accent-primary-700" />
                    Obrigatória
                  </label>
                </div>
              </div>
              {newQ.type === 'multipla_escolha' && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Opções (uma por linha)</p>
                  <textarea value={newQ.options} onChange={e => setNewQ({ ...newQ, options: e.target.value })} rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={addQuestion} className="bg-primary-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-800 transition flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
                <button onClick={() => setAdding(false)} className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition">Cancelar</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-primary-400 hover:text-primary-700 transition flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Adicionar pergunta
            </button>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full bg-primary-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-800 transition">
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Formulário criar/editar pesquisa
// ─────────────────────────────────────────────────────────────

type SurveyFormData = {
  event_id: string;
  title: string;
  description: string;
  slug: string;
  hero_image_url: string;
  status: SatisfactionSurvey['status'];
};

function SurveyForm({
  events,
  initialData,
  onSave,
  onCancel,
}: {
  events: Event[];
  initialData?: SatisfactionSurvey;
  onSave: (data: SurveyFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<SurveyFormData>({
    event_id: initialData?.event_id ?? (events[0]?.id ?? ''),
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    slug: initialData?.slug ?? '',
    hero_image_url: initialData?.hero_image_url ?? '',
    status: initialData?.status ?? 'rascunho',
  });
  const [saving, setSaving] = useState(false);

  function autoSlug(title: string) {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').replace(/[\s]+/g, '-').slice(0, 80);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? 'Editar Pesquisa' : 'Nova Pesquisa de Satisfação'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evento vinculado *</label>
            <select value={form.event_id} onChange={e => setForm({ ...form, event_id: e.target.value })} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
              {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título da pesquisa *</label>
            <input type="text" required value={form.title}
              onChange={e => { const t = e.target.value; setForm({ ...form, title: t, slug: form.slug || autoSlug(t) }); }}
              placeholder="Ex: Pesquisa de Satisfação — Copa Raízes 2026"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
              placeholder="Breve apresentação que o participante vai ver no topo da pesquisa"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Link className="w-3.5 h-3.5" /> Slug (URL pública)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 shrink-0">/pesquisa/</span>
              <input type="text" value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="copa-raizes-2026"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>
          </div>

          {/* Upload de imagem */}
          <ImageUpload value={form.hero_image_url} onChange={url => setForm({ ...form, hero_image_url: url })} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as SatisfactionSurvey['status'] })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
              <option value="rascunho">Rascunho</option>
              <option value="publicada">Publicada (link ativo)</option>
              <option value="encerrada">Encerrada</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-primary-700 text-white rounded-lg text-sm font-semibold hover:bg-primary-800 transition disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {initialData ? 'Salvar alterações' : 'Criar pesquisa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────

export default function SatisfactionSurveys() {
  const [surveys, setSurveys] = useState<SatisfactionSurvey[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<SatisfactionSurvey | null>(null);
  const [qrSurvey, setQrSurvey] = useState<SatisfactionSurvey | null>(null);
  const [questionsSurveyId, setQuestionsSurveyId] = useState<string | null>(null);
  const [resultsSurvey, setResultsSurvey] = useState<SatisfactionSurvey | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [s, e] = await Promise.all([api.getSurveys(), api.getEvents()]);
    setSurveys(s);
    setEvents(e);
    setLoading(false);
  }

  async function handleSave(data: SurveyFormData) {
    if (editingSurvey) {
      await api.updateSurvey(editingSurvey.id, data);
    } else {
      await api.createSurvey({ ...data, questions: undefined });
    }
    setShowForm(false);
    setEditingSurvey(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta pesquisa e todas as suas respostas?')) return;
    await api.deleteSurvey(id);
    load();
  }

  async function toggleStatus(survey: SatisfactionSurvey) {
    const next: SatisfactionSurvey['status'] =
      survey.status === 'rascunho' ? 'publicada' : survey.status === 'publicada' ? 'encerrada' : 'rascunho';
    await api.updateSurvey(survey.id, { status: next });
    load();
  }

  if (resultsSurvey) {
    return <ResultsDashboard survey={resultsSurvey} onBack={() => setResultsSurvey(null)} />;
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pesquisas de Satisfação</h1>
          <p className="text-sm text-gray-500 mt-1">Crie pesquisas vinculadas a eventos e colete feedback via QR Code.</p>
        </div>
        <button
          onClick={() => { setEditingSurvey(null); setShowForm(true); }}
          className="bg-primary-700 text-white px-5 py-2.5 rounded-lg hover:bg-primary-800 transition flex items-center gap-2 font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Nova Pesquisa
        </button>
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto" />
        </div>
      ) : surveys.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
          <ClipboardList className="w-14 h-14 mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">Nenhuma pesquisa criada ainda.</p>
          <p className="text-sm text-gray-400 mt-1">Crie uma pesquisa vinculada a um evento para começar a coletar feedback.</p>
          <button
            onClick={() => { setEditingSurvey(null); setShowForm(true); }}
            className="mt-6 bg-primary-700 text-white px-6 py-2.5 rounded-lg hover:bg-primary-800 transition text-sm font-semibold"
          >
            Criar primeira pesquisa
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">Capa</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Pesquisa</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Evento</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Respostas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Link</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-48">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {surveys.map(survey => (
                  <tr key={survey.id} className="hover:bg-gray-50 transition">

                    {/* Thumb */}
                    <td className="px-4 py-3">
                      {survey.hero_image_url ? (
                        <img
                          src={survey.hero_image_url}
                          alt=""
                          className="w-14 h-10 rounded-lg object-cover border border-gray-200"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <Upload className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </td>

                    {/* Título */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 leading-tight">{survey.title}</p>
                      {survey.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{survey.description}</p>
                      )}
                    </td>

                    {/* Evento */}
                    <td className="px-4 py-3 text-gray-600">{survey.event_name ?? '—'}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(survey)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${STATUS_COLORS[survey.status]}`}
                        title="Clique para alterar status"
                      >
                        {STATUS_LABELS[survey.status]}
                      </button>
                    </td>

                    {/* Respostas */}
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-gray-700">{survey.response_count ?? 0}</span>
                    </td>

                    {/* Link */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-400 truncate max-w-[160px] block">/pesquisa/{survey.slug}</span>
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <button
                          onClick={() => setResultsSurvey(survey)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-100 transition"
                          title="Resultados"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setQuestionsSurveyId(survey.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition"
                          title="Perguntas"
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                        </button>
                        {survey.status === 'publicada' && (
                          <>
                            <button
                              onClick={() => setQrSurvey(survey)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition"
                              title="QR Code"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={publicUrl(survey.slug)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                              title="Ver pesquisa"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                          </>
                        )}
                        <button
                          onClick={() => { setEditingSurvey(survey); setShowForm(true); }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(survey.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <SurveyForm
          events={events}
          initialData={editingSurvey ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingSurvey(null); }}
        />
      )}
      {qrSurvey && <QRModal survey={qrSurvey} onClose={() => setQrSurvey(null)} />}
      {questionsSurveyId && (
        <QuestionEditor surveyId={questionsSurveyId} onClose={() => { setQuestionsSurveyId(null); load(); }} />
      )}
    </div>
  );
}
