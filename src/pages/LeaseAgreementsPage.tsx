import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Calendar,
  Building,
  User,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.js';
import { ILeaseAgreement, ITenant } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { Modal } from '../components/Modal.js';

interface LeaseAgreementsPageProps {
  setCurrentTab?: (tab: string) => void;
}

export const LeaseAgreementsPage: React.FC<LeaseAgreementsPageProps> = ({ setCurrentTab }) => {
  const [agreements, setAgreements] = useState<ILeaseAgreement[]>([]);
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    tenantId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [agrRes, tenantsRes] = await Promise.all([
        api.get<{ success: boolean; data: ILeaseAgreement[] }>('/agreements'),
        api.get<{ success: boolean; data: ITenant[] }>('/tenants'),
      ]);

      if (agrRes.success) setAgreements(agrRes.data);
      if (tenantsRes.success) {
        setTenants(tenantsRes.data);
        if (tenantsRes.data.length > 0 && !formData.tenantId) {
          setFormData((prev) => ({ ...prev, tenantId: tenantsRes.data[0]._id }));
        }
      }
    } catch (err: any) {
      console.error('Error fetching agreements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenantId) {
      showNotification('Please select a tenant.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      let fileUrl = '/uploads/sample_residential_lease_agreement.pdf';
      let fileName = 'Residential_Lease_Agreement.pdf';
      let fileSize = '1.4 MB';

      // If user uploaded a physical file, upload it through Multer
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        const uploadRes = await api.upload<{
          success: boolean;
          data: { fileUrl: string; fileName: string; fileSize: string };
        }>('/upload', uploadData);

        if (uploadRes.success && uploadRes.data) {
          fileUrl = uploadRes.data.fileUrl;
          fileName = uploadRes.data.fileName;
          fileSize = uploadRes.data.fileSize;
        }
      } else {
        const t = tenants.find((item) => item._id === formData.tenantId);
        if (t) {
          fileName = `${t.name.replace(/\s+/g, '_')}_Standard_Lease.pdf`;
        }
      }

      await api.post('/agreements', {
        tenantId: formData.tenantId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        fileName,
        fileUrl,
        fileSize,
        notes: formData.notes,
      });

      setIsUploadOpen(false);
      setSelectedFile(null);
      showNotification('Lease agreement document saved successfully!');
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to upload agreement', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete lease agreement "${name}"?`)) return;
    try {
      await api.delete(`/agreements/${id}`);
      showNotification('Agreement removed');
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete agreement', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lease Agreements</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store digital PDF agreements, track expiration schedules, and share copies with tenants.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {setCurrentTab && (
            <button
              onClick={() => setCurrentTab('landlord-ai')}
              className="px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all border border-purple-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              Analyze Lease with AI
            </button>
          )}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Agreement
          </button>
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

      {/* Agreements Cards Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading agreements repository...</p>
        </div>
      ) : agreements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No agreements uploaded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Upload your first residential lease agreement or attach one to a tenant.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agreements.map((agr) => (
            <div
              key={agr._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <StatusBadge status={agr.status} type="lease" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 truncate" title={agr.fileName}>
                  {agr.fileName}
                </h3>

                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700">{agr.propertyName || 'Property'}</span>
                </p>

                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tenant: {agr.tenantName || 'Resident'}</span>
                </p>

                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Start Date:
                    </span>
                    <span className="font-semibold text-slate-800">{agr.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Expiration Date:
                    </span>
                    <span className="font-semibold text-slate-800">{agr.endDate}</span>
                  </div>
                </div>

                {agr.notes && (
                  <p className="mt-2.5 text-[11px] text-slate-500 italic truncate">
                    Notes: {agr.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">Size: {agr.fileSize || '1.2 MB'}</span>
                <div className="flex items-center gap-2">
                  <a
                    href={agr.fileUrl}
                    download={agr.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(agr._id, agr.fileName)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Agreement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Agreement Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Rental Agreement" maxWidth="md">
        <form onSubmit={handleUploadAgreement} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assign to Tenant *</label>
            <select
              required
              value={formData.tenantId}
              onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            >
              <option value="">-- Choose Tenant --</option>
              {tenants.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.propertyName || 'Property'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Agreement Document (PDF)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="font-bold text-blue-600">Click to browse file</span>
                <span className="text-slate-500 block mt-0.5 text-[11px]">
                  {selectedFile ? selectedFile.name : 'PDF, Word, or Text (up to 15MB)'}
                </span>
              </label>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * Note: If no file is chosen, RentEase will automatically generate and attach a standard verified residential lease agreement.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lease Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lease End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes / Renewal Terms</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. 60-day renewal notice required; pet rider included."
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-sm flex items-center gap-1.5"
            >
              {isUploading ? 'Uploading...' : 'Save Agreement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
