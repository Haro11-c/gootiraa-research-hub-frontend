import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  ShieldAlert,
  Search,
  ArrowRight,
  Calendar,
  User,
  Filter,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../api/client';
import { EditorialArticle, EditorialCategory } from '../types';

interface EditorialPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const EditorialPage: React.FC<EditorialPageProps> = ({ onNavigate }) => {
  const [articles, setArticles] = useState<EditorialArticle[]>([]);
  const [categories, setCategories] = useState<EditorialCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEditorialData();
  }, [selectedCategory, selectedType]);

  const loadEditorialData = async () => {
    setLoading(true);
    try {
      const [artRes, catRes] = await Promise.all([
        api.getArticles({
          categorySlug: selectedCategory || undefined,
          articleType: selectedType || undefined,
          limit: 12,
        }),
        api.getCategories(),
      ]);
      setArticles(artRes.articles);
      setCategories(catRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'FALSE':
        return 'bg-red-950 text-red-200 border-red-700';
      case 'MISLEADING':
        return 'bg-amber-950 text-amber-200 border-amber-700';
      case 'MOSTLY_TRUE':
      case 'TRUE':
        return 'bg-emerald-950 text-emerald-200 border-emerald-700';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Editorial Desk Banner */}
      <div className="bg-[#0B192C] text-white rounded-2xl p-8 sm:p-10 shadow-lg border border-[#1E3E62] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 text-teal-300 text-xs font-semibold">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Independent Science Journalism & Verification Desk</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Gootiraa Editorial & Fact-Check Bureau
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Rigorous investigative journalism, layperson science explainers, and empirical fact-checks grounded
            directly in peer-reviewed scientific literature and public health evidence.
          </p>
        </div>

        {/* Fact check certification badge */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 shrink-0 text-xs space-y-1 text-slate-300 max-w-xs">
          <div className="font-bold text-teal-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-teal-400" />
            <span>Transparent Methodology</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Every fact-check links primary scientific sources and publishes full correction logs.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedCategory === '' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Desks
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat.slug ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="">All Formats</option>
            <option value="NEWS">News Articles</option>
            <option value="EXPLAINER">Explainers</option>
            <option value="INVESTIGATION">Investigations</option>
            <option value="FACT_CHECK">Fact-Checks Only</option>
          </select>
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <article
            key={art.id}
            onClick={() => onNavigate('article', art.slug)}
            className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-teal-700 font-bold uppercase tracking-wider text-[10px]">
                  {art.category?.name || art.articleType}
                </span>

                {art.factCheck && (
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${getVerdictBadge(
                      art.factCheck.verdict
                    )}`}
                  >
                    VERDICT: {art.factCheck.verdict}
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 leading-snug">
                {art.title}
              </h2>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>

              {art.factCheck && (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900 text-[11px]">Claim Investigated:</div>
                  <div className="text-[11px] italic text-slate-600 line-clamp-2">&ldquo;{art.factCheck.claim}&rdquo;</div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-600">{art.author?.profile?.fullName || 'Editorial Staff'}</span>
              </div>
              <span className="text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Read story &rarr;
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
