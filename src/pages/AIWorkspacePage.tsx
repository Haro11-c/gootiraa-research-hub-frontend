import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  GitCompare,
  HelpCircle,
  FileText,
  CheckCircle,
  AlertCircle,
  Send,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api/client';
import { Publication, AISummaryResult, AIComparisonResult } from '../types';

interface AIWorkspacePageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const AIWorkspacePage: React.FC<AIWorkspacePageProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<'summarize' | 'compare' | 'explain'>('summarize');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loadingPubs, setLoadingPubs] = useState(true);

  // Summarize state
  const [selectedPubId, setSelectedPubId] = useState<string>('');
  const [summaryResult, setSummaryResult] = useState<AISummaryResult | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  // Compare state
  const [comparePubId1, setComparePubId1] = useState<string>('');
  const [comparePubId2, setComparePubId2] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<AIComparisonResult | null>(null);
  const [comparing, setComparing] = useState(false);

  // Explain state
  const [term, setTerm] = useState('');
  const [contextSnippet, setContextSnippet] = useState('');
  const [termResult, setTermResult] = useState<any>(null);
  const [explaining, setExplaining] = useState(false);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    setLoadingPubs(true);
    try {
      const res = await api.searchPublications({ limit: 15 });
      setPublications(res.publications);
      if (res.publications.length > 0) {
        setSelectedPubId(res.publications[0].id);
        if (res.publications.length > 1) {
          setComparePubId1(res.publications[0].id);
          setComparePubId2(res.publications[1].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPubs(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedPubId) return;
    setSummarizing(true);
    try {
      const res = await api.summarizePublication(selectedPubId);
      setSummaryResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSummarizing(false);
    }
  };

  const handleCompare = async () => {
    if (!comparePubId1 || !comparePubId2) return;
    setComparing(true);
    try {
      const res = await api.comparePublications(comparePubId1, comparePubId2);
      setComparisonResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setComparing(false);
    }
  };

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    setExplaining(true);
    try {
      const res = await api.explainTerminology(term, contextSnippet);
      setTermResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Workspace Header */}
      <div className="bg-[#0B192C] text-white rounded-2xl p-8 sm:p-10 shadow-lg border border-[#1E3E62] space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 text-teal-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Grounded Scholarly Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          AI Research Assistant Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Accelerate your literature review with passage-grounded extraction, terminology clarification, and
          side-by-side comparative analysis. Built with strict verification safeguards to prevent hallucinations.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setMode('summarize')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            mode === 'summarize'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Literature Summarizer
        </button>

        <button
          onClick={() => setMode('compare')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            mode === 'compare'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          Paper Comparison Matrix
        </button>

        <button
          onClick={() => setMode('explain')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            mode === 'explain'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Terminology Explainer
        </button>
      </div>

      {/* MODE 1: SUMMARIZER */}
      {mode === 'summarize' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Select Research Publication</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedPubId}
                onChange={(e) => setSelectedPubId(e.target.value)}
                className="flex-1 text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none"
              >
                {publications.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.reviewStatus === 'PEER_REVIEWED' ? 'Peer-Reviewed' : 'Preprint'}] {p.title}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSummarize}
                disabled={summarizing || !selectedPubId}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{summarizing ? 'Analyzing Text...' : 'Generate 3-Part Summary'}</span>
              </button>
            </div>
          </div>

          {summaryResult && (
            <div className="bg-white rounded-xl border border-teal-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">
                  Synthesized Evidence Summary: <span className="text-teal-700">{summaryResult.title}</span>
                </h4>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  Grounded in Abstract Passages
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                    1. Problem & Objective
                  </span>
                  <p className="text-slate-700 leading-relaxed font-serif">{summaryResult.objective}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                    2. Method & Sample
                  </span>
                  <p className="text-slate-700 leading-relaxed font-serif">{summaryResult.methodology}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                    3. Key Empirical Findings
                  </span>
                  <p className="text-slate-700 leading-relaxed font-serif">{summaryResult.findings}</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-1">
                <strong className="text-amber-900 font-semibold block">Declared Limitations & Constraints:</strong>
                <p className="text-slate-700 italic">{summaryResult.limitations}</p>
              </div>

              {/* Citations list */}
              <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-700 block">Supporting Text Passages Cited:</span>
                {summaryResult.groundedCitations.map((cite, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded border-l-2 border-teal-500 text-slate-600">
                    &ldquo;{cite.passage}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: COMPARE */}
      {mode === 'compare' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Select Two Papers for Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Paper 1</label>
                <select
                  value={comparePubId1}
                  onChange={(e) => setComparePubId1(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none"
                >
                  {publications.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Paper 2</label>
                <select
                  value={comparePubId2}
                  onChange={(e) => setComparePubId2(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none"
                >
                  {publications.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCompare}
              disabled={comparing || !comparePubId1 || !comparePubId2}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <GitCompare className="w-4 h-4" />
              <span>{comparing ? 'Synthesizing Matrix...' : 'Run Comparative Analysis'}</span>
            </button>
          </div>

          {comparisonResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Side-by-Side Methodological Comparison
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 text-sm">{comparisonResult.paper1.title}</h5>
                  <p><strong>Objective:</strong> {comparisonResult.paper1.objective}</p>
                  <p><strong>Method:</strong> {comparisonResult.paper1.methodology}</p>
                  <p><strong>Findings:</strong> {comparisonResult.paper1.findings}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 text-sm">{comparisonResult.paper2.title}</h5>
                  <p><strong>Objective:</strong> {comparisonResult.paper2.objective}</p>
                  <p><strong>Method:</strong> {comparisonResult.paper2.methodology}</p>
                  <p><strong>Findings:</strong> {comparisonResult.paper2.findings}</p>
                </div>
              </div>

              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs space-y-3">
                <div>
                  <strong className="text-teal-900 font-bold block mb-1">Key Similarities:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {comparisonResult.similarities.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="text-teal-900 font-bold block mb-1">Contrasting Dimensions:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {comparisonResult.differences.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-teal-200">
                  <strong className="text-teal-900 font-bold block mb-0.5">Synthesis:</strong>
                  <p className="text-slate-700 leading-relaxed">{comparisonResult.synthesis}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: EXPLAIN */}
      {mode === 'explain' && (
        <div className="space-y-6">
          <form onSubmit={handleExplain} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Scientific Terminology & Definition Explainer</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Scientific Term / Jargon</label>
              <input
                type="text"
                required
                placeholder="e.g. Pfk13 mutation, MODFLOW-USG, Sub-word Tokenization"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Paper Context Snippet (Optional)</label>
              <textarea
                rows={2}
                placeholder="Paste the sentence where this term appears in the manuscript..."
                value={contextSnippet}
                onChange={(e) => setContextSnippet(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={explaining}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{explaining ? 'Analyzing Concept...' : 'Explain in Academic Context'}</span>
            </button>
          </form>

          {termResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-900 capitalize">&ldquo;{termResult.term}&rdquo;</h4>
                <span className="text-[11px] text-teal-700 font-semibold">Academic Definition</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{termResult.explanation}</p>
              <p className="text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                {termResult.academicContext}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
