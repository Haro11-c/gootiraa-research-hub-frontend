import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  BookOpen,
  Share2,
  Trash2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { api } from '../api/client';
import { Publication } from '../types';
import { useAuth } from '../context/AuthContext';
import { CitationExportModal } from '../components/CitationExportModal';

interface LibraryPageProps {
  onNavigate: (tab: string, param?: string) => void;
  onOpenAuth: () => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate, onOpenAuth }) => {
  const { user, isAuthenticated, bookmarkedIds, toggleBookmark } = useAuth();
  const [savedPublications, setSavedPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForExport, setSelectedForExport] = useState<Publication | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedPublications();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, bookmarkedIds]);

  const loadSavedPublications = async () => {
    setLoading(true);
    try {
      const res = await api.searchPublications({ limit: 50 });
      // Filter publications that are in bookmarkedIds
      const bookmarked = res.publications.filter((p) => bookmarkedIds.has(p.id));
      setSavedPublications(bookmarked);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Personal Research Library</h2>
        <p className="text-xs text-slate-500">
          Sign in to save papers, build reading lists, and organize citations across your research projects.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-500"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Personal Research Library</h1>
          <p className="text-xs text-slate-500 mt-1">
            {savedPublications.length} saved papers in your reading collection.
          </p>
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {savedPublications.length > 0 ? (
          savedPublications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 p-5 shadow-sm space-y-3 transition-all"
            >
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
                className="font-bold text-slate-900 text-base hover:text-teal-700 cursor-pointer"
              >
                {pub.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2">{pub.abstract}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Citations: <strong>{pub.metricsCitations}</strong></span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedForExport(pub)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                    title="Cite Paper"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleBookmark(pub.id)}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                    title="Remove from Library"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('publication', pub.id)}
                    className="text-xs font-semibold text-teal-700 hover:underline ml-2"
                  >
                    View Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Your library is currently empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bookmark publications as you browse discovery or search results to curate your personal bibliography.
            </p>
            <button
              onClick={() => onNavigate('discovery')}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-500"
            >
              Browse Publications
            </button>
          </div>
        )}
      </div>

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
