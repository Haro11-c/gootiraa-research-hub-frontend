import React from 'react';
import {
  Compass,
  Newspaper,
  Sparkles,
  Shield,
  User as UserIcon,
  Bookmark,
  Coins,
  ShieldCheck,
  Clock,
  Zap,
  Upload,
  Layers,
  ChevronRight,
  Building2,
  LogIn,
  PanelLeftClose,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenAuth: () => void;
  onOpenVerification: () => void;
}

const UNIVERSITIES = [
  'Addis Ababa University',
  'Jimma University',
  'Hawassa University',
  'Bahir Dar University',
  'Haramaya University',
  'University of Gondar',
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentTab,
  onNavigate,
  onOpenAuth,
  onOpenVerification,
}) => {
  const { user, isAuthenticated } = useAuth();

  const isAdminOrStaff =
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'ADMIN' ||
    user?.role === 'MODERATOR' ||
    user?.role === 'EDITOR';

  const walletBalance = user?.wallet?.balanceCredits ?? 110;
  const verifiedStatus = user?.profile?.verifiedStatus || 'UNVERIFIED';

  const handleNav = (tab: string, param?: string) => {
    onNavigate(tab, param);
    // On small screens, close sidebar upon navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (only on mobile viewports < lg) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel — ChatGPT style docked on desktop, slide drawer on mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-30 w-72 sm:w-80 lg:w-72 bg-[#0B192C] text-slate-200 border-r border-[#1E3E62] shadow-2xl lg:shadow-md flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header (ChatGPT style with Close sidebar toggle) */}
        <div className="h-14 sm:h-16 px-4 border-b border-[#1E3E62] flex items-center justify-between shrink-0 bg-[#0B192C]/95">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNav('home')}
            title="Gootiraa Research Hub — Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-900/40 group-hover:scale-105 transition-transform shrink-0">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-black tracking-tight text-white group-hover:text-teal-200 transition-colors">
                  GOOTIRAA
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                  Hub
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-sans mt-0.5">
                Scholarly Open Science
              </span>
            </div>
          </div>

          {/* ChatGPT style Close Sidebar button */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors group shrink-0"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          
          {/* Section 1: Discovery & Knowledge Hub */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Discovery & Modules
            </p>

            <button
              onClick={() => handleNav('discovery')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'discovery'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Discovery Hub</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>

            <button
              onClick={() => handleNav('editorial')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'editorial'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Newspaper className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Editorial & Science News</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>

            <button
              onClick={() => handleNav('ai')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'ai'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                <span>AI Research Assistant</span>
              </span>
              <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                GPT
              </span>
            </button>

            <button
              onClick={() => handleNav('policy')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'policy'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Integrity & Ethics</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>
          </div>

          {/* Section 2: Scholar Workspace */}
          <div className="space-y-2 pt-2 border-t border-[#1E3E62]/70">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Scholar Workspace
            </p>

            {isAuthenticated && user ? (
              <div className="space-y-1.5">
                <button
                  onClick={() => handleNav('profile', user.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'profile'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <UserIcon className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>My Scholar Profile</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal truncate max-w-[80px]">
                    {user.profile?.fullName?.split(' ')[0] || 'Me'}
                  </span>
                </button>

                <button
                  onClick={() => handleNav('library')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'library'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Saved Research Library</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>

                <button
                  onClick={() => handleNav('profile', user.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Impact Wallet</span>
                  </span>
                  <span className="font-mono text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold shrink-0">
                    {walletBalance} RC
                  </span>
                </button>

                {/* Verification Status Card */}
                <div className="pt-2 px-1">
                  {verifiedStatus === 'VERIFIED' ? (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                          Verified Scholar
                        </p>
                        <p className="text-[10px] text-emerald-400/80 truncate">
                          KYC identity approved
                        </p>
                      </div>
                    </div>
                  ) : verifiedStatus === 'PENDING' ? (
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2.5 animate-pulse">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-amber-300">
                          Verification In Review
                        </p>
                        <p className="text-[10px] text-amber-400/80">
                          Pending editorial approval
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#132A45] border border-teal-500/30 space-y-2">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-white">
                            Get Verified Scholar Badge
                          </p>
                          <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                            Submit academic credentials for reviewer privileges and grant access.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onOpenVerification();
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span>Request Scholar Verification</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#132A45]/80 border border-slate-700/80 space-y-2">
                <p className="text-xs font-bold text-white">
                  Join Gootiraa Academic Network
                </p>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Sign in to manage preprints, earn Research Credits, and request Scholar Verification.
                </p>
                <button
                  onClick={() => {
                    onOpenAuth();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Create Account</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Governance & Administration */}
          {isAdminOrStaff && (
            <div className="space-y-1.5 pt-2 border-t border-[#1E3E62]/70">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Governance Portal
              </p>
              <button
                onClick={() => handleNav('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentTab === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-amber-200/90 hover:text-white hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Administrative Console</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono uppercase shrink-0">
                  {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role}
                </span>
              </button>
            </div>
          )}

          {/* Section 4: Academic Institutions Hub */}
          <div className="space-y-2 pt-2 border-t border-[#1E3E62]/70">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-teal-400" />
              <span>Affiliated Universities</span>
            </p>
            <div className="flex flex-wrap gap-1 px-1">
              {UNIVERSITIES.map((uni) => (
                <button
                  key={uni}
                  onClick={() => handleNav('discovery', uni)}
                  className="text-[10px] bg-slate-800/80 hover:bg-teal-900/40 text-slate-300 hover:text-teal-200 border border-slate-700/60 px-2 py-1 rounded-md transition-colors"
                >
                  {uni.replace('University', 'Univ.')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button & Footer */}
        <div className="p-3.5 border-t border-[#1E3E62] bg-[#0B192C]/95 space-y-2.5 shrink-0">
          <button
            onClick={() => handleNav('upload')}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-teal-900/30 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Upload className="w-4 h-4" />
            <span>Submit Research / Preprint</span>
          </button>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1">
            <span>Ethiopian Open Science Hub</span>
            <span className="font-mono text-slate-400">v2.4 LTS</span>
          </div>
        </div>
      </aside>
    </>
  );
};
