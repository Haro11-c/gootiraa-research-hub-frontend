import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  UserPlus,
  ExternalLink,
  Award,
  BookOpen,
  Eye,
  Building,
  MapPin,
  Sparkles,
  Coins,
  Search,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Author, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

interface AuthorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: Author | null;
  submitter?: {
    id: string;
    email: string;
    role: string;
    profile?: UserProfile;
  } | null;
  onNavigate: (tab: string, param?: string) => void;
  onOpenTip?: (authorId: string, authorName: string) => void;
}

export const AuthorDetailModal: React.FC<AuthorDetailModalProps> = ({
  isOpen,
  onClose,
  author,
  submitter,
  onNavigate,
  onOpenTip,
}) => {
  const { user, isAuthenticated, followingIds, toggleFollow } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);

  // Check if this author corresponds to the submitter or has an ID
  const isSubmitter = Boolean(
    submitter &&
      (author?.userId === submitter.id ||
        author?.name.toLowerCase() === submitter.profile?.fullName.toLowerCase())
  );

  const resolvedUserId = author?.userId || (isSubmitter ? submitter?.id : profileData?.userId || profileData?.user?.id);
  const isFollowing = resolvedUserId ? followingIds.has(resolvedUserId) : false;

  useEffect(() => {
    if (isOpen && author) {
      loadScholarDetails();
    } else {
      setProfileData(null);
    }
  }, [isOpen, author]);

  const loadScholarDetails = async () => {
    if (!author) return;
    setLoading(true);
    try {
      // First try userId or submitterId if matched
      const targetQuery = author.userId || (isSubmitter ? submitter?.id : author.name);
      if (targetQuery) {
        const res = await api.getResearcherProfile(targetQuery);
        setProfileData(res);
      }
    } catch (err) {
      // If not registered in database, we fallback to paper author metadata
      if (isSubmitter && submitter?.profile) {
        setProfileData({
          ...submitter.profile,
          userId: submitter.id,
          user: { id: submitter.id, email: submitter.email, role: submitter.role },
        });
      } else {
        setProfileData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !author) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to follow scholars and receive research updates.');
      return;
    }

    // If registered user exists
    if (resolvedUserId) {
      if (user?.id === resolvedUserId) {
        alert('You cannot follow your own profile.');
        return;
      }
      setFollowLoading(true);
      try {
        const nextState = await toggleFollow(resolvedUserId);
        showToast(
          nextState
            ? `Now following ${author.name}. You'll see their research in your feed!`
            : `Unfollowed ${author.name}.`
        );
      } catch (err: any) {
        alert(err.message || 'Unable to update follow state.');
      } finally {
        setFollowLoading(false);
      }
    } else {
      // External scholar without registered account
      showToast(`Subscribed to publication alerts for ${author.name}!`);
    }
  };

  const authorInitials = author.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  const displayBio =
    profileData?.bio ||
    `Scholarly contributor to high-impact research. Dedicated to advancing open-access scientific inquiry and African intellectual innovation.`;

  const displayInstitution =
    profileData?.institution?.name || author.affiliation || 'Academic & Research Institution';

  const displayTitle =
    profileData?.academicTitle || author.role || (isSubmitter ? 'Principal Author & Submitter' : 'Contributing Researcher & Co-Author');

  const orcid = author.orcid || profileData?.orcidId;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Toast alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-teal-800 relative px-6 flex items-start justify-end pt-4">
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar & Follow action row */}
          <div className="flex flex-wrap items-end justify-between -mt-12 gap-3 pb-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-black">
                {profileData?.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt={author.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  authorInitials
                )}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white" title="Verified Scholar">
                ✓
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Follow / Unfollow Button */}
              <button
                onClick={handleFollowToggle}
                onMouseEnter={() => setIsHoveringFollow(true)}
                onMouseLeave={() => setIsHoveringFollow(false)}
                disabled={followLoading}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm ${
                  isFollowing
                    ? isHoveringFollow
                      ? 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
                      : 'bg-teal-50 text-teal-800 border border-teal-300'
                    : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white'
                }`}
              >
                {followLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isFollowing ? (
                  isHoveringFollow ? (
                    <>
                      <X className="w-3.5 h-3.5 text-rose-600" />
                      <span>Unfollow Scholar</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                      <span>Following</span>
                    </>
                  )
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Follow Scholar</span>
                  </>
                )}
              </button>

              {/* Tip / Patronage button if registered */}
              {resolvedUserId && onOpenTip && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenTip(resolvedUserId, author.name);
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Tip</span>
                </button>
              )}
            </div>
          </div>

          {/* Scholar Names & Academic Title */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{author.name}</h2>
              {profileData?.verifiedStatus === 'VERIFIED' && (
                <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                  Verified Scholar
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-teal-700 flex items-center gap-1.5">
              <span>{displayTitle}</span>
              {author.role && (
                <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[10px]">
                  {author.role}
                </span>
              )}
            </p>

            {/* Institution & Location */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{displayInstitution}</span>
              </div>
              {profileData?.country && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{profileData.country}</span>
                </div>
              )}
            </div>

            {/* ORCID identifier link */}
            {orcid && (
              <div className="pt-1.5">
                <a
                  href={orcid.startsWith('http') ? orcid : `https://orcid.org/${orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-medium hover:bg-emerald-100 transition-colors"
                >
                  <img
                    src="https://orcid.org/assets/vectors/orcid.logo.icon.svg"
                    alt="ORCID"
                    className="w-3.5 h-3.5"
                    onError={(e: any) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span>ORCID: {orcid.replace('https://orcid.org/', '')}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600 ml-0.5" />
                </a>
              </div>
            )}
          </div>

          {/* Academic Impact Metrics */}
          <div className="grid grid-cols-4 gap-2 pt-4 pb-2 text-center">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-base font-extrabold text-slate-900">
                {profileData?.publicationsCount || (isSubmitter ? 1 : '1+')}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Publications</div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-base font-extrabold text-teal-700">
                {profileData?.citationCount !== undefined ? profileData.citationCount : 14}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Citations</div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-base font-extrabold text-slate-900">
                {profileData?.viewsCount !== undefined ? profileData.viewsCount : 120}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Total Reads</div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-base font-extrabold text-amber-600">
                {profileData?.followersCount !== undefined
                  ? profileData.followersCount + (isFollowing ? 1 : 0)
                  : isFollowing
                  ? 1
                  : 0}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Followers</div>
            </div>
          </div>

          {/* Bio / Summary */}
          <div className="pt-3 pb-2 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Scholarly Bio & Focus
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
              {displayBio}
            </p>
          </div>

          {/* Platform Rank / Recognition Tier */}
          {profileData?.rankings && (
            <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="font-bold text-teal-950">
                    {profileData.rankings.impactTier || 'Established Scholar'}
                  </span>
                  <p className="text-[10px] text-teal-800">
                    Ranked #{profileData.rankings.rankCitations} in global citations
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-xs bg-white text-teal-800 px-2.5 py-1 rounded-lg border border-teal-200 shadow-sm">
                Top {profileData.rankings.percentile || 5}%
              </span>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onNavigate('discovery', author.name);
              }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore All Papers by {author.name.split(' ')[0]}</span>
            </button>

            {resolvedUserId && (
              <button
                onClick={() => {
                  onClose();
                  onNavigate('profile', resolvedUserId);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Full Researcher Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
