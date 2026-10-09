import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  ShieldAlert,
  CheckCircle,
  FileText,
  AlertTriangle,
  ExternalLink,
  History,
  Share2,
} from 'lucide-react';
import { api } from '../api/client';
import { EditorialArticle } from '../types';

interface ArticleDetailPageProps {
  slug: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug, onNavigate }) => {
  const [article, setArticle] = useState<EditorialArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getArticleBySlug(slug);
      setArticle(data);
    } catch (err: any) {
      setError(err.message || 'Article could not be found.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'FALSE':
        return { badge: 'bg-red-600 text-white', border: 'border-red-400 bg-red-50/50' };
      case 'MISLEADING':
        return { badge: 'bg-amber-600 text-white', border: 'border-amber-400 bg-amber-50/50' };
      case 'TRUE':
      case 'MOSTLY_TRUE':
        return { badge: 'bg-emerald-600 text-white', border: 'border-emerald-400 bg-emerald-50/50' };
      default:
        return { badge: 'bg-slate-700 text-white', border: 'border-slate-300 bg-slate-50' };
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500">Loading story...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Article Not Found</h2>
        <p className="text-xs text-slate-600">{error || 'This editorial story does not exist.'}</p>
        <button
          onClick={() => onNavigate('editorial')}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Editorial Desk
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('editorial')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Editorial & Fact-Checks</span>
      </button>

      {/* Main Story Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {article.category?.name || article.articleType}
          </span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500">
            Published on {new Date(article.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {article.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed border-l-4 border-teal-600 pl-4 py-1">
          {article.summary}
        </p>

        {/* Author Line */}
        <div className="flex items-center justify-between pt-2 border-b border-slate-200 pb-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              {article.author?.profile?.fullName?.[0] || 'E'}
            </div>
            <div>
              <span className="font-bold text-slate-900">{article.author?.profile?.fullName || 'Senior Science Editor'}</span>
              <span className="text-slate-400 block text-[11px]">{article.author?.profile?.academicTitle || 'Fact-Check Desk'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fact-Check Card (If article is a fact-check) */}
      {article.factCheck && (
        <div className={`p-6 rounded-2xl border ${getVerdictStyle(article.factCheck.verdict).border} space-y-4 shadow-sm`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Scientific Fact-Check Examination
              </h3>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getVerdictStyle(article.factCheck.verdict).badge}`}>
              VERDICT: {article.factCheck.verdict}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <strong className="text-slate-900 block font-semibold mb-1">Claim Examined:</strong>
              <div className="p-3 bg-white rounded-lg border border-slate-200 italic text-slate-800">
                &ldquo;{article.factCheck.claim}&rdquo;
              </div>
            </div>

            <div>
              <strong className="text-slate-900 block font-semibold mb-1">Claimant / Source:</strong>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700">
                {article.factCheck.claimant}
              </div>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <strong className="text-slate-900 block font-semibold">Scientific Consensus & Evidence Summary:</strong>
            <p className="text-slate-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-slate-200">
              {article.factCheck.evidenceSummary}
            </p>
          </div>
        </div>
      )}

      {/* Article Body Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        <div className="prose-academic text-sm sm:text-base leading-relaxed text-slate-800 space-y-4 whitespace-pre-line font-serif">
          {article.content}
        </div>

        {/* Primary Scientific References */}
        {article.sources && article.sources.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Primary Scientific Literature Cited
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
              {article.sources.map((src, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transparent Correction History */}
        {article.corrections && article.corrections.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 font-sans">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <History className="w-4 h-4 text-amber-600" />
              <span>Transparent Editorial Correction History</span>
            </div>

            <div className="space-y-2">
              {article.corrections.map((corr) => (
                <div key={corr.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-amber-900 font-semibold">
                    <span>Revision Timestamp: {new Date(corr.correctionDate).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-700">{corr.explanation}</p>
                  {corr.previousText && (
                    <div className="text-[11px] text-slate-500 pt-1">
                      <span className="line-through text-red-700">Previous: &ldquo;{corr.previousText}&rdquo;</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
