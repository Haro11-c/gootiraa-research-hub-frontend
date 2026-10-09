import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, Award, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'USER' | 'RESEARCHER'>('RESEARCHER');
  const [academicTitle, setAcademicTitle] = useState('');
  const [affiliationName, setAffiliationName] = useState('Addis Ababa University');
  const [orcidId, setOrcidId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          fullName,
          role,
          academicTitle: academicTitle || undefined,
          affiliationName: affiliationName || undefined,
          orcidId: orcidId || undefined,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Gootiraa2026Secure!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between">
          <h3 className="font-semibold text-base">
            {isLoginTab ? 'Sign In to Gootiraa' : 'Create Scholarly Account'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="shrink-0 flex border-b border-slate-200">
          <button
            onClick={() => { setIsLoginTab(true); setError(null); }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              isLoginTab ? 'border-teal-600 text-teal-700 bg-slate-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(null); }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              !isLoginTab ? 'border-teal-600 text-teal-700 bg-slate-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-start gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isLoginTab && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name & Honorific</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Almaz Bekele"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 pl-8 pr-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 px-2 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="RESEARCHER">Researcher / Faculty</option>
                    <option value="USER">Student / Reader</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Associate Professor"
                    value={academicTitle}
                    onChange={(e) => setAcademicTitle(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institution / Affiliation</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Addis Ababa University, Jimma University"
                    value={affiliationName}
                    onChange={(e) => setAffiliationName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 pl-8 pr-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  <Building className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ORCID iD (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0000-0002-xxxx-xxxx"
                    value={orcidId}
                    onChange={(e) => setOrcidId(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 pl-8 pr-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                  />
                  <Award className="w-4 h-4 text-green-600 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="researcher@university.edu.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 pl-8 pr-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 pl-8 pr-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : isLoginTab ? 'Sign In to Account' : 'Complete Registration'}
          </button>

          {/* Quick Demo Credentials helper */}
          {isLoginTab && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] font-medium text-slate-500 mb-2">Quick Sign-In Demo Accounts:</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('almaz.bekele@aau.edu.et')}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                >
                  Dr. Almaz (AAU)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('tadesse.worku@eaii.gov.et')}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                >
                  Dr. Tadesse (EAII)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('admin@gootiraa.org')}
                  className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-1 rounded border border-amber-200"
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
