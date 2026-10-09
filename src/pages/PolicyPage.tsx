import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  Scale,
  AlertCircle,
  HelpCircle,
  Globe2,
} from 'lucide-react';

export const PolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'integrity' | 'copyright' | 'privacy' | 'about'>('integrity');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0B192C] text-white rounded-2xl p-8 sm:p-10 border border-[#1E3E62] shadow-sm space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Research Integrity, Governance & Policies
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Gootiraa Research Hub operates under strict ethical guidelines for open access, peer-review verification,
          evidence grounding, copyright compliance, and data privacy.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveSection('integrity')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSection === 'integrity'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Research Integrity Charter
        </button>

        <button
          onClick={() => setActiveSection('copyright')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSection === 'copyright'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          Copyright & DMCA
        </button>

        <button
          onClick={() => setActiveSection('privacy')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSection === 'privacy'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          Privacy & Data Protection
        </button>

        <button
          onClick={() => setActiveSection('about')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSection === 'about'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          About Gootiraa
        </button>
      </div>

      {/* CONTENT: INTEGRITY */}
      {activeSection === 'integrity' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed font-sans">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Peer-Review Distinction Standard</h2>
            <p>
              Under no circumstances does Gootiraa Research Hub label an academic paper as &ldquo;Peer-Reviewed&rdquo; unless
              verified evidence of formal peer-review by a reputable academic journal, university press, or accredited
              proceedings publisher has been confirmed.
            </p>
            <p className="mt-2">
              Unreviewed preprints, working papers, dissertations, and conference abstracts are explicitly marked with
              clear amber badges stating <strong>&ldquo;Preprint (Unreviewed)&rdquo;</strong> to protect scholarly discernment.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Authentic Metrics Policy</h2>
            <p>
              All platform metrics (views, downloads, citation counts, and bookmark totals) reflect genuine database
              records or authentic external academic metadata from Crossref and OpenAlex. Gootiraa strictly prohibits
              fabricated statistics, automated bot-read inflation, or opaque gamified score formulas.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Evidence-Grounded AI Ethics</h2>
            <p>
              The AI Research Assistant is architected with strict prompt-injection defenses and retrieval-augmented
              anchors. Responses must cite verifiable textual passages directly extracted from the analyzed paper.
              If evidence is insufficient to address an inquiry, the system states this limitation openly rather than fabricating citations.
            </p>
          </div>
        </div>
      )}

      {/* CONTENT: COPYRIGHT */}
      {activeSection === 'copyright' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Copyright & Intellectual Property</h2>
            <p>
              Authors retain complete intellectual ownership of their submitted research papers. By sharing manuscripts,
              authors grant Gootiraa Research Hub a non-exclusive license to index, display metadata, and distribute the full text
              according to the chosen open distribution license (such as Creative Commons CC-BY-4.0 or CC-BY-NC-4.0).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">DMCA & Copyright Infringement Takedown Procedure</h2>
            <p>
              If a copyright holder identifies an uploaded manuscript that violates publisher embargoes, copyright contracts,
              or intellectual property rights, notice may be submitted immediately to <code className="text-teal-700">copyright@gootiraa.org</code>.
            </p>
            <p className="mt-2">
              Upon receiving a valid notification, platform moderators will quarantine the physical document file within
              24 hours while preserving the bibliographic metadata record with a transparent takedown notice.
            </p>
          </div>
        </div>
      )}

      {/* CONTENT: PRIVACY */}
      {activeSection === 'privacy' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Privacy & User Data Rights</h2>
            <p>
              Gootiraa Research Hub adheres to modern international privacy standards (including GDPR principles and the African Union
              Convention on Cyber Security and Personal Data Protection).
            </p>
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li>Passwords are securely salted and hashed using modern algorithms (Argon2id / Bcrypt).</li>
              <li>We never sell user research activity, reading habits, or library bookmarks to third parties.</li>
              <li>Private drafts and under-review manuscripts are stored in access-segregated storage and are never exposed publicly.</li>
              <li>Users may request complete account deletion and data export at any time.</li>
            </ul>
          </div>
        </div>
      )}

      {/* CONTENT: ABOUT */}
      {activeSection === 'about' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">The Gootiraa Story & Etymology</h2>
            <p>
              The name <strong>Gootiraa</strong> (ጎቲራ) draws from the traditional agrarian storehouse or granary—a vessel
              where the community preserves its vital sustenance through seasons of abundance and scarcity.
            </p>
            <p className="mt-2">
              In this spirit, Gootiraa Research Hub serves as a digital granary of scientific knowledge, safeguarding
              and amplifying Ethiopian and African scholarship alongside global scientific breakthroughs for current and future generations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
