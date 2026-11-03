import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  Camera,
  Layers,
} from 'lucide-react';
import { api } from '../services/api.js';
import { IMaintenanceRequest } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { Modal } from '../components/Modal.js';

export const TenantMaintenancePage: React.FC = () => {
  const [requests, setRequests] = useState<IMaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // New Request Modal
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Plumbing' | 'Electrical' | 'Cleaning' | 'Furniture' | 'Appliance' | 'Other'>('Plumbing');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // AI Assistant in modal
  const [aiTriageLoading, setAiTriageLoading] = useState(false);
  const [aiTriageNotice, setAiTriageNotice] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: IMaintenanceRequest[] }>('/maintenance');
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching maintenance requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleAiSuggest = async () => {
    if (!description && !title) {
      alert('Please enter a brief title or description first so Gemini can analyze it.');
      return;
    }
    try {
      setAiTriageLoading(true);
      const res = await api.post<{ success: boolean; data: any; source: string }>(
        '/ai/categorize-maintenance',
        { title, description }
      );
      if (res.success && res.data) {
        if (res.data.category) setCategory(res.data.category);
        if (res.data.priority) setPriority(res.data.priority);
        setAiTriageNotice(
          `AI analyzed: Category → ${res.data.category}, Priority → ${res.data.priority}. ${res.data.suggestedAction || ''}`
        );
      }
    } catch (err: any) {
      alert(err.message || 'AI triage failed');
    } finally {
      setAiTriageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/maintenance', {
        title,
        category,
        priority,
        description,
        image,
      });
      setIsSubmitOpen(false);
      setTitle('');
      setDescription('');
      setImage('');
      setAiTriageNotice(null);
      showNotification('Maintenance request submitted to your landlord!');
      loadRequests();
    } catch (err: any) {
      showNotification(err.message || 'Failed to submit request', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Maintenance Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit repair issues to your landlord and track technician scheduling updates.
          </p>
        </div>
        <button
          onClick={() => setIsSubmitOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Submit Repair Request
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          {message.text}
        </div>
      )}

      {/* Tickets List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading maintenance tickets...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No maintenance tickets</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Need a repair or plumbing fix? Submit a request above and your landlord will be notified.
          </p>
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Submit First Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                      {ticket.category}
                    </span>
                    <StatusBadge status={ticket.priority} type="priority" />
                  </div>
                  <StatusBadge status={ticket.status} type="maintenance" />
                </div>

                <h3 className="text-sm font-bold text-slate-900">{ticket.title}</h3>
                <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {ticket.description}
                </p>

                {ticket.image && (
                  <div className="mt-3">
                    <img
                      src={ticket.image}
                      alt="Attached issue photograph"
                      className="h-28 w-full object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                )}

                {/* Landlord Response */}
                {ticket.landlordResponse ? (
                  <div className="mt-3.5 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      Landlord Update:
                    </div>
                    <p className="text-slate-700">{ticket.landlordResponse}</p>
                  </div>
                ) : (
                  <div className="mt-3 text-[11px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    Submitted to landlord. Awaiting technician dispatch schedule.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                Submitted on {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Request Modal */}
      <Modal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} title="Submit Maintenance Request" maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Issue Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dishwasher leaking from bottom seal"
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Detailed Description *</label>
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={aiTriageLoading}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-purple-600" />
                {aiTriageLoading ? 'Triaging with Gemini...' : 'AI Auto-Classify'}
              </button>
            </div>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is happening, where the issue is, and if there is active water or electrical risk..."
              className="w-full p-2.5 rounded-xl border border-slate-200 leading-relaxed"
            />
          </div>

          {aiTriageNotice && (
            <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl text-purple-900 text-xs flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>{aiTriageNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Issue Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Appliance">Appliance</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Urgency / Priority *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
              >
                <option value="Low">Low (Routine maintenance)</option>
                <option value="Medium">Medium (Standard repair)</option>
                <option value="High">High (Urgent leak / electrical / lock)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Optional Image Photo URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://... (Optional photo link)"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSubmitOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-sm"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
