import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Coins,
  CheckCircle,
  AlertTriangle,
  Building,
  Calendar,
} from 'lucide-react';
import { api } from '../api/client';

interface CreateBountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateBountyModal: React.FC<CreateBountyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [rewardCredits, setRewardCredits] = useState<number>(30000);
  const [rewardFiat, setRewardFiat] = useState<number>(30000);
  const [currency, setCurrency] = useState('ETB');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !sponsorName.trim() || !description.trim() || !rewardCredits) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      await api.createBounty({
        title,
        sponsorName,
        rewardCredits,
        rewardFiat,
        currency,
        description,
        deadline: deadline || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create research bounty.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0B192C] text-white p-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Research Bounty & Grant Call</h2>
              <p className="text-xs text-slate-300">
                Post sponsored academic funding challenges funded by research partners
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Bounty Challenge Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fine-Tuning Open Source LLMs on Ge'ez and Classical Ethiopic Legal Corpora"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Sponsoring Academic Institution / Agency *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Ethiopian Artificial Intelligence Institute / Africa CDC"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reward in Research Credits (RC) *
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min={1000}
                  step={500}
                  value={rewardCredits}
                  onChange={(e) => {
                    const rc = parseInt(e.target.value, 10) || 0;
                    setRewardCredits(rc);
                    setRewardFiat(rc);
                  }}
                  className="w-full text-xs border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 font-mono font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cash Equivalent *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min={100}
                  value={rewardFiat}
                  onChange={(e) => setRewardFiat(parseFloat(e.target.value) || 0)}
                  className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2.5 font-mono font-bold"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-20 text-xs border border-slate-300 rounded-xl px-2 py-2.5 bg-white font-bold"
                >
                  <option value="ETB">ETB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Submission Deadline (Optional)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl pl-9 pr-3 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Challenge Scope & Evidence Deliverables *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the expected scientific evidence, benchmark models, or dataset requirements needed to claim this grant..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Publish Research Bounty</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
