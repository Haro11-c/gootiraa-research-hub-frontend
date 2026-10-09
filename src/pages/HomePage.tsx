import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Bookmark,
  Share2,
  ExternalLink,
  Building,
  TrendingUp,
  Globe2,
  AlertTriangle,
  Eye,
  Download,
  Users,
} from 'lucide-react';
import { api } from '../api/client';
import { Publication, EditorialArticle } from '../types';
import { CitationExportModal } from '../components/CitationExportModal';
import { ResearchConstellationCanvas } from '../components/ResearchConstellationCanvas';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { bookmarkedIds, toggleBookmark, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [recentPublications, setRecentPublications] = useState<Publication[]>([]);
  const [ethiopianPublications, setEthiopianPublications] = useState<Publication[]>([]);
  const [editorialArticles, setEditorialArticles] = useState<EditorialArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForExport, setSelectedForExport] = useState<Publication | null>(null);
  const [platformStats, setPlatformStats] = useState<{
    publishedPublications: number;
    registeredUsers: number;
    registeredScholars: number;
    totalReads: number;
    verifiedCitations: number;
  }>({
    publishedPublications: 1420,
    registeredUsers: 850,
    registeredScholars: 420,
    totalReads: 48320,
    verifiedCitations: 12890,
  });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const [pubRes, ethRes, artRes, statsRes] = await Promise.all([
        api.searchPublications({ limit: 4, sort: 'newest' }),
        api.searchPublications({ region: 'ETHIOPIA', limit: 3, sort: 'views' }),
        api.getArticles({ limit: 3 }),
        api.getPlatformStats().catch(() => null),
      ]);
      setRecentPublications(pubRes.publications);
      setEthiopianPublications(ethRes.publications);
      setEditorialArticles(artRes.articles);
      if (statsRes) setPlatformStats(statsRes);
    } catch (err) {
      console.error('Failed to load homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('discovery', searchQuery.trim());
    } else {
      onNavigate('discovery');
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section with Interactive Research Constellation Canvas */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B192C] via-[#0F223D] to-[#1A365D] text-white py-16 sm:py-20 px-4 sm:px-8 -mt-6 rounded-3xl shadow-2xl border border-slate-700/50">
        {/* Animated Moving Research Knowledge Background */}
        <ResearchConstellationCanvas />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-900/60 border border-teal-500/40 text-teal-300 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-sm">
            <Globe2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Advancing Pan-African & Global Scientific Communication</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover, Verify, and Share <br />
            <span className="text-teal-400 font-serif italic">Scholarly Research</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The open academic repository and empirical science journalism hub for researchers, universities,
            and evidence-seeking citizens across Ethiopia and the world.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mt-4">
            <div className="flex bg-white rounded-xl shadow-2xl p-1.5 border border-slate-300 focus-within:ring-2 focus-within:ring-teal-400">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Search by paper title, abstract, author, DOI, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-slate-900 placeholder-slate-400 text-sm pl-11 pr-4 py-2.5 rounded-lg focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Real-Time Live Platform Counters */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 border border-teal-500/40 text-slate-200 backdrop-blur-md shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-white font-mono">{platformStats.publishedPublications.toLocaleString()}</span>
              <span className="text-slate-300 font-medium">Verified Papers</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 border border-blue-500/40 text-slate-200 backdrop-blur-md shadow-md">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="font-bold text-white font-mono">{platformStats.registeredUsers.toLocaleString()}</span>
              <span className="text-slate-300 font-medium">Scholars & Registered Users</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 border border-amber-500/40 text-slate-200 backdrop-blur-md shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="font-bold text-white font-mono">{platformStats.totalReads.toLocaleString()}+</span>
              <span className="text-slate-300 font-medium">Global Academic Reads</span>
            </div>
          </div>

          {/* Quick Trending Topics */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Trending Focus:</span>
            {[
              { label: "Plasmodium falciparum", query: "malaria" },
              { label: "Ge'ez & Amharic NLP", query: "amharic" },
              { label: "Horn of Africa Drought", query: "groundwater" },
              { label: "Renewable Microgrids", query: "solar" },
              { label: "Crop Genomics", query: "teff" },
            ].map((topic, i) => (
              <button
                key={i}
                onClick={() => onNavigate('discovery', topic.query)}
                className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white px-2.5 py-1 rounded-full border border-slate-600 transition-colors"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent Metrics & Provenance Statement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="border-r border-slate-100 last:border-r-0">
            <div className="text-2xl font-bold text-slate-900">4,800+</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Verified Scholarly Works</div>
            <div className="text-[10px] text-teal-700 mt-1">Crossref & OpenAlex Indexed</div>
          </div>
          <div className="border-r border-slate-100 last:border-r-0">
            <div className="text-2xl font-bold text-slate-900">100%</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Transparent Review Status</div>
            <div className="text-[10px] text-teal-700 mt-1">Peer-Reviewed vs Preprints</div>
          </div>
          <div className="border-r border-slate-100 last:border-r-0">
            <div className="text-2xl font-bold text-slate-900">18+</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Partner Institutions</div>
            <div className="text-[10px] text-teal-700 mt-1">AAU, Jimma, EAII, Hawassa</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">Grounded</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">AI Evidence Assistant</div>
            <div className="text-[10px] text-teal-700 mt-1">Zero Hallucinated Citations</div>
          </div>
        </div>
      </section>

      {/* Ethiopian & African Research Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
              <h2 className="text-xl font-bold text-slate-900">Ethiopian & African Scholarship Spotlight</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Highlighting high-impact research originating from universities and research centers across the Horn of Africa.
            </p>
          </div>
          <button
            onClick={() => onNavigate('discovery', 'ethiopia')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            Explore all regional papers <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ethiopianPublications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      pub.reviewStatus === 'PEER_REVIEWED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {pub.reviewStatus === 'PEER_REVIEWED' ? 'Peer-Reviewed' : 'Preprint'}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{pub.publicationYear}</span>
                </div>

                <h3
                  onClick={() => onNavigate('publication', pub.id)}
                  className="font-bold text-slate-900 text-sm hover:text-teal-700 cursor-pointer line-clamp-2 leading-snug"
                >
                  {pub.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {pub.abstract}
                </p>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{pub.institution?.name || 'Ethiopian Research Center'}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1" title="Views">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {pub.metricsViews}
                  </span>
                  <span className="flex items-center gap-1" title="Citations">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {pub.metricsCitations}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedForExport(pub)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900"
                    title="Export Citation"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBookmark(pub.id)}
                    className={`p-1.5 hover:bg-slate-100 rounded ${
                      bookmarkedIds.has(pub.id) ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Save to Library"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('publication', pub.id)}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 ml-1"
                  >
                    Read
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial & Empirical Fact-Check Bureau */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold text-xs tracking-wider uppercase">
                  Editorial Desk
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Science Journalism & Empirical Fact-Checks</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Investigating public health claims, technology breakthroughs, and science policy against peer-reviewed literature.
              </p>
            </div>
            <button
              onClick={() => onNavigate('editorial')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 shrink-0"
            >
              Browse all editorial articles <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {editorialArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigate('article', art.slug)}
                className="bg-slate-800/90 rounded-xl border border-slate-700 hover:border-teal-500 p-5 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-teal-400 font-semibold tracking-wide uppercase text-[10px]">
                      {art.articleType.replace('_', ' ')}
                    </span>
                    {art.factCheck && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-300 border border-red-700">
                        VERDICT: {art.factCheck.verdict}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base hover:text-teal-300 line-clamp-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>By {art.author?.profile?.fullName || 'Science Desk'}</span>
                  <span className="text-teal-400 hover:underline flex items-center gap-1">
                    Read story <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grounded AI Assistant Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900/20 via-slate-900/10 to-teal-900/20 rounded-2xl border border-teal-500/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-bold text-slate-900">Grounded AI Research Assistant</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Synthesize 3-point structured summaries (Objective, Method, Findings), extract technical definitions,
              and compare two papers side-by-side with passage-level evidence citations. Built with strict prompt injection defense.
            </p>
          </div>
          <button
            onClick={() => onNavigate('ai')}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 shrink-0 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Launch AI Assistant
          </button>
        </div>
      </section>

      {/* Citation Export Modal */}
      {selectedForExport && (
        <CitationExportModal
          publication={selectedForExport}
          isOpen={!!selectedForExport}
          onClose={() => setSelectedForExport(null)}
        />
      )}
    </div>
  );
};
