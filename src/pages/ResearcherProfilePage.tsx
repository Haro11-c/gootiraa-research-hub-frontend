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
  Coins,
  ArrowDownRight,
  Sparkles,
  Clock,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { api } from '../api/client';
import { UserProfile, Publication } from '../types';
import { CollabRequestModal } from '../components/CollabRequestModal';
import { TipScholarModal } from '../components/TipScholarModal';
import { WithdrawalModal } from '../components/WithdrawalModal';
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

  // Wallet & Monetization state
  const [wallet, setWallet] = useState<any>(null);
  const [bounties, setBounties] = useState<any[]>([]);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [researcherId, currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getResearcherProfile(researcherId);
      setProfile(data);

      // If viewing own profile or logged in as this user, load wallet & bounties
      if (currentUser?.id === data.userId) {
        try {
          const [walletData, bountyData] = await Promise.all([
            api.getWallet(),
            api.getBounties(),
          ]);
          setWallet(walletData);
          setBounties(bountyData);
        } catch (wErr) {
          console.warn('Could not load wallet data:', wErr);
        }
      }
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

  const handleWalletRefresh = async () => {
    try {
      const walletData = await api.getWallet();
      setWallet(walletData);
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

  const isOwnProfile = currentUser?.id === profile.userId;

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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!isOwnProfile ? (
              <>
                {/* Tip Scholar Button */}
                <button
                  onClick={() => setTipModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Coins className="w-4 h-4" />
                  <span>Support Lab / Tip</span>
                </button>

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
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-teal-50 text-teal-800 text-xs font-bold rounded-lg border border-teal-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  Your Author Profile
                </span>
                {wallet && (
                  <button
                    onClick={() => setWithdrawalModalOpen(true)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Redeem Credits ({wallet.balanceCredits} RC)</span>
                  </button>
                )}
              </div>
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

      {/* OWN PROFILE: Impact Wallet & Earnings Dashboard Card */}
      {isOwnProfile && wallet && (
        <div className="bg-gradient-to-br from-white to-teal-50/30 rounded-2xl border border-teal-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-teal-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 border border-amber-300 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Research Impact Wallet & Earnings</h2>
                <p className="text-xs text-slate-600">
                  Earned via direct reader patronage, research grants, and peer bounties (1,000 RC = 1,000 ETB / ~$20 USD)
                </p>
              </div>
            </div>

            <button
              onClick={() => setWithdrawalModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Request Payout</span>
            </button>
          </div>

          {/* Balances Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-teal-100 shadow-sm space-y-1">
              <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>Available Credits</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {wallet.balanceCredits.toLocaleString()} <span className="text-xs font-bold text-teal-600">RC</span>
              </div>
              <div className="text-xs text-emerald-700 font-semibold pt-1">
                &asymp; ETB {wallet.balanceCredits.toLocaleString()} (~${(wallet.balanceCredits * 0.01).toFixed(2)} USD)
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>Total Lifetime Earned</span>
                <TrendingUp className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {wallet.totalEarnedCredits.toLocaleString()} <span className="text-xs font-bold text-slate-500">RC</span>
              </div>
              <div className="text-xs text-slate-500 pt-1">
                From publication tips & incentives
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>Total Redeemed Payouts</span>
                <CreditCard className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {wallet.totalWithdrawnCredits.toLocaleString()} <span className="text-xs font-bold text-slate-500">RC</span>
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Via Telebirr, CBE & Bank Wire
              </div>
            </div>
          </div>

          {/* Transactions Ledger */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Recent Wallet Ledger & Patronage
            </h3>

            {wallet.transactions && wallet.transactions.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Description / Sender</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {wallet.transactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-800">
                          {tx.type.replace(/_/g, ' ')}
                        </td>
                        <td className="p-3 font-mono font-bold">
                          <span className={tx.amountCredits > 0 ? 'text-emerald-700' : 'text-red-700'}>
                            {tx.amountCredits > 0 ? `+${tx.amountCredits}` : tx.amountCredits} RC
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">
                          {tx.description} {tx.senderName ? `(${tx.senderName})` : ''}
                        </td>
                        <td className="p-3 text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : tx.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-white rounded-xl border border-slate-100">
                No wallet transactions recorded yet.
              </p>
            )}
          </div>

          {/* Sponsored Research Bounties Available to Claim */}
          {bounties && bounties.length > 0 && (
            <div className="pt-4 border-t border-teal-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                  Open Research Bounties & Grant Calls ({bounties.length})
                </h3>
                <span className="text-[11px] text-teal-700 font-semibold">Funded by Academic Partners</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bounties.map((bounty: any) => (
                  <div
                    key={bounty.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-400 transition-all space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        {bounty.sponsorName}
                      </span>
                      <span className="font-mono font-extrabold text-amber-600 text-xs">
                        {bounty.rewardCredits.toLocaleString()} RC Bounty
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs leading-snug">{bounty.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{bounty.description}</p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Requirement: {bounty.deliverableType}</span>
                      <button
                        onClick={() => onNavigate('submit')}
                        className="text-teal-700 font-bold hover:underline"
                      >
                        Submit Evidence &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
                  <div className="flex items-center gap-3">
                    {!isOwnProfile && (
                      <button
                        onClick={() => {
                          setTipModalOpen(true);
                        }}
                        className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Tip Paper</span>
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate('publication', pub.id)}
                      className="text-teal-700 font-semibold hover:underline"
                    >
                      View Record & Citation &rarr;
                    </button>
                  </div>
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

      {/* Tip Scholar Modal */}
      {tipModalOpen && (
        <TipScholarModal
          receiverUserId={profile.userId}
          receiverName={profile.fullName}
          isOpen={tipModalOpen}
          onClose={() => setTipModalOpen(false)}
        />
      )}

      {/* Withdrawal Modal */}
      {withdrawalModalOpen && wallet && (
        <WithdrawalModal
          balanceCredits={wallet.balanceCredits}
          isVerified={profile.verifiedStatus === 'VERIFIED'}
          isOpen={withdrawalModalOpen}
          onClose={() => setWithdrawalModalOpen(false)}
          onSuccess={handleWalletRefresh}
        />
      )}
    </div>
  );
};
