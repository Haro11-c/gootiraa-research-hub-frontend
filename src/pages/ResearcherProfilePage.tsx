import React, { useState, useEffect } from 'react';
import {
  User,
  Building,
  Award,
  BookOpen,
  Share2,
  Users,
  Mail,
  ExternalLink,
  ShieldCheck,
  Check,
  Plus,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import { api } from '../api/client';
import { UserProfile, Publication } from '../types';
import { CollabRequestModal } from '../components/CollabRequestModal';
import { useAuth } from '../context/AuthContext';

interface ResearcherProfilePageProps {
  researcherId: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const ResearcherProfilePage: React.FC<ResearcherProfilePageProps> = ({ researcherId, onNavigate }) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [collabModalOpen, setCollabModalOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [researcherId]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getResearcherProfile(researcherId);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load researcher profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    try {
      const res = await api.toggleFollow(researcherId);
      setIsFollowing(res.following);
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500">Loading researcher profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Profile Not Found</h2>
        <p className="text-xs text-slate-600">{error || 'Researcher profile could not be located.'}</p>
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
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0 border border-slate-700">
              {profile.fullName?.[0] || 'R'}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{profile.fullName}</h1>
                {profile.verifiedStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Scholar
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-700">
                {profile.academicTitle || 'Academic Researcher'}
              </p>

              {profile.institution && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.institution.name} {profile.department ? `— ${profile.department}` : ''}</span>
                </div>
              )}

              {profile.orcidId && (
                <div className="flex items-center gap-1 text-xs text-green-700 font-mono pt-1">
                  <Award className="w-3.5 h-3.5" />
                  <a
                    href={`https://orcid.org/${profile.orcidId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-0.5"
                  >
                    ORCID: {profile.orcidId}
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Follow and Collaboration Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser?.id !== profile.userId && (
              <>
                <button
                  onClick={handleToggleFollow}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    isFollowing
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
                  }`}
                >
                  {isFollowing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isFollowing ? 'Following' : 'Follow Researcher'}</span>
                </button>

                <button
                  onClick={() => setCollabModalOpen(true)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Request Collaboration</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Biography */}
        {profile.bio && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Biographical Profile & Research Focus
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xl font-bold text-slate-900">{profile.publicationsCount || profile.publications?.length || 0}</div>
            <div className="text-[11px] text-slate-500 font-medium">Publications</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xl font-bold text-teal-700">{profile.citationCount || 0}</div>
            <div className="text-[11px] text-slate-500 font-medium">Verified Citations</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xl font-bold text-slate-900">{profile.viewsCount || 0}</div>
            <div className="text-[11px] text-slate-500 font-medium">Profile Views</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xl font-bold text-slate-900">{profile.followersCount || 0}</div>
            <div className="text-[11px] text-slate-500 font-medium">Scholarly Followers</div>
          </div>
        </div>
      </div>

      {/* Publications Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Authored & Co-Authored Publications ({profile.publications?.length || 0})
        </h2>

        <div className="space-y-4">
          {profile.publications && profile.publications.length > 0 ? (
            profile.publications.map((pub: any) => (
              <div
                key={pub.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-teal-400 transition-all space-y-2 shadow-sm"
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
                  <span className="text-slate-400 font-mono text-xs">{pub.publicationYear}</span>
                </div>

                <h3
                  onClick={() => onNavigate('publication', pub.id)}
                  className="font-bold text-slate-900 text-sm sm:text-base hover:text-teal-700 cursor-pointer"
                >
                  {pub.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">{pub.abstract}</p>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Citations: <strong>{pub.metricsCitations}</strong></span>
                  <button
                    onClick={() => onNavigate('publication', pub.id)}
                    className="text-teal-700 font-semibold hover:underline"
                  >
                    View Record & Citation &rarr;
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No public publications indexed under this profile yet.
            </div>
          )}
        </div>
      </div>

      {/* Collaboration Modal */}
      {collabModalOpen && (
        <CollabRequestModal
          receiverId={profile.userId}
          receiverName={profile.fullName}
          isOpen={collabModalOpen}
          onClose={() => setCollabModalOpen(false)}
        />
      )}
    </div>
  );
};
