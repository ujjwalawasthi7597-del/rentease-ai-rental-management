import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Building,
  User,
  ExternalLink,
  ChevronRight,
  Send,
} from 'lucide-react';
import { api } from '../services/api.js';
import { IMaintenanceRequest } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { Modal } from '../components/Modal.js';

export const MaintenancePage: React.FC = () => {
  const [requests, setRequests] = useState<IMaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Response / Status Modal
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<IMaintenanceRequest | null>(null);
  const [statusInput, setStatusInput] = useState<'Submitted' | 'In Progress' | 'Resolved'>('In Progress');
  const [responseInput, setResponseInput] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (categoryFilter !== 'all') queryParams.append('category', categoryFilter);

      const res = await api.get<{ success: boolean; data: IMaintenanceRequest[] }>(
        `/maintenance?${queryParams.toString()}`
      );
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
  }, [statusFilter, categoryFilter]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleOpenUpdate = (req: IMaintenanceRequest) => {
    setSelectedRequest(req);
    setStatusInput(req.status);
    setResponseInput(req.landlordResponse || '');
    setIsUpdateOpen(true);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      await api.put(`/maintenance/${selectedRequest._id}`, {
        status: statusInput,
        landlordResponse: responseInput,
      });
      setIsUpdateOpen(false);
      showNotification('Maintenance ticket updated and response posted to tenant!');
      loadRequests();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update ticket', 'error');
    }
  };

  const filtered = requests.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term) ||
      (r.propertyName || '').toLowerCase().includes(term) ||
      (r.tenantName || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Maintenance Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review resident service tickets, update progress, and coordinate contractor dispatch.
          </p>
        </div>
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issue title, description, property, or resident..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:w-44 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Ticket Statuses</option>
            <option value="Submitted">Submitted (New)</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 md:w-40 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Appliance">Appliance</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Furniture">Furniture</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading maintenance board...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No maintenance tickets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            All properties are operational with zero active maintenance issues reported in this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                      {ticket.category}
                    </span>
                    <StatusBadge status={ticket.priority} type="priority" />
                  </div>
                  <StatusBadge status={ticket.status} type="maintenance" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{ticket.title}</h3>

                <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    {ticket.propertyName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {ticket.tenantName}
                  </span>
                </p>

                <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {ticket.description}
                </p>

                {ticket.image && (
                  <div className="mt-3">
                    <img
                      src={ticket.image}
                      alt="Issue inspection attachment"
                      className="h-32 w-full object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                )}

                {/* Landlord Reply Thread */}
                {ticket.landlordResponse ? (
                  <div className="mt-3.5 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      Landlord Response / Contractor Dispatch:
                    </div>
                    <p className="text-slate-700">{ticket.landlordResponse}</p>
                  </div>
                ) : (
                  <div className="mt-3 text-[11px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    Awaiting landlord response or repair scheduling
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  Logged on {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleOpenUpdate(ticket)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Update Status & Respond
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Landlord Response & Status Modal */}
      {selectedRequest && (
        <Modal
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          title={`Update Ticket: ${selectedRequest.title}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveUpdate} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
              <p className="font-bold text-slate-900">{selectedRequest.propertyName} • {selectedRequest.tenantName}</p>
              <p className="mt-1">{selectedRequest.description}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Update Ticket Status *</label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
              >
                <option value="Submitted">Submitted (Under review)</option>
                <option value="In Progress">In Progress (Contractor dispatched)</option>
                <option value="Resolved">Resolved (Completed & closed)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Landlord Response / Instructions for Resident *
              </label>
              <textarea
                rows={4}
                required
                value={responseInput}
                onChange={(e) => setResponseInput(e.target.value)}
                placeholder="e.g. Plumber scheduled for Wednesday between 10am - 12pm. Please ensure someone is home or permission to enter is granted."
                className="w-full p-2.5 rounded-xl border border-slate-200 leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUpdateOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-sm"
              >
                Save & Post Response
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
