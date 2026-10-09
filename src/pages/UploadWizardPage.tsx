import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Building,
  Check,
  Globe2,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface UploadWizardPageProps {
  onNavigate: (tab: string, param?: string) => void;
  onOpenAuth: () => void;
}

export const UploadWizardPage: React.FC<UploadWizardPageProps> = ({ onNavigate, onOpenAuth }) => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [documentType, setDocumentType] = useState('PEER_REVIEWED_ARTICLE');
  const [reviewStatus, setReviewStatus] = useState('PEER_REVIEWED');
  const [publicationYear, setPublicationYear] = useState(new Date().getFullYear());
  const [venue, setVenue] = useState('');
  const [doi, setDoi] = useState('');
  const [region, setRegion] = useState('ETHIOPIA');
  const [isOpenAccess, setIsOpenAccess] = useState(true);
  const [license, setLicense] = useState('CC-BY-4.0');
  const [keywordsStr, setKeywordsStr] = useState('');
  const [authorName, setAuthorName] = useState(user?.profile?.fullName || '');
  const [authorAffiliation, setAuthorAffiliation] = useState(user?.profile?.institution?.name || '');
  const [coAuthorsStr, setCoAuthorsStr] = useState('');
  const [declaredCopyright, setDeclaredCopyright] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedPubId, setSubmittedPubId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <Upload className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign In to Submit Research</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          To maintain academic integrity and verifiable authorship, researchers must be authenticated to upload manuscripts, preprints, or datasets.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-500 shadow-sm"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 25 * 1024 * 1024) {
        setError('File exceeds maximum size of 25MB.');
        return;
      }
      setFile(selected);
      setError(null);
      // If title is empty, prefill from filename
      if (!title) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaredCopyright) {
      setError('You must confirm that you have authorization to share this document under the selected license.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authors: { name: string; affiliation?: string }[] = [{ name: authorName || user?.profile?.fullName || 'Primary Author', affiliation: authorAffiliation }];
      if (coAuthorsStr.trim()) {
        coAuthorsStr.split(',').forEach((name) => {
          if (name.trim()) authors.push({ name: name.trim() });
        });
      }

      const keywords = keywordsStr.split(',').map((k) => k.trim()).filter(Boolean);

      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }

      const payload = {
        title,
        abstract,
        authors,
        publicationYear,
        documentType,
        reviewStatus,
        license,
        venue: venue || undefined,
        doi: doi || undefined,
        isOpenAccess,
        region,
        keywords,
      };

      formData.append('data', JSON.stringify(payload));

      const res = await api.createPublication(formData);
      setSubmittedPubId(res.id);
      setStep(5); // Completion step
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check form values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Research Submission Wizard</h1>
        <p className="text-xs text-slate-500">
          Upload and index your peer-reviewed papers, preprints, dissertations, or working manuscripts.
        </p>

        {/* Steps Tracker */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[
            { num: 1, label: 'Document File' },
            { num: 2, label: 'Metadata' },
            { num: 3, label: 'Authorship' },
            { num: 4, label: 'Ethics & License' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.num
                    ? 'bg-teal-600 text-white'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs hidden sm:inline ${step === s.num ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                {s.label}
              </span>
              {s.num < 4 && <div className="w-6 h-0.5 bg-slate-200"></div>}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: FILE UPLOAD */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-8 text-center space-y-3 cursor-pointer bg-slate-50/50">
            <Upload className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <label htmlFor="file-upload" className="text-sm font-semibold text-teal-700 hover:text-teal-800 cursor-pointer">
                Select research PDF or manuscript file
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.txt,.csv,.json"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-slate-500 mt-1">Maximum 25MB. PDF file header and signature verified.</p>
            </div>
          </div>

          {file && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between text-xs text-teal-900">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span className="font-semibold">{file.name}</span>
                <span className="text-slate-500">({Math.round(file.size / 1024)} KB)</span>
              </div>
              <span className="text-emerald-700 font-bold">Ready</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              disabled={!file}
              onClick={() => { setError(null); setStep(2); }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <span>Continue to Metadata</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: METADATA */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Publication Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Molecular Surveillance of Infectious Vectors in the Horn of Africa"
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Abstract & Summary</label>
            <textarea
              required
              rows={5}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Provide a thorough, comprehensive abstract covering background, methods, findings, and conclusion..."
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none font-serif leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none"
              >
                <option value="PEER_REVIEWED_ARTICLE">Peer-Reviewed Journal Article</option>
                <option value="PREPRINT">Preprint Manuscript</option>
                <option value="THESIS">Thesis / Dissertation</option>
                <option value="CONFERENCE_PAPER">Conference Paper</option>
                <option value="WORKING_PAPER">Working Paper</option>
                <option value="DATASET">Dataset / Supplementary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Review Status</label>
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none"
              >
                <option value="PEER_REVIEWED">Peer-Reviewed</option>
                <option value="PREPRINT">Preprint (Unreviewed)</option>
                <option value="UNKNOWN">Pending / Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Publication Year</label>
              <input
                type="number"
                value={publicationYear}
                onChange={(e) => setPublicationYear(parseInt(e.target.value, 10))}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Journal / Conference Venue (Optional)</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Ethiopian Medical Journal, ACL Africa"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">DOI (Digital Object Identifier, if pre-existing)</label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="e.g. 10.1186/s12936-024-xxxx-x"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              disabled={!title || !abstract}
              onClick={() => { setError(null); setStep(3); }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <span>Continue to Authorship</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AUTHORSHIP & CLASSIFICATION */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary Author Name</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Author Affiliation / Institution</label>
            <input
              type="text"
              value={authorAffiliation}
              onChange={(e) => setAuthorAffiliation(e.target.value)}
              placeholder="e.g. Addis Ababa University, Jimma University"
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Co-Authors (Comma-separated)</label>
            <input
              type="text"
              value={coAuthorsStr}
              onChange={(e) => setCoAuthorsStr(e.target.value)}
              placeholder="e.g. Dr. Almaz Bekele, Dr. Mengistu Haile"
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Regional Scope</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none"
              >
                <option value="ETHIOPIA">Ethiopia & Horn of Africa</option>
                <option value="PAN_AFRICA">Pan-African</option>
                <option value="GLOBAL">Global</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Keywords (Comma-separated)</label>
              <input
                type="text"
                value={keywordsStr}
                onChange={(e) => setKeywordsStr(e.target.value)}
                placeholder="e.g. Epidemiology, Teff Genomics, Borena"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => { setError(null); setStep(4); }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <span>Continue to License & Ethics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ETHICS & COPYRIGHT */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Licensing & Rights Declaration
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Open Distribution License</label>
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none"
              >
                <option value="CC-BY-4.0">Creative Commons Attribution 4.0 (CC-BY)</option>
                <option value="CC-BY-NC-4.0">Creative Commons NonCommercial (CC-BY-NC)</option>
                <option value="CC-BY-SA-4.0">Creative Commons ShareAlike (CC-BY-SA)</option>
                <option value="OPEN-ACCESS">Open Access Archive</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="copyright-check"
                  checked={declaredCopyright}
                  onChange={(e) => setDeclaredCopyright(e.target.checked)}
                  className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                />
                <label htmlFor="copyright-check" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                  <strong className="text-slate-900 block font-semibold mb-0.5">Authorship & Copyright Certification</strong>
                  I certify that I am the author or authorized representative of this work, and that publishing it on
                  Gootiraa Research Hub does not infringe upon third-party copyrights, publisher embargos, or institutional non-disclosure agreements.
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={loading || !declaredCopyright}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              {loading ? 'Submitting & Validating...' : 'Submit Research to Repository'}
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: COMPLETION */}
      {step === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">Submission Received Successfully</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your research paper has been securely ingested into the repository quarantine pipeline. It is assigned to the moderation queue for verification.
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setStep(1);
                setFile(null);
                setTitle('');
                setAbstract('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Submit Another Paper
            </button>

            {submittedPubId && (
              <button
                onClick={() => onNavigate('publication', submittedPubId)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold"
              >
                View Publication Record
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
