"use client";

import { useState } from "react";
import { createDriver, Driver } from "@/app/actions/drivers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const branches = ["Main Branch", "Downtown Branch", "Uptown Branch"];

export function AddDriverModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Driver, "id">>({
    name: "",
    phone: "",
    cnic: "",
    email: "",
    home_address: "",
    branch: branches[0],
    status: "Offline", // Default status
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createDriver(formData);
      if (result.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: "",
          phone: "",
          cnic: "",
          email: "",
          home_address: "",
          branch: branches[0],
          status: "Offline",
        });
      } else {
        setError(result.error || "Failed to add driver.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Driver</h2>
            <p className="text-sm text-gray-500 mt-1">Register a new rider for the delivery team.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#E63946] focus:border-[#E63946] block p-2.5 outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Phone Number *</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#E63946] focus:border-[#E63946] block p-2.5 outline-none transition-colors"
                  placeholder="0300-1234567"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">CNIC *</label>
                <input
                  required
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#E63946] focus:border-[#E63946] block p-2.5 outline-none transition-colors"
                  placeholder="12345-6789012-3"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#E63946] focus:border-[#E63946] block p-2.5 outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Home Address *</label>
              <input
                required
                type="text"
                name="home_address"
                value={formData.home_address}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#E63946] focus:border-[#E63946] block p-2.5 outline-none transition-colors"
                placeholder="123 Main St, City"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Assigned Branch *</label>
                <select
                  required
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#E63946] focus:border-[#E63946] block p-2.5 outline-none transition-colors"
                >
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Initial Status</label>
                <select
                  required
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#E63946] focus:border-[#E63946] block p-2.5 outline-none transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#E63946] hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Add Driver"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
