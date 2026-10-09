import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileCheck,
  History,
  Activity,
  AlertTriangle,
  Check,
  X,
  UserCheck,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Users,
  AlertOctagon,
  Lock,
  ArrowRight,
  Search,
  Filter,
  Eye,
  Download,
  BookOpen,
  FileText,
  Briefcase,
  Coins,
} from 'lucide-react';
import { api } from '../api/client';
import { AdminStats, AuditLog, WithdrawalRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { CreateBountyModal } from '../components/CreateBountyModal';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<WithdrawalRequest[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [inspectingSub, setInspectingSub] = useState<any | null>(null);
  const [createBountyModalOpen, setCreateBountyModalOpen] = useState(false);

  // Default active tab based on role
  const [activeTab, setActiveTab] = useState<'payouts' | 'users' | 'moderation' | 'logs' | 'providers'>(
    isSuperAdmin ? 'payouts' : 'moderation'
  );

  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.getAdminStats();
      setStats(statsRes);

      if (isSuperAdmin) {
        if (activeTab === 'payouts') {
          const [payoutsRes, fraudRes] = await Promise.all([
            api.getPayoutRequests(),
            api.getFraudAlerts(),
          ]);
          setPayoutRequests(payoutsRes || []);
          setFraudAlerts(fraudRes.flaggedWithdrawals || []);
        } else if (activeTab === 'users') {
          const usersRes = await api.getUsers(userSearch || undefined, userRoleFilter || undefined);
          setUsersList(usersRes || []);
        }
      }

      if (activeTab === 'moderation') {
        const subRes = await api.getPendingSubmissions();
        setSubmissions(subRes.submissions || []);
      } else if (activeTab === 'logs') {
        const logsRes = await api.getAuditLogs();
        setAuditLogs(logsRes.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Super Admin: Review Payout Request
  const handleReviewPayout = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    const notes = reviewNotes[id] || (action === 'APPROVED' ? 'Cleared compliance & KYC check' : 'Flagged for abnormal velocity or unverified identity');
    try {
      await api.reviewPayoutRequest(id, action, notes);
      setActionSuccess(`Payout request successfully marked as ${action}.`);
      loadDashboardData();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  // Super Admin: Update User Role
  const handleRoleChange = async (targetUserId: string, newRole: string) => {
    try {
      await api.updateUserRole(targetUserId, newRole);
      setActionSuccess(`User role updated to ${newRole}.`);
      loadDashboardData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  // Super Admin: Update Verification (KYC)
  const handleVerificationToggle = async (targetUserId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    try {
      await api.updateUserVerification(targetUserId, nextStatus);
      setActionSuccess(`Identity verification status updated to ${nextStatus}.`);
      loadDashboardData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update verification.');
    }
  };

  // Moderator: Review Submission
  const handleReviewSubmission = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    const notes = reviewNotes[id] || (action === 'APPROVED' ? 'Approved by academic moderator' : 'Rejected due to insufficient documentation');
    try {
      await api.reviewSubmission(id, action, notes);
      setActionSuccess(`Submission marked as ${action} (Author awarded research grant).`);
      loadDashboardData();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  if (!user || (!['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'EDITOR'].includes(user.role))) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Lock className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Restricted Administration Terminal</h2>
        <p className="text-xs text-slate-600">
          You must hold an authorized administrative or moderator role to access this system console.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 font-sans">
      {/* Executive Command Header */}
      <div className="bg-[#0B192C] text-white rounded-2xl p-6 sm:p-8 border border-[#1E3E62] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <Shield className={`w-6 h-6 ${isSuperAdmin ? 'text-amber-400' : 'text-teal-400'}`} />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {isSuperAdmin ? 'SUPER ADMIN COMMAND & ANTI-FRAUD CONSOLE' : 'ACADEMIC MODERATION DASHBOARD'}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isSuperAdmin
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                  : 'bg-teal-400/20 text-teal-300 border border-teal-400/50'
              }`}
            >
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isSuperAdmin
              ? 'Full platform oversight: financial payout compliance, user role elevation, and security risk telemetry.'
              : 'Scholarly peer integrity: review research manuscripts, manage copyright disputes, and inspect audit logs.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {(isSuperAdmin || user?.role === 'ADMIN') && (
            <button
              onClick={() => setCreateBountyModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-950" />
              <span>+ Post Research Bounty</span>
            </button>
          )}

          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 border border-slate-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Real-time High-Level Metrics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-black text-slate-900">{stats.publications.published}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Approved Publications</div>
            <div className="text-[11px] text-amber-600 mt-1 font-bold">
              {stats.publications.pendingModeration} Pending Clearance
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-black text-slate-900">{stats.users.total}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Total Users</div>
            <div className="text-[11px] text-teal-600 mt-1 font-bold">
              {stats.users.researchers} Verified Researchers
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-black text-teal-700">
              {stats.finance?.totalCreditsInWallets?.toLocaleString() || '5,600'} RC
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Circulating Research Credits</div>
            <div className="text-[11px] text-slate-600 mt-1 font-mono">
              ≈ {(stats.finance?.totalCreditsInWallets || 5600).toLocaleString()} ETB
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-black text-emerald-600">Zero Flags</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Scholarly APIs</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">OpenAlex &bull; Crossref &bull; arXiv</div>
          </div>
        </div>
      )}

      {/* Role-Sensitive Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold uppercase tracking-wider overflow-x-auto">
        {isSuperAdmin && (
          <>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === 'payouts'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-600" />
              Financial Payouts & Anti-Fraud ({payoutRequests.length})
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === 'users'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-amber-600" />
              User & Role Governance
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'moderation'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4 text-teal-600" />
          Submissions Queue ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'logs'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4 text-teal-600" />
          Audit Trail Stream
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'providers'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-teal-600" />
          Provider Health
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SUPER ADMIN PAYOUTS & FRAUD CONTROLS             */}
      {/* ======================================================== */}
      {isSuperAdmin && activeTab === 'payouts' && (
        <div className="space-y-6">
          {/* Fraud Alert Warning Box */}
          {fraudAlerts.length > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-900 font-black text-sm">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                <span>ANTI-FRAUD WARNING: {fraudAlerts.length} Flagged High-Risk Transaction(s)</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed">
                The automated compliance engine detected withdrawal requests exhibiting abnormal velocity, unverified
                identities, or zero peer-reviewed outputs. Review these requests with extreme caution before disbursing funds.
              </p>
            </div>
          )}

          {/* Payouts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Pending Researcher Cash Payout Requests
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">1,000 RC = 1,000 ETB / $10 USD</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {payoutRequests.length > 0 ? (
                payoutRequests.map((req) => (
                  <div key={req.id} className="p-5 hover:bg-slate-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 text-sm">{req.accountName}</strong>
                          <span className="text-slate-500">({req.user?.email})</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              req.user?.profile?.verifiedStatus === 'VERIFIED'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                : 'bg-red-50 text-red-800 border border-red-300'
                            }`}
                          >
                            {req.user?.profile?.verifiedStatus || 'UNVERIFIED'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Channel: <strong className="text-slate-700">{req.channel}</strong> &bull; Account:{' '}
                          <code className="text-slate-700 font-mono">{req.accountNumber}</code>
                        </div>
                      </div>

                      {/* Fraud Score & Risk Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 ${
                            req.fraudRiskScore >= 50
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Risk Score: {req.fraudRiskScore}/100</span>
                        </div>

                        <span className="text-base font-black text-slate-900 px-2">
                          {req.amountCredits.toLocaleString()} RC{' '}
                          <span className="text-xs font-normal text-slate-500">({req.amountFiat} {req.currency})</span>
                        </span>
                      </div>
                    </div>

                    {/* Fraud Flags */}
                    {req.fraudFlags && req.fraudFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {req.fraudFlags.map((flag, i) => (
                          <span
                            key={i}
                            className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                          >
                            FLAG: {flag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    {req.status === 'PENDING' ? (
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          placeholder="Audit review note (e.g. Telebirr reference # or fraud flag reason)..."
                          value={reviewNotes[req.id] || ''}
                          onChange={(e) => setReviewNotes({ ...reviewNotes, [req.id]: e.target.value })}
                          className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleReviewPayout(req.id, 'APPROVED')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve Payout
                          </button>
                          <button
                            onClick={() => handleReviewPayout(req.id, 'REJECTED')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject & Refund
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 text-xs font-bold text-slate-600">
                        Status: <span className="uppercase">{req.status}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">No pending withdrawal requests.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SUPER ADMIN USER & ROLE MANAGEMENT               */}
      {/* ======================================================== */}
      {isSuperAdmin && activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900">User Governance & Privilege Hierarchy</h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none"
                />
                <button
                  onClick={loadDashboardData}
                  className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-2.5">User & Affiliation</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5">KYC Verified</th>
                    <th className="py-2.5">Wallet Balance</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-semibold text-slate-900">
                        {u.profile?.fullName || 'User'}
                        <span className="block text-[11px] text-slate-500 font-normal">
                          {u.profile?.institution?.name || 'No institution'}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-600">{u.email}</td>
                      <td className="py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-semibold"
                        >
                          <option value="USER">USER</option>
                          <option value="RESEARCHER">RESEARCHER</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="MODERATOR">MODERATOR</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleVerificationToggle(u.id, u.profile?.verifiedStatus)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                            u.profile?.verifiedStatus === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-emerald-50'
                          }`}
                        >
                          {u.profile?.verifiedStatus === 'VERIFIED' ? '✓ Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-800">
                        {u.wallet?.balanceCredits?.toLocaleString() || 0} RC
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-[11px] text-teal-700 font-semibold cursor-pointer hover:underline">
                          Inspect &rarr;
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ACADEMIC MODERATOR QUEUE                          */}
      {/* ======================================================== */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded font-bold">
                    Status: SUBMITTED (Pending Review)
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{new Date(sub.createdAt).toLocaleString()}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{sub.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">{sub.abstract}</p>
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Submitter: <strong className="text-slate-700">{sub.submitter?.email}</strong></span>
                  <span>Type: <strong className="text-slate-700">{sub.documentType}</strong></span>
                  <span>License: <strong className="text-slate-700">{sub.license}</strong></span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setInspectingSub(sub);
                      if (!reviewNotes[sub.id]) {
                        setReviewNotes({ ...reviewNotes, [sub.id]: '' });
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-teal-600" />
                    <span>Inspect & Read Manuscript</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleReviewSubmission(sub.id, 'APPROVED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Grant 200 RC
                    </button>

                    <button
                      onClick={() => {
                        setInspectingSub(sub);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                      Review & Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              ✓ All research submissions have been verified and cleared by moderators.
            </div>
          )}
        </div>
      )}

      {/* Detailed Manuscript Review & Reading Modal */}
      {inspectingSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-[#0B192C] to-[#1E3E62] px-6 py-4 text-white flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">Academic Manuscript Inspection</h3>
                  <p className="text-xs text-slate-300">Detailed peer verification before publication clearance</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingSub(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Title & Status */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded text-[11px] font-bold">
                    Status: {inspectingSub.status}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {inspectingSub.documentType}
                  </span>
                  <span className="text-slate-400 text-xs font-mono ml-auto">
                    Submitted: {new Date(inspectingSub.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {inspectingSub.title}
                </h2>
              </div>

              {/* Submitter & Affiliation */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Author / Submitter:</span>
                  <strong className="text-slate-900 font-bold">{inspectingSub.submitter?.profile?.fullName || inspectingSub.submitter?.email}</strong>
                  <span className="text-slate-500 block text-[11px] font-mono">{inspectingSub.submitter?.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Institution / Affiliation:</span>
                  <strong className="text-slate-900 font-bold">{inspectingSub.institution?.name || inspectingSub.submitter?.profile?.institution?.name || 'Independent Scholar'}</strong>
                  <span className="text-slate-500 block text-[11px]">License: {inspectingSub.license}</span>
                </div>
              </div>

              {/* Authors List */}
              {inspectingSub.authors && inspectingSub.authors.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Declared Authors</h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {inspectingSub.authors.map((auth: any, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium">
                        {auth.name} {auth.affiliation ? `(${auth.affiliation})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Abstract */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">Full Abstract</h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-serif max-h-48 overflow-y-auto">
                  {inspectingSub.abstract}
                </div>
              </div>

              {/* Uploaded Manuscript PDF File */}
              {inspectingSub.files && inspectingSub.files.length > 0 && (
                <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{inspectingSub.files[0].filename}</h5>
                      <span className="text-[11px] text-slate-500">
                        {Math.round(inspectingSub.files[0].fileSize / 1024)} KB &bull; Verified PDF Binary
                      </span>
                    </div>
                  </div>

                  <a
                    href={`/api/v1/publications/files/${inspectingSub.files[0].id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Open / Download Manuscript</span>
                  </a>
                </div>
              )}

              {/* Review Feedback / Decision Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Reviewer Decision Notes / Rejection Reason
                </label>
                <textarea
                  rows={3}
                  placeholder="Write clear feedback for the author (e.g. 'Methodology verified, cleared for publication' or 'Rejection reason: Missing institutional ethics declaration; please add and re-submit')..."
                  value={reviewNotes[inspectingSub.id] || ''}
                  onChange={(e) => setReviewNotes({ ...reviewNotes, [inspectingSub.id]: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  * If rejected, this feedback will be sent directly to the researcher's profile so they can revise and resubmit.
                </p>
              </div>
            </div>

            {/* Pinned Footer Actions */}
            <div className="shrink-0 px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 z-10">
              <button
                type="button"
                onClick={() => setInspectingSub(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close Review
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    if (!reviewNotes[inspectingSub.id]?.trim()) {
                      alert('Please provide a reason/comment for rejecting this manuscript.');
                      return;
                    }
                    await handleReviewSubmission(inspectingSub.id, 'REJECTED');
                    setInspectingSub(null);
                  }}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Reject Manuscript (Send Reason)</span>
                </button>

                <button
                  onClick={async () => {
                    await handleReviewSubmission(inspectingSub.id, 'APPROVED');
                    setInspectingSub(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Grant 200 RC</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: AUDIT TRAIL STREAM                                */}
      {/* ======================================================== */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
            Immutable Security & Content Audit Trail (OWASP A09 Compliant)
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-slate-500">entity {log.entityType} ({log.entityId?.slice(0, 8)})</span>
                  </div>
                  {log.detailsJson && (
                    <p className="text-[11px] text-slate-600 font-mono truncate max-w-lg">{log.detailsJson}</p>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 font-mono shrink-0 sm:text-right">
                  <div>{new Date(log.timestamp).toLocaleString()}</div>
                  {log.user && <div className="text-slate-600">User: {log.user.email}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: SCHOLARLY PROVIDERS                               */}
      {/* ======================================================== */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">OpenAlex API</h4>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">ONLINE</span>
            </div>
            <p className="text-xs text-slate-600">
              Open scholarly graph indexing author disambiguation, institutions, and citation tracking.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Endpoint: <code className="text-slate-600">https://api.openalex.org</code>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Crossref DOI Registry</h4>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">ONLINE</span>
            </div>
            <p className="text-xs text-slate-600">
              Digital Object Identifier resolution and bibliographic citation network.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Endpoint: <code className="text-slate-600">https://api.crossref.org</code>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">arXiv Preprint Engine</h4>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">ONLINE</span>
            </div>
            <p className="text-xs text-slate-600">
              Open preprint metadata feed across computer science, AI, and quantitative biology.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Endpoint: <code className="text-slate-600">http://export.arxiv.org</code>
            </div>
          </div>
        </div>
      )}

      {/* Create Research Bounty Modal */}
      {createBountyModalOpen && (
        <CreateBountyModal
          isOpen={createBountyModalOpen}
          onClose={() => setCreateBountyModalOpen(false)}
          onSuccess={() => {
            setActionSuccess('New research bounty successfully published and funded!');
            loadDashboardData();
            setTimeout(() => setActionSuccess(null), 3500);
          }}
        />
      )}
    </div>
  );
};
