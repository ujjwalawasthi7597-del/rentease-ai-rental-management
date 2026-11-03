import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Bed,
  Bath,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Home,
} from 'lucide-react';
import { api } from '../services/api.js';
import { IProperty } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { Modal } from '../components/Modal.js';

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: 'Apartment' as 'Apartment' | 'House' | 'Room' | 'Commercial',
    address: '',
    city: '',
    monthlyRent: '',
    bedrooms: '1',
    bathrooms: '1',
    description: '',
    image: '',
    availabilityStatus: 'Available' as 'Available' | 'Occupied' | 'Under Maintenance',
    amenities: 'In-Unit Laundry, High-Speed WiFi, Air Conditioning',
  });

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: IProperty[] }>('/properties');
      if (res.success && res.data) {
        setProperties(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const resetForm = () => {
    setFormData({
      propertyName: '',
      propertyType: 'Apartment',
      address: '',
      city: '',
      monthlyRent: '',
      bedrooms: '1',
      bathrooms: '1',
      description: '',
      image: '',
      availabilityStatus: 'Available',
      amenities: 'In-Unit Laundry, High-Speed WiFi, Air Conditioning',
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amenitiesArr = formData.amenities.split(',').map((s) => s.trim()).filter(Boolean);
      await api.post('/properties', {
        ...formData,
        monthlyRent: Number(formData.monthlyRent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        amenities: amenitiesArr,
      });
      setIsAddOpen(false);
      resetForm();
      showNotification('Property created successfully!');
      loadProperties();
    } catch (err: any) {
      showNotification(err.message || 'Failed to create property', 'error');
    }
  };

  const handleEditClick = (prop: IProperty) => {
    setSelectedProperty(prop);
    setFormData({
      propertyName: prop.propertyName,
      propertyType: prop.propertyType,
      address: prop.address,
      city: prop.city,
      monthlyRent: String(prop.monthlyRent),
      bedrooms: String(prop.bedrooms),
      bathrooms: String(prop.bathrooms),
      description: prop.description || '',
      image: prop.image || '',
      availabilityStatus: prop.availabilityStatus,
      amenities: prop.amenities?.join(', ') || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    try {
      const amenitiesArr = formData.amenities.split(',').map((s) => s.trim()).filter(Boolean);
      await api.put(`/properties/${selectedProperty._id}`, {
        ...formData,
        monthlyRent: Number(formData.monthlyRent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        amenities: amenitiesArr,
      });
      setIsEditOpen(false);
      setSelectedProperty(null);
      resetForm();
      showNotification('Property updated successfully!');
      loadProperties();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update property', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/properties/${id}`);
      showNotification('Property removed from portfolio');
      loadProperties();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete property', 'error');
    }
  };

  // Filter properties
  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.propertyName.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.propertyType === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.availabilityStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Property Portfolio</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your rental listings, units, rates, and occupancy conditions.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Property
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

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by property name, address, or city..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 md:w-40 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Room">Room</option>
            <option value="Commercial">Commercial</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:w-44 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading properties...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No properties found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or add your first property unit to your portfolio.
          </p>
          <button
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Add Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prop) => (
            <div
              key={prop._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Photo & Status Badge */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={
                    prop.image ||
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={prop.propertyName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white">
                    {prop.propertyType}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={prop.availabilityStatus} type="property" />
                </div>
              </div>

              {/* Property Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base truncate" title={prop.propertyName}>
                      {prop.propertyName}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {prop.address}, {prop.city}
                  </p>

                  <div className="mt-3.5 flex items-center gap-4 text-xs text-slate-600 font-medium py-2 border-y border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-slate-400" />
                      <span>{prop.bedrooms} {prop.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-slate-400" />
                      <span>{prop.bathrooms} {prop.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {prop.description || 'Modern rental residence fully maintained by RentEase properties.'}
                  </p>
                </div>

                {/* Footer with rent and actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Rent</span>
                    <p className="text-base font-extrabold text-blue-600">${prop.monthlyRent.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedProperty(prop);
                        setIsDetailOpen(true);
                      }}
                      title="View Details"
                      className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditClick(prop)}
                      title="Edit Property"
                      className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prop._id, prop.propertyName)}
                      title="Delete Property"
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Property Listing" maxWidth="xl">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Property Name *</label>
              <input
                type="text"
                required
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                placeholder="e.g. Highline Heights Penthouse"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Room">Room</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 500 Market St, Apt 3A"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City, State / ZIP *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. San Francisco, CA"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Rent ($) *</label>
              <input
                type="number"
                required
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                placeholder="2500"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Photo Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/... (Leave blank for default high-res interior photo)"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Availability Status</label>
            <select
              value={formData.availabilityStatus}
              onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Amenities (comma-separated)</label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="Elevator, Gym, Central AC, In-unit Washer/Dryer"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Property Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe highlights, nearby transit, features, and policies..."
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-sm"
            >
              Save Property
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Property Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Property Details" maxWidth="xl">
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Property Name *</label>
              <input
                type="text"
                required
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Room">Room</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">City, State</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Rent ($)</label>
              <input
                type="number"
                required
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Availability Status</label>
            <select
              value={formData.availabilityStatus}
              onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
            >
              Update Property
            </button>
          </div>
        </form>
      </Modal>

      {/* Property Details View Modal */}
      {selectedProperty && (
        <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={selectedProperty.propertyName} maxWidth="xl">
          <div className="space-y-4 text-xs">
            <img
              src={selectedProperty.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'}
              alt={selectedProperty.propertyName}
              className="w-full h-56 object-cover rounded-xl"
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-medium">{selectedProperty.address}, {selectedProperty.city}</p>
                <div className="flex items-center gap-3 mt-1.5 font-semibold text-slate-700">
                  <span>{selectedProperty.bedrooms} Bedrooms</span>
                  <span>•</span>
                  <span>{selectedProperty.bathrooms} Bathrooms</span>
                  <span>•</span>
                  <span>{selectedProperty.propertyType}</span>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={selectedProperty.availabilityStatus} type="property" />
                <p className="text-lg font-extrabold text-blue-600 mt-1">${selectedProperty.monthlyRent.toLocaleString()} /mo</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 mb-1">Description</h4>
              <p className="text-slate-600 leading-relaxed">{selectedProperty.description || 'No description provided.'}</p>
            </div>

            {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Amenities & Facilities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProperty.amenities.map((a, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
