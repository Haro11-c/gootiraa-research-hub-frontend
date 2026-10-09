import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  Scale,
  AlertCircle,
  HelpCircle,
  Globe2,
  BookOpen,
  Upload,
  UserCheck,
  Coins,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Award,
  Eye,
  Search,
  FileCheck,
  AlertTriangle,
  UserPlus,
  ArrowRight,
  Check,
  Download,
  Share2,
} from 'lucide-react';

export const PolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'manual' | 'integrity' | 'copyright' | 'privacy' | 'about'>('manual');
  const [manualTab, setManualTab] = useState<'reader' | 'author' | 'moderator' | 'admin'>('reader');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0B192C] text-white rounded-2xl p-8 sm:p-10 border border-[#1E3E62] shadow-sm space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          System User Manual, Integrity & Policies
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Comprehensive step-by-step user manual and governance standards for Gootiraa Research Hub. Learn how to search, publish, verify, moderate, tip, and follow scientific papers.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold uppercase tracking-wider overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSection('manual')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSection === 'manual'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-teal-600" />
          System User Manual
        </button>

        <button
          onClick={() => setActiveSection('integrity')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
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
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
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
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
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
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSection === 'about'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          About Gootiraa
        </button>
      </div>

      {/* CONTENT: SYSTEM USER MANUAL */}
      {activeSection === 'manual' && (
        <div className="space-y-6">
          {/* Persona Switcher Sub-nav */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200">
            <button
              onClick={() => setManualTab('reader')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                manualTab === 'reader'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>1. Reader & Scholar Guide</span>
            </button>

            <button
              onClick={() => setManualTab('author')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                manualTab === 'author'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4 text-teal-600" />
              <span>2. Author & Researcher Guide</span>
            </button>

            <button
              onClick={() => setManualTab('moderator')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                manualTab === 'moderator'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4 text-teal-600" />
              <span>3. Academic Moderator Guide</span>
            </button>

            <button
              onClick={() => setManualTab('admin')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                manualTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>4. Super Admin Governance</span>
            </button>
          </div>

          {/* TAB 1: READER MANUAL */}
          {manualTab === 'reader' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Reader & Student User Manual: How to Explore & Study Research
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Learn how to find verified papers, download PDFs, consult the AI Assistant, cite research, and follow top scholars.
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="font-bold text-slate-900 text-base">Global & Regional Research Discovery</h3>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  Use the unified search bar in the top navigation bar (<kbd className="bg-slate-100 border border-slate-300 px-1 py-0.5 rounded text-[11px] font-mono">Ctrl + K</kbd>) or navigate to <strong>Discovery</strong>. You can filter by:
                </p>
                <ul className="text-xs text-slate-600 list-disc list-inside pl-8 space-y-1">
                  <li><strong>Horn of Africa & Ethiopia</strong>: Focus exclusively on regional epidemiology, agriculture, technology, and economic papers.</li>
                  <li><strong>Access Model</strong>: Filter for 100% Open Access full-text publications.</li>
                  <li><strong>Review Status</strong>: Distinguish verified Peer-Reviewed journal articles from Preprint archives.</li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">2</span>
                  <h3 className="font-bold text-slate-900 text-base">Peer-Review Distinction & Reading Papers</h3>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  Every paper displays an unmistakable authenticity badge:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8 pt-1">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Peer-Reviewed Journal Publication
                    </span>
                    <p className="text-[11px] text-emerald-800 mt-1">
                      Formally evaluated by independent academic referees with verified publisher DOIs.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Preprint Archive (Non Peer-Reviewed)
                    </span>
                    <p className="text-[11px] text-amber-800 mt-1">
                      Rapid scientific dissemination uploaded directly by authors prior to formal journal peer review.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="font-bold text-slate-900 text-base">Authorized PDF Manuscript Download</h3>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  In the <strong>Overview & Abstract</strong> tab, click the green <strong>Download PDF</strong> button to access the authentic author manuscript stored in secure cloud repository storage under open license.
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">4</span>
                  <h3 className="font-bold text-slate-900 text-base">Interactive Scholar Mentions & Following Authors</h3>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  Authors and Co-Founders are interactive:
                </p>
                <ul className="text-xs text-slate-600 list-disc list-inside pl-8 space-y-1">
                  <li>Click on any author name chip to open the <strong>Author Inspection Modal</strong> to see their ORCID, verified citations, research bio, and global ranking.</li>
                  <li>Click <strong>+ Follow Scholar</strong> to subscribe to their research updates. You can unfollow anytime by clicking the button again.</li>
                  <li>Click <strong>Tip Author</strong> to support their research lab directly using Research Credits (RC).</li>
                </ul>
              </div>

              {/* Step 5 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">5</span>
                  <h3 className="font-bold text-slate-900 text-base">Grounded AI Research Assistant & Citation Export</h3>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  Switch to the <strong>Grounded AI Assistant</strong> tab to generate structured 3-part summaries (Objective, Methodology, Key Findings) or ask freeform questions. The AI cites grounded document passages. To cite the paper, click <strong>Cite / Export</strong> to copy BibTeX, APA, or RIS snippets with 1 click.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: AUTHOR MANUAL */}
          {manualTab === 'author' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Author & Researcher Manual: Publishing, Moderation & Earnings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  How to upload papers, manage co-authors, track approval status and rejection comments, earn citations, and cash out Research Credits.
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="font-bold text-slate-900 text-base">Submitting a Paper (Upload Wizard)</h3>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  Click <strong>Share Research</strong> in the top navigation bar to open the 4-step submission wizard:
                </p>
                <ol className="text-xs text-slate-600 list-decimal list-inside pl-8 space-y-1">
                  <li><strong>Metadata</strong>: Enter title, abstract, discipline topics, publication year, and DOI (if already published).</li>
                  <li><strong>Authors & Co-Founders</strong>: Add all co-authors, affiliations, and ORCID identifiers.</li>
                  <li><strong>Manuscript PDF</strong>: Attach your clean PDF manuscript (validated against security and corruption standards).</li>
                  <li><strong>Review Distinction</strong>: Select whether this paper is a Preprint or a Peer-Reviewed Journal publication.</li>
                </ol>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">2</span>
                  <h3 className="font-bold text-slate-900 text-base">Tracking Review Status & Rejection Reasons</h3>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  Visit your <strong>Researcher Profile</strong> to view your submitted papers:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-8 pt-1">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                    <span className="font-bold text-amber-900">⏳ Pending Approval</span>
                    <p className="text-[11px] text-amber-800 mt-1">
                      Submitted and currently undergoing academic moderator verification.
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <span className="font-bold text-emerald-900">✓ Published Live</span>
                    <p className="text-[11px] text-emerald-800 mt-1">
                      Approved! Indexed in Discovery, searchable by scholars worldwide.
                    </p>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs">
                    <span className="font-bold text-rose-900">✕ Rejected with Reason</span>
                    <p className="text-[11px] text-rose-800 mt-1">
                      Shows the exact moderator comments and feedback explaining why it was rejected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">2</span>
                  <h3 className="font-bold text-slate-900 text-base">Global Scholar Rankings</h3>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  Your researcher profile displays real-time platform rankings calculated from your genuine citations, publication counts, and total reads. Scholars can attain recognized tiers such as <em>Top 1% Distinguished Scholar</em> or <em>Top 5% Senior Researcher</em>.
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">4</span>
                  <h3 className="font-bold text-slate-900 text-base">Research Credits (RC) & Cash Withdrawals</h3>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  Readers and academic institutions can tip your work in Research Credits.
                </p>
                <ul className="text-xs text-slate-600 list-disc list-inside pl-8 space-y-1">
                  <li><strong>Exchange Rate</strong>: 1,000 RC = 1,000 ETB (Ethiopian Birr) or $20.00 USD.</li>
                  <li><strong>Minimum Threshold</strong>: Withdrawals start at 1,000 RC to safeguard anti-fraud policies.</li>
                  <li><strong>Payout Channels</strong>: Direct payout to Telebirr, Commercial Bank of Ethiopia (CBE), or PayPal / International Wire.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: MODERATOR MANUAL */}
          {manualTab === 'moderator' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Academic Moderator Manual: Editorial & Quality Gatekeeping
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  How editorial staff review submitted manuscripts, inspect scholarly veracity, and provide constructive feedback.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Mandatory Review Workflow</h3>
                <p className="text-xs text-slate-600">
                  Access the <strong>Academic Moderator Portal</strong> from your user profile dropdown menu:
                </p>
                <ol className="text-xs text-slate-600 list-decimal list-inside space-y-2 pl-4">
                  <li><strong>Inspect Manuscript Details</strong>: Click on any pending submission to view author affiliations, declared license, and read the uploaded PDF manuscript.</li>
                  <li><strong>Verify Claims</strong>: Check if the submission genuinely represents scholarly inquiry and does not violate copyright embargoes.</li>
                  <li><strong>Approve Publication</strong>: Click <em>Approve</em> to instantly release the paper to the public Discovery repository.</li>
                  <li><strong>Reject with Required Reason</strong>: If rejecting, a mandatory explanatory note must be provided (e.g. *&ldquo;Corrupted PDF file&rdquo;*, *&ldquo;Missing abstract&rdquo;*, or *&ldquo;Unsubstantiated journal peer-review claims&rdquo;*). This note is sent directly to the author&rsquo;s profile.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: SUPER ADMIN MANUAL */}
          {manualTab === 'admin' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Super Admin Governance Manual: Platform Control & Financial Anti-Fraud
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Platform governance, user verification, immutable audit logs, and fraud prevention controls.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Role-Based Access Control (RBAC)
                  </h4>
                  <p className="text-xs text-slate-600">
                    Super Admins have exclusive permission to promote users to <code>RESEARCHER</code>, <code>EDITOR</code>, <code>MODERATOR</code>, or <code>ADMIN</code>, and toggle verified blue badges for accredited faculty and universities.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    Financial Anti-Fraud & Payout Verification
                  </h4>
                  <p className="text-xs text-amber-800">
                    Before releasing cash payouts (in Birr or USD), the system evaluates:
                  </p>
                  <ul className="text-xs text-amber-800 list-disc list-inside space-y-1 pl-2">
                    <li>Minimum threshold: 1,000 RC.</li>
                    <li>Automated Fraud Risk Scoring: Flags self-tipping rings, newly created sender accounts, and rapid burst withdrawals.</li>
                    <li>Payout decisions are logged into the append-only <code>AuditLog</code> with IP address and timestamp.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
