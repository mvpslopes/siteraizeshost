import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronRight, Loader2, AlertCircle, Star, ThumbsUp } from 'lucide-react';
import { api } from '../../lib/api';
import type { SatisfactionSurvey, SurveyQuestion, SurveyAnswer } from '../../lib/supabase';

// ─────────────────────────────────────────────────────────────
// Tipos internos
// ─────────────────────────────────────────────────────────────

type Answers = Record<string, string>;

// ─────────────────────────────────────────────────────────────
// Componentes de pergunta
// ─────────────────────────────────────────────────────────────

function StarInput({
  value,
  onChange,
  max = 5,
}: {
  value: string;
  onChange: (v: string) => void;
  max?: number;
}) {
  const [hover, setHover] = useState(0);
  const selected = Number(value) || 0;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(String(n))}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
          aria-label={`Nota ${n}`}
        >
          <Star
            className={`w-10 h-10 transition-colors ${
              n <= (hover || selected)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
      {selected > 0 && (
        <span className="ml-1 text-sm text-gray-500 font-medium">
          {selected === 1 ? 'Péssimo' : selected === 2 ? 'Ruim' : selected === 3 ? 'Regular' : selected === 4 ? 'Bom' : 'Excelente'}
        </span>
      )}
    </div>
  );
}

function NpsInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const selected = value !== '' ? Number(value) : -1;
  const getColor = (n: number) => {
    if (n === selected) {
      if (n <= 6) return 'bg-red-500 text-white border-red-600';
      if (n <= 8) return 'bg-yellow-400 text-white border-yellow-500';
      return 'bg-green-500 text-white border-green-600';
    }
    if (n <= 6) return 'border-red-200 text-red-600 hover:bg-red-50';
    if (n <= 8) return 'border-yellow-200 text-yellow-700 hover:bg-yellow-50';
    return 'border-green-200 text-green-700 hover:bg-green-50';
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 11 }, (_, i) => i).map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(String(n))}
            className={`w-11 h-11 rounded-xl border-2 font-bold text-sm transition-all hover:scale-105 active:scale-95 ${getColor(n)}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Definitivamente não</span>
        <span>Com certeza sim</span>
      </div>
    </div>
  );
}

function SimNaoInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {['Sim', 'Não'].map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 ${
            value === opt
              ? opt === 'Sim'
                ? 'bg-green-500 border-green-600 text-white'
                : 'bg-red-400 border-red-500 text-white'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function MultipleChoiceInput({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all hover:scale-[1.01] active:scale-95 ${
            value === opt
              ? 'bg-primary-600 border-primary-700 text-white'
              : 'border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
          }`}
        >
          <span className={`inline-block w-5 h-5 rounded-full border-2 mr-3 align-middle transition-colors ${
            value === opt ? 'bg-white border-white' : 'border-gray-300'
          }`} />
          {opt}
        </button>
      ))}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder ?? 'Sua resposta aqui...'}
      rows={3}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition resize-none"
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Componente: card de pergunta
// ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  value,
  onChange,
}: {
  question: SurveyQuestion;
  index: number;
  value: string;
  onChange: (v: string) => void;
}) {
  const isEmpty = !value;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all p-6 ${
      isEmpty ? 'border-gray-100' : 'border-primary-100'
    }`}>
      <div className="flex items-start gap-3 mb-5">
        <span className="shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 leading-snug">
            {question.text}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </p>
          {question.type === 'nota' && (
            <p className="text-xs text-gray-400 mt-0.5">Selecione uma nota de 1 a 5</p>
          )}
          {question.type === 'nps' && (
            <p className="text-xs text-gray-400 mt-0.5">Selecione um número de 0 a 10</p>
          )}
        </div>
        {!isEmpty && (
          <CheckCircle2 className="shrink-0 w-5 h-5 text-primary-500 mt-0.5" />
        )}
      </div>

      {question.type === 'nota' && (
        <StarInput value={value} onChange={onChange} />
      )}
      {question.type === 'nps' && (
        <NpsInput value={value} onChange={onChange} />
      )}
      {question.type === 'sim_nao' && (
        <SimNaoInput value={value} onChange={onChange} />
      )}
      {question.type === 'multipla_escolha' && question.options && (
        <MultipleChoiceInput options={question.options} value={value} onChange={onChange} />
      )}
      {question.type === 'texto' && (
        <TextInput value={value} onChange={onChange} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tela de agradecimento
// ─────────────────────────────────────────────────────────────

function ThankYouScreen({ survey }: { survey: SatisfactionSurvey }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <ThumbsUp className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Obrigado pelo feedback!</h2>
        <p className="text-gray-500 leading-relaxed">
          Suas respostas foram enviadas com sucesso. Seu feedback é muito importante para continuarmos melhorando os eventos da Raízes.
        </p>
        {survey.hero_image_url && (
          <img
            src={survey.hero_image_url}
            alt=""
            className="mt-8 rounded-xl w-full h-28 object-cover opacity-80"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Componente principal: SurveyPage
// ─────────────────────────────────────────────────────────────

export default function SurveyPage({ slug }: { slug: string }) {
  const [survey, setSurvey] = useState<SatisfactionSurvey | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'not_found' | 'unavailable' | 'ready'>('loading');
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.getSurveyBySlug(slug)
      .then(s => {
        setSurvey(s);
        if (s.status !== 'publicada') {
          setLoadState('unavailable');
        } else {
          setLoadState('ready');
        }
      })
      .catch(() => setLoadState('not_found'));
  }, [slug]);

  function setAnswer(questionId: string, value: string) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setValidationErrors(prev => ({ ...prev, [questionId]: false }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!survey?.questions) return;

    const errors: Record<string, boolean> = {};
    survey.questions.forEach(q => {
      if (q.required && (!answers[q.id] || answers[q.id].trim() === '')) {
        errors[q.id] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstErrorId = Object.keys(errors)[0];
      const el = document.getElementById(`q-${firstErrorId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const answerList: SurveyAnswer[] = Object.entries(answers).map(([question_id, answer]) => ({
        question_id,
        answer,
      }));
      await api.submitSurveyResponse(survey.id, answerList);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Ocorreu um erro ao enviar suas respostas. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Estados de carregamento ──

  if (loadState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Carregando pesquisa...</p>
        </div>
      </div>
    );
  }

  if (loadState === 'not_found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-14 h-14 text-red-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pesquisa não encontrada</h2>
          <p className="text-sm text-gray-500">O link pode estar incorreto ou a pesquisa foi removida.</p>
        </div>
      </div>
    );
  }

  if (loadState === 'unavailable') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-14 h-14 text-yellow-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pesquisa indisponível</h2>
          <p className="text-sm text-gray-500">
            Esta pesquisa está encerrada ou não foi publicada ainda.
          </p>
        </div>
      </div>
    );
  }

  if (submitted && survey) {
    return <ThankYouScreen survey={survey} />;
  }

  if (!survey?.questions) return null;

  const requiredAnswered = survey.questions.filter(q => q.required).every(q => answers[q.id]?.trim());
  const totalAnswered = Object.values(answers).filter(v => v.trim()).length;
  const progressPct = Math.round((totalAnswered / survey.questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">

      {/* Hero / capa */}
      {survey.hero_image_url ? (
        <div className="relative w-full h-52 md:h-72 overflow-hidden">
          <img
            src={survey.hero_image_url}
            alt={survey.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-white/80 text-sm font-medium mb-1">{survey.event_name}</p>
              <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight drop-shadow">
                {survey.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 px-6">
          <div className="max-w-2xl mx-auto">
            {survey.event_name && (
              <p className="text-primary-200 text-sm font-medium mb-1">{survey.event_name}</p>
            )}
            <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight">
              {survey.title}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Descrição + progresso */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          {survey.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{survey.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{totalAnswered} de {survey.questions.length} respondidas</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Perguntas */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {survey.questions.map((q, i) => (
            <div
              key={q.id}
              id={`q-${q.id}`}
              className={validationErrors[q.id] ? 'ring-2 ring-red-400 rounded-2xl' : ''}
            >
              <QuestionCard
                question={q}
                index={i}
                value={answers[q.id] ?? ''}
                onChange={v => setAnswer(q.id, v)}
              />
              {validationErrors[q.id] && (
                <p className="text-red-500 text-xs px-2 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Esta pergunta é obrigatória
                </p>
              )}
            </div>
          ))}

          {/* Botão enviar */}
          <div className="pt-4 pb-10">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 shadow-md ${
                requiredAnswered
                  ? 'bg-primary-700 hover:bg-primary-800 text-white active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar respostas
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              * Perguntas obrigatórias
            </p>
          </div>
        </form>

        {/* Rodapé */}
        <div className="text-center pb-8">
          <img src="/logo.png" alt="Raízes" className="h-8 mx-auto opacity-50" />
          <p className="text-xs text-gray-400 mt-2">Raízes Eventos · Pesquisa de Satisfação</p>
        </div>
      </div>
    </div>
  );
}
