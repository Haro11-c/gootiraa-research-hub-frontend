import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building,
  Award,
  Link,
  FileCheck2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface RequestVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const COMMON_TITLES = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer / Researcher',
  'Ph.D. Candidate',
  'Postdoctoral Researcher',
  'Research Fellow',
  'Independent Scholar',
];

const SUGGESTED_UNIVERSITIES = [
  'Addis Ababa University',
  'Jimma University',
  'Hawassa University',
  'Bahir Dar University',
  'Arba Minch University',
  'Haramaya University',
  'University of Gondar',
  'Mekelle University',
];

export const RequestVerificationModal: React.FC<RequestVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, refreshUser } = useAuth();

  const [academicTitle, setAcademicTitle] = useState(
    user?.profile?.academicTitle || 'Assistant Professor'
  );
  const [affiliationName, setAffiliationName] = useState(
    user?.profile?.institution?.name || ''
  );
  const [department, setDepartment] = useState(user?.profile?.department || '');
  const [orcidId, setOrcidId] = useState(user?.profile?.orcidId || '');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [website, setWebsite] = useState(user?.profile?.website || '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!academicTitle.trim()) {
      setError('Please provide your academic title.');
      return;
    }
    if (!affiliationName.trim()) {
      setError('Please provide your institution affiliation.');
      return;
    }
    if (!evidenceNote.trim() || evidenceNote.trim().length < 5) {
      setError(
        'Please provide verification evidence (e.g. university staff URL or official proof note).'
      );
      return;
    }

    setSubmitting(true);
    try {
      await api.requestVerification({
        academicTitle: academicTitle.trim(),
        affiliationName: affiliationName.trim(),
        department: department.trim() || undefined,
        orcidId: orcidId.trim() || undefined,
        evidenceNote: evidenceNote.trim(),
        website: website.trim() || undefined,
      });

      await refreshUser();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit verification request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white p-5 sm:p-6 flex items-start justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Request Scholar Verification
              </h2>
              <p className="text-xs text-slate-300">
                Academic KYC & Verified Researcher Badge Credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-teal-50 border-b border-teal-100 p-3.5 sm:px-6 flex items-start gap-2.5 text-xs text-teal-900 shrink-0">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Verified scholars receive the <strong className="font-semibold">Verified Badge (✓)</strong>,
            are elevated to the <strong className="font-semibold">Researcher Role</strong>, gain
            moderation authority, and qualify for platform peer-review and grant honorariums.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Verification Request Submitted!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you! Your academic credentials have been sent to our editorial board and administrators.
                Your profile status is now marked as <strong>In Review</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Academic Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-teal-600" />
                  Academic Title / Position <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={COMMON_TITLES.includes(academicTitle) ? academicTitle : 'Other'}
                    onChange={(e) => {
                      if (e.target.value !== 'Other') setAcademicTitle(e.target.value);
                    }}
                    className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    {COMMON_TITLES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="Other">Custom Title...</option>
                  </select>
                  <input
                    type="text"
                    value={academicTitle}
                    onChange={(e) => setAcademicTitle(e.target.value)}
                    placeholder="e.g. Associate Professor"
                    className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    required
                  />
                </div>
              </div>

              {/* Institution Affiliation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-teal-600" />
                  Institution / University Affiliation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={affiliationName}
                  onChange={(e) => setAffiliationName(e.target.value)}
                  placeholder="e.g. Addis Ababa University"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  required
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED_UNIVERSITIES.slice(0, 4).map((uni) => (
                    <button
                      key={uni}
                      type="button"
                      onClick={() => setAffiliationName(uni)}
                      className="text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-800 px-2 py-0.5 rounded-md transition-colors"
                    >
                      + {uni}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department & ORCID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Department / College
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. College of Health Sciences"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    ORCID iD
                    <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={orcidId}
                    onChange={(e) => setOrcidId(e.target.value)}
                    placeholder="0000-0002-1825-0097"
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Evidence & Verification Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                  Institutional Proof / Evidence Link <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  placeholder="Provide your official university staff page link (e.g. https://aau.edu.et/staff/...) or institutional email address details for fast KYC approval."
                  rows={3}
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 leading-relaxed"
                  required
                />
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  Staff directory links or institutional email verification expedite 24h approval.
                </p>
              </div>

              {/* Personal / Lab Website */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-teal-600" />
                  Academic Profile / Google Scholar URL
                  <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://scholar.google.com/citations?user=..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-900/20 flex items-center gap-1.5 transition-all"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Verification Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
