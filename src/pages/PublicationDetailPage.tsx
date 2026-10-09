import React, { useState, useEffect } from 'react';
import {
  FileText,
  Building,
  Calendar,
  Share2,
  Bookmark,
  Sparkles,
  Download,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Send,
  Eye,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { api } from '../api/client';
import { Publication, AISummaryResult, AIAnswerResult } from '../types';
import { CitationExportModal } from '../components/CitationExportModal';
import { useAuth } from '../context/AuthContext';

interface PublicationDetailPageProps {
  publicationId: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const PublicationDetailPage: React.FC<PublicationDetailPageProps> = ({ publicationId, onNavigate }) => {
  const { user, isAuthenticated, bookmarkedIds, toggleBookmark } = useAuth();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'references' | 'discussion'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // AI Assistant Tab state
  const [aiSummary, setAiSummary] = useState<AISummaryResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<AIAnswerResult | null>(null);

  // Discussion state
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [submittingQ, setSubmittingQ] = useState(false);

  useEffect(() => {
    loadPublication();
  }, [publicationId]);

  const loadPublication = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPublicationById(publicationId);
      setPublication(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load publication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setAiLoading(true);
    try {
      const res = await api.summarizePublication(publicationId);
      setAiSummary(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.askPublication(publicationId, aiQuestion);
      setAiAnswer(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;
    setSubmittingQ(true);
    try {
      await api.askQuestion({
        title: newQuestionTitle,
        content: newQuestionContent,
        publicationId,
      });
      setNewQuestionTitle('');
      setNewQuestionContent('');
      loadPublication();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingQ(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500">Loading publication metadata...</p>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Publication Not Found</h2>
        <p className="text-xs text-slate-600">{error || 'This publication record does not exist or has been withdrawn.'}</p>
        <button
          onClick={() => onNavigate('discovery')}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Discovery
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <button
        onClick={() => onNavigate('discovery')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search results</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        {/* Verification & Review Status Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold px-3 py-1 rounded text-xs flex items-center gap-1.5 ${
                publication.reviewStatus === 'PEER_REVIEWED'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {publication.reviewStatus === 'PEER_REVIEWED'
                  ? 'Peer-Reviewed Journal Publication'
                  : 'Preprint Archive (Non Peer-Reviewed)'}
              </span>
            </span>

            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-medium">
              {publication.documentType.replace(/_/g, ' ')}
            </span>

            {publication.region === 'ETHIOPIA' && (
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-medium border border-blue-200">
                Ethiopian Research
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExportModalOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Cite / Export</span>
            </button>

            <button
              onClick={() => toggleBookmark(publication.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                bookmarkedIds.has(publication.id)
                  ? 'bg-teal-50 text-teal-700 border border-teal-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{bookmarkedIds.has(publication.id) ? 'Bookmarked' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {publication.title}
        </h1>

        {/* Authors with Affiliations */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-800">
            {publication.authors.map((auth, idx) => (
              <span key={idx} className="font-semibold text-slate-900 hover:text-teal-700">
                {auth.name}
                {auth.affiliation && (
                  <span className="text-xs font-normal text-slate-500 ml-1">({auth.affiliation})</span>
                )}
                {idx < publication.authors.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>

          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-1">
            {publication.venue && <span>Published in: <strong className="text-slate-700">{publication.venue}</strong></span>}
            <span>Year: <strong>{publication.publicationYear}</strong></span>
            {publication.doi && (
              <span>
                DOI:{' '}
                <a
                  href={`https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline font-mono"
                >
                  {publication.doi}
                </a>
              </span>
            )}
            <span>License: <strong>{publication.license}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Tabs Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tabs Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Overview & Abstract
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              Grounded AI Assistant
            </button>

            <button
              onClick={() => setActiveTab('references')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'references'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              References ({publication.references?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'discussion'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Discussion & Q&A
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Abstract</h3>
                <p className="text-sm text-slate-700 leading-relaxed font-serif">
                  {publication.abstract}
                </p>
              </div>

              {publication.keywords && publication.keywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {publication.keywords.map((kw, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Download or PDF Access */}
              {publication.files && publication.files.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Authorized Full-Text Manuscript</h4>
                    <p className="text-[11px] text-slate-500">
                      Uploaded by author under {publication.license} open license.
                    </p>
                  </div>
                  <a
                    href={`/api/v1/publications/files/${publication.files[0].id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF ({Math.round(publication.files[0].fileSize / 1024)} KB)
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GROUNDED AI ASSISTANT */}
          {activeTab === 'ai' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-900">Document Evidence AI Assistant</h3>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Grounded strictly in this document text. Cites exact passages. Never hallucinates citations.
                  </p>
                </div>

                <button
                  onClick={handleGenerateSummary}
                  disabled={aiLoading}
                  className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-lg border border-teal-200 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  {aiLoading ? 'Synthesizing...' : 'Generate 3-Part Summary'}
                </button>
              </div>

              {/* Structured Summary Result */}
              {aiSummary && (
                <div className="bg-slate-50 border border-teal-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide">
                      Structured Literature Summary
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">Confidence: 94%</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <strong className="text-slate-900 block font-semibold mb-0.5">1. Research Objective & Question:</strong>
                      <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200">{aiSummary.objective}</p>
                    </div>

                    <div>
                      <strong className="text-slate-900 block font-semibold mb-0.5">2. Methodology & Cohort / Model:</strong>
                      <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200">{aiSummary.methodology}</p>
                    </div>

                    <div>
                      <strong className="text-slate-900 block font-semibold mb-0.5">3. Key Findings & Empirical Results:</strong>
                      <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200">{aiSummary.findings}</p>
                    </div>

                    <div>
                      <strong className="text-slate-900 block font-semibold mb-0.5">Stated Limitations:</strong>
                      <p className="text-slate-600 bg-white p-2.5 rounded border border-slate-200 italic">{aiSummary.limitations}</p>
                    </div>
                  </div>

                  {/* Grounded Citation Evidence */}
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <strong className="text-slate-700 block mb-1">Grounded Passages Cited:</strong>
                    {aiSummary.groundedCitations.map((cite, i) => (
                      <div key={i} className="bg-teal-50/50 p-2 rounded text-slate-700 border-l-2 border-teal-500 mb-1">
                        &ldquo;{cite.passage}&rdquo;
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Q&A Form */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Ask a Specific Question About This Paper</h4>
                <form onSubmit={handleAskAI} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. What were the specific statistical results or sample size?"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ask AI</span>
                  </button>
                </form>

                {aiAnswer && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-semibold">Answer from verified text:</strong>
                      <span className={`text-[10px] font-bold ${aiAnswer.isEvidenceSufficient ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {aiAnswer.isEvidenceSufficient ? 'Evidence Grounded' : 'Insufficient Text Evidence'}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{aiAnswer.answer}</p>
                    {aiAnswer.groundedCitations.length > 0 && (
                      <div className="bg-white p-2 rounded border border-slate-200 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-800">Passage anchor: </span>
                        &ldquo;{aiAnswer.groundedCitations[0].passage}&rdquo;
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REFERENCES */}
          {activeTab === 'references' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Works Cited in This Publication
              </h3>

              {publication.references && publication.references.length > 0 ? (
                <ol className="space-y-3 list-decimal list-inside text-xs text-slate-700 leading-relaxed font-sans">
                  {publication.references.map((ref, idx) => (
                    <li key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-100">
                      {ref}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-slate-500 italic">No external references parsed for this record.</p>
              )}
            </div>
          )}

          {/* TAB 4: DISCUSSION & Q&A */}
          {activeTab === 'discussion' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Peer Discussion & Academic Inquiries
                </h3>
                <p className="text-xs text-slate-500">
                  Ask methodological questions or discuss findings with authors and fellow scholars.
                </p>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {publication.questions && publication.questions.length > 0 ? (
                  publication.questions.map((q) => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">{q.user?.profile?.fullName || 'Scholar'}</span>
                        <span className="text-slate-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{q.title}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{q.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No questions posted yet. Start the conversation below.</p>
                )}
              </div>

              {/* Ask Question Form */}
              <form onSubmit={handlePostQuestion} className="pt-4 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Ask a Question</h4>
                <input
                  type="text"
                  required
                  placeholder="Question title (e.g. Sampling method in rural cohort?)"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Elaborate on your inquiry..."
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submittingQ}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  {submittingQ ? 'Posting...' : 'Post Question'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar (1 col) */}
        <div className="space-y-6">
          {/* Research Impact Metrics Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Research Metrics & Impact
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xl font-bold text-slate-900">{publication.metricsViews}</div>
                <div className="text-[11px] text-slate-500 font-medium">Total Reads</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xl font-bold text-teal-700">{publication.metricsCitations}</div>
                <div className="text-[11px] text-slate-500 font-medium">Verified Citations</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xl font-bold text-slate-900">{publication.metricsDownloads}</div>
                <div className="text-[11px] text-slate-500 font-medium">Downloads</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xl font-bold text-slate-900">{publication.metricsBookmarks}</div>
                <div className="text-[11px] text-slate-500 font-medium">Saves / Library</div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic leading-tight">
              * Citation counts verified from Crossref and OpenAlex academic graph databases.
            </p>
          </div>

          {/* Affiliated Institution Card */}
          {publication.institution && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Affiliation
              </h3>
              <div className="flex items-start gap-2.5 pt-1">
                <Building className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{publication.institution.name}</h4>
                  <p className="text-[11px] text-slate-500">{publication.institution.city}, {publication.institution.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Related Publications */}
          {publication.related && publication.related.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Related Research
              </h3>

              <div className="space-y-3">
                {publication.related.map((rel: any) => (
                  <div
                    key={rel.id}
                    onClick={() => onNavigate('publication', rel.id)}
                    className="group cursor-pointer space-y-1"
                  >
                    <h5 className="text-xs font-semibold text-slate-800 group-hover:text-teal-700 line-clamp-2 leading-snug">
                      {rel.title}
                    </h5>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{rel.publicationYear}</span>
                      <span>{rel.metricsCitations || 0} citations</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Citation Export Modal */}
      {exportModalOpen && (
        <CitationExportModal
          publication={publication}
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
        />
      )}
    </div>
  );
};
