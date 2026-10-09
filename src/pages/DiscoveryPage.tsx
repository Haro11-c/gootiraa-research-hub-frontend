import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Calendar,
  Building,
  CheckCircle,
  ExternalLink,
  Download,
  Share2,
  Bookmark,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { api } from '../api/client';
import { Publication, Author } from '../types';
import { CitationExportModal } from '../components/CitationExportModal';
import { AuthorDetailModal } from '../components/AuthorDetailModal';
import { useAuth } from '../context/AuthContext';

interface DiscoveryPageProps {
  initialQuery?: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ initialQuery = '', onNavigate }) => {
  const { bookmarkedIds, toggleBookmark } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [documentType, setDocumentType] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [region, setRegion] = useState('');
  const [isOpenAccess, setIsOpenAccess] = useState<boolean | undefined>(undefined);
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [sort, setSort] = useState<'newest' | 'citations' | 'views' | 'relevance'>('relevance');
  const [page, setPage] = useState(1);

  // Author details modal state
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedSubmitter, setSelectedSubmitter] = useState<any | null>(null);
  const [authorModalOpen, setAuthorModalOpen] = useState(false);

  const [publications, setPublications] = useState<Publication[]>([]);
  const [externalResults, setExternalResults] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedForExport, setSelectedForExport] = useState<Publication | null>(null);

  useEffect(() => {
    executeSearch();
  }, [documentType, reviewStatus, region, isOpenAccess, sort, page]);

  const executeSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.searchPublications({
        q: query || undefined,
        documentType: documentType || undefined,
        reviewStatus: reviewStatus || undefined,
        region: region || undefined,
        isOpenAccess,
        yearFrom: yearFrom ? parseInt(yearFrom, 10) : undefined,
        yearTo: yearTo ? parseInt(yearTo, 10) : undefined,
        sort,
        page,
        limit: 10,
        includeExternal: true,
      });

      setPublications(res.publications);
      setExternalResults(res.externalResults || []);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message || 'Search execution failed. Please check parameters.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    executeSearch();
  };

  const clearFilters = () => {
    setQuery('');
    setDocumentType('');
    setReviewStatus('');
    setRegion('');
    setIsOpenAccess(undefined);
    setYearFrom('');
    setYearTo('');
    setSort('relevance');
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search across title, abstract, authors, DOI, keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search Repository</span>
            </button>
          </div>

          {/* Quick Filters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => { setDocumentType(e.target.value); setPage(1); }}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="PEER_REVIEWED_ARTICLE">Peer-Reviewed Article</option>
                <option value="PREPRINT">Preprint</option>
                <option value="THESIS">Thesis / Dissertation</option>
                <option value="CONFERENCE_PAPER">Conference Paper</option>
                <option value="DATASET">Dataset</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Review Status</label>
              <select
                value={reviewStatus}
                onChange={(e) => { setReviewStatus(e.target.value); setPage(1); }}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="">All Verification</option>
                <option value="PEER_REVIEWED">Peer-Reviewed Only</option>
                <option value="PREPRINT">Preprint (Unreviewed)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Geographic Focus</label>
              <select
                value={region}
                onChange={(e) => { setRegion(e.target.value); setPage(1); }}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="">All Regions</option>
                <option value="ETHIOPIA">Ethiopia & Horn of Africa</option>
                <option value="PAN_AFRICA">Pan-African</option>
                <option value="GLOBAL">Global</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Access Model</label>
              <select
                value={isOpenAccess === undefined ? '' : String(isOpenAccess)}
                onChange={(e) => {
                  setIsOpenAccess(e.target.value === '' ? undefined : e.target.value === 'true');
                  setPage(1);
                }}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="">All Access</option>
                <option value="true">Open Access Only</option>
                <option value="false">Subscription / Restricted</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Sort Order</label>
              <select
                value={sort}
                onChange={(e: any) => { setSort(e.target.value); setPage(1); }}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest First</option>
                <option value="citations">Most Cited</option>
                <option value="views">Most Read</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full py-2 px-3 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium text-center"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-900">{publications.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{meta.total}</span> repository records
          {query && <span> for query &ldquo;<span className="font-medium text-slate-800">{query}</span>&rdquo;</span>}
        </div>
        {loading && (
          <div className="flex items-center gap-1.5 text-teal-600">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Fetching scholarly records...</span>
          </div>
        )}
      </div>

      {/* Main Results List */}
      <div className="space-y-4">
        {publications.map((pub) => (
          <article
            key={pub.id}
            className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 p-6 shadow-sm transition-all space-y-3"
          >
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold px-2.5 py-0.5 rounded text-[11px] ${
                    pub.reviewStatus === 'PEER_REVIEWED'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {pub.reviewStatus === 'PEER_REVIEWED' ? '✓ Peer-Reviewed Article' : 'Preprint (Unreviewed)'}
                </span>

                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium">
                  {pub.documentType.replace(/_/g, ' ')}
                </span>

                {pub.isOpenAccess && (
                  <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded text-[11px] font-medium border border-teal-200">
                    Open Access
                  </span>
                )}

                {pub.region === 'ETHIOPIA' && (
                  <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[11px] font-medium border border-blue-200">
                    Ethiopia / Horn of Africa
                  </span>
                )}
              </div>

              <div className="text-slate-400 font-mono text-xs">
                <span>Year: {pub.publicationYear}</span>
                {pub.doi && <span className="ml-3">DOI: {pub.doi}</span>}
              </div>
            </div>

            {/* Title */}
            <h2
              onClick={() => onNavigate('publication', pub.id)}
              className="text-base sm:text-lg font-bold text-slate-900 hover:text-teal-700 cursor-pointer leading-snug"
            >
              {pub.title}
            </h2>

            {/* Authors */}
            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5">
              <span className="font-medium text-slate-500">Authors:</span>
              {pub.authors?.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAuthor(a);
                    setSelectedSubmitter(pub.submitter || null);
                    setAuthorModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-slate-800 font-semibold hover:text-teal-700 bg-slate-50 hover:bg-teal-50 px-2 py-0.5 rounded-lg border border-slate-200/80 transition-colors cursor-pointer"
                  title="Click to view author profile, affiliations & follow"
                >
                  <span>{a.name}</span>
                </button>
              ))}
              {pub.venue && (
                <span className="text-slate-500 italic ml-2">&bull; {pub.venue}</span>
              )}
            </div>

            {/* Abstract */}
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
              {pub.abstract}
            </p>

            {/* Keywords */}
            {pub.keywords && pub.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {pub.keywords.slice(0, 6).map((kw, i) => (
                  <span
                    key={i}
                    onClick={() => { setQuery(kw); setPage(1); }}
                    className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 px-2 py-0.5 rounded cursor-pointer border border-slate-200"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}

            {/* Footer row with stats and actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span>Citations: <strong className="text-slate-800">{pub.metricsCitations}</strong></span>
                <span>Views: <strong className="text-slate-800">{pub.metricsViews}</strong></span>
                <span>Downloads: <strong className="text-slate-800">{pub.metricsDownloads}</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedForExport(pub)}
                  className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 font-medium text-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Cite</span>
                </button>

                <button
                  onClick={() => toggleBookmark(pub.id)}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium text-xs transition-colors ${
                    bookmarkedIds.has(pub.id)
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{bookmarkedIds.has(pub.id) ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => onNavigate('publication', pub.id)}
                  className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded font-medium text-xs transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </article>
        ))}

        {/* External Scholarly API Ingestion Results (OpenAlex, Crossref, arXiv) */}
        {externalResults && externalResults.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <h3 className="text-sm font-bold text-slate-800">
                  External Scholarly Metadata (OpenAlex, Crossref & arXiv)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">Live API Ingestion & Provenance Verified</span>
            </div>

            {externalResults.map((ext, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 border border-dashed border-slate-300 rounded-xl p-5 space-y-2 hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                    Provider: {ext.source}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{ext.publicationYear}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{ext.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{ext.abstract}</p>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Venue: {ext.venue || 'Indexed Scholarly Repository'}</span>
                  {ext.doi && (
                    <a
                      href={`https://doi.org/${ext.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline flex items-center gap-1"
                    >
                      <span>DOI Resolver</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && publications.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching research records found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn&apos;t find any records matching your criteria. Try adjusting your keyword search, resetting filters, or searching for broader terms.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-500"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-600 px-3">
              Page {page} of {meta.totalPages}
            </span>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {selectedForExport && (
        <CitationExportModal
          publication={selectedForExport}
          isOpen={!!selectedForExport}
          onClose={() => setSelectedForExport(null)}
        />
      )}

      {/* Author Details Modal */}
      {authorModalOpen && selectedAuthor && (
        <AuthorDetailModal
          isOpen={authorModalOpen}
          onClose={() => {
            setAuthorModalOpen(false);
            setSelectedAuthor(null);
            setSelectedSubmitter(null);
          }}
          author={selectedAuthor}
          submitter={selectedSubmitter}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
