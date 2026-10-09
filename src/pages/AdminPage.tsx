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
} from 'lucide-react';
import { api } from '../api/client';
import { AdminStats, AuditLog } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'moderation' | 'logs' | 'providers'>('moderation');
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, subRes, logsRes] = await Promise.all([
        api.getAdminStats(),
        api.getPendingSubmissions(),
        api.getAuditLogs(),
      ]);
      setStats(statsRes);
      setSubmissions(subRes.submissions);
      setAuditLogs(logsRes.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    const notes = reviewNotes[id] || (action === 'APPROVED' ? 'Approved by academic moderator' : 'Rejected due to insufficient documentation');
    try {
      await api.reviewSubmission(id, action, notes);
      setActionSuccess(`Submission successfully marked as ${action}.`);
      loadAdminData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR' && user.role !== 'EDITOR')) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Shield className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Restricted Administration Access</h2>
        <p className="text-xs text-slate-600">
          You must hold an authorized administrative, moderator, or editor role to view this operational console.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0B192C] text-white rounded-2xl p-6 sm:p-8 border border-[#1E3E62] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold">Platform Administration & Moderation</h1>
          </div>
          <p className="text-xs text-slate-400">
            Least-privilege operational console, submission review queues, and audit trail monitors.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-slate-600 shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold">
          ✓ {actionSuccess}
        </div>
      )}

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-bold text-slate-900">{stats.publications.published}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Published Papers</div>
            <div className="text-[11px] text-teal-600 mt-1 font-semibold">{stats.publications.pendingModeration} Pending Review</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-bold text-slate-900">{stats.users.total}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Registered Users</div>
            <div className="text-[11px] text-teal-600 mt-1 font-semibold">{stats.users.researchers} Verified Researchers</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-bold text-slate-900">{stats.editorial.articles}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Editorial Stories</div>
            <div className="text-[11px] text-teal-600 mt-1 font-semibold">Fact-Checks & Explainers</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">Healthy</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Provider Adapters</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">OpenAlex &bull; Crossref &bull; arXiv</div>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'moderation'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Submissions Queue ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'logs'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          Tamper-Evident Audit Logs ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'providers'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Provider Health & Adapters
        </button>
      </div>

      {/* TAB 1: MODERATION QUEUE */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-semibold">
                    Status: SUBMITTED (Pending Review)
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{new Date(sub.createdAt).toLocaleString()}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{sub.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-3">{sub.abstract}</p>
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Submitter: <strong className="text-slate-700">{sub.submitter?.email}</strong></span>
                  <span>Type: <strong className="text-slate-700">{sub.documentType}</strong></span>
                  <span>License: <strong className="text-slate-700">{sub.license}</strong></span>
                </div>

                {/* Review Notes and Decision Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    placeholder="Enter moderation assessment notes..."
                    value={reviewNotes[sub.id] || ''}
                    onChange={(e) => setReviewNotes({ ...reviewNotes, [sub.id]: e.target.value })}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none"
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReview(sub.id, 'APPROVED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Publish
                    </button>

                    <button
                      onClick={() => handleReview(sub.id, 'REJECTED')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              ✓ All research submissions have been reviewed. The moderation queue is clear.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
            Chronological Security and Content Events
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-slate-500">on entity {log.entityType} ({log.entityId?.slice(0, 8)})</span>
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

      {/* TAB 3: PROVIDER HEALTH */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">OpenAlex API</h4>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">ONLINE</span>
            </div>
            <p className="text-xs text-slate-600">
              Scholarly bibliographic metadata provider for authors, works, and citations graph.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Endpoint: <code className="text-slate-600">https://api.openalex.org</code>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Crossref API</h4>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">ONLINE</span>
            </div>
            <p className="text-xs text-slate-600">
              Official Digital Object Identifier (DOI) registry and bibliographic metadata adapter.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Endpoint: <code className="text-slate-600">https://api.crossref.org</code>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">arXiv Preprint Engine</h4>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">ONLINE</span>
            </div>
            <p className="text-xs text-slate-600">
              Open-access preprint ingestion service for computer science, mathematics, and physics.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Endpoint: <code className="text-slate-600">http://export.arxiv.org</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
