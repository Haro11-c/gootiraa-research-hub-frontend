import React, { useState } from 'react';
import {
  X,
  Newspaper,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../api/client';
import { EditorialCategory } from '../types';

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: EditorialCategory[];
  onSuccess: () => void;
}

export const CreateArticleModal: React.FC<CreateArticleModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [articleType, setArticleType] = useState<string>('NEWS');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Fact-Check specific fields
  const [claim, setClaim] = useState('');
  const [claimant, setClaimant] = useState('');
  const [verdict, setVerdict] = useState<string>('FALSE');
  const [evidenceSummary, setEvidenceSummary] = useState('');

  // Sources
  const [sources, setSources] = useState<{ title: string; url: string; doi?: string }[]>([
    { title: '', url: '', doi: '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSource = () => {
    setSources([...sources, { title: '', url: '', doi: '' }]);
  };

  const handleRemoveSource = (index: number) => {
    setSources(sources.filter((_, idx) => idx !== index));
  };

  const handleSourceChange = (index: number, field: string, val: string) => {
    const updated = [...sources];
    (updated[index] as any)[field] = val;
    setSources(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError('Please provide a title, executive summary, and full article content.');
      return;
    }

    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }

    const activeCatId = categoryId || categories[0]?.id;
    if (!activeCatId) {
      setError('Please select or create an editorial category desk.');
      return;
    }

    const cleanSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 90) + '-' + Date.now().toString().slice(-4);

    const cleanTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanSources = sources.filter((s) => s.title.trim() && s.url.trim());

    const payload: any = {
      title,
      slug: cleanSlug,
      summary,
      content,
      coverImageUrl: coverImageUrl.trim() || undefined,
      articleType,
      categoryId: activeCatId,
      tags: cleanTags,
      sources: cleanSources,
    };

    if (articleType === 'FACT_CHECK') {
      if (!claim.trim() || !claimant.trim() || !evidenceSummary.trim()) {
        setError('Please provide the Target Claim, Claimant, Verdict, and Evidence Summary for this Fact-Check.');
        return;
      }
      payload.factCheck = {
        claim,
        claimant,
        verdict,
        evidenceSummary,
        academicSources: cleanSources,
      };
    }

    setLoading(true);
    try {
      await api.createArticle(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish editorial article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4 sm:my-8">
        
        {/* Header */}
        <div className="bg-[#0B192C] text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0">
              <Newspaper className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Write & Publish Science Editorial</h2>
              <p className="text-[11px] sm:text-xs text-slate-300">
                Independent investigative journalism, explainer, or empirical fact-check
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Row 1: Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Article Headline / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Genomic Sequencing Uncovers Emerging Antimalarial Resistances in Southern Ethiopia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Row 2: Format & Category Desk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Editorial Format Desk *
              </label>
              <select
                value={articleType}
                onChange={(e) => setArticleType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="NEWS">Science News Report</option>
                <option value="EXPLAINER">Layperson Explainer</option>
                <option value="INVESTIGATION">Investigative Journalism</option>
                <option value="FACT_CHECK">Scientific Fact-Check</option>
                <option value="INTERVIEW">Scholar Interview</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Thematic Desk Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* IF FACT-CHECK: FACT-CHECK VERIFICATION BOX */}
          {articleType === 'FACT_CHECK' && (
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-300 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Empirical Fact-Check Verification Card</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Claim Being Tested *</label>
                  <input
                    type="text"
                    placeholder="e.g. Viral claim that traditional herb cures malaria in 24 hours"
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Claimant / Source of Rumor *</label>
                  <input
                    type="text"
                    placeholder="e.g. Viral Social Media Post / Broadcast Interview"
                    value={claimant}
                    onChange={(e) => setClaimant(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Scientific Verdict *</label>
                  <select
                    value={verdict}
                    onChange={(e) => setVerdict(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white font-bold"
                  >
                    <option value="FALSE">FALSE (Completely fabricated)</option>
                    <option value="MISLEADING">MISLEADING (Distorted context)</option>
                    <option value="MIXED">MIXED / PARTLY TRUE</option>
                    <option value="MOSTLY_TRUE">MOSTLY TRUE</option>
                    <option value="TRUE">TRUE (Scientifically Verified)</option>
                    <option value="UNPROVEN">UNPROVEN (No clinical evidence)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Evidence Summary & Clinical Grounding *</label>
                  <input
                    type="text"
                    placeholder="Brief 1-sentence scientific conclusion grounded in clinical trials"
                    value={evidenceSummary}
                    onChange={(e) => setEvidenceSummary(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Row 3: Summary / Standfirst */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Executive Summary / Standfirst * (min 20 chars)
            </label>
            <textarea
              rows={2}
              required
              placeholder="Clear, layperson summary highlighting the core empirical discoveries or findings..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Row 4: Full Article Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Article Body Content * (min 50 chars)
            </label>
            <textarea
              rows={7}
              required
              placeholder="Write the full investigative piece, scientific context, expert commentary, and analysis..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs font-serif leading-relaxed border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Row 5: Tags & Optional Cover Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="Malaria, Public Health, EPHI, Epidemiology"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cover Image URL (optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {/* Row 6: Primary Scientific Sources */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Primary Scientific Sources & Citations
              </label>
              <button
                type="button"
                onClick={handleAddSource}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source</span>
              </button>
            </div>

            <div className="space-y-2">
              {sources.map((src, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Paper / Source Title"
                    value={src.title}
                    onChange={(e) => handleSourceChange(idx, 'title', e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                  <input
                    type="url"
                    placeholder="https://doi.org/... or Source URL"
                    value={src.url}
                    onChange={(e) => handleSourceChange(idx, 'url', e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                  {sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/30 flex items-center gap-1.5 transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Publish to Editorial Desk</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
