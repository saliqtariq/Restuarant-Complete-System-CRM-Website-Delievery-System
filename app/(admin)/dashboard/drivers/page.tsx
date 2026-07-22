"use client";

import { useState, useEffect } from "react";
import { Driver, getDriversByBranch } from "@/app/actions/drivers";

const branches = ["Main Branch", "Downtown Branch", "Uptown Branch"];

export default function DeliveryManagementPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>("Main Branch");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    void getDriversByBranch(selectedBranch)
      .then((data) => {
        if (!active) return;
        setDrivers(data);
      })
      .catch((err) => console.error("Error fetching drivers:", err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      setLoading(true);
    };
  }, [selectedBranch]);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
        <button className="bg-[#E63946] hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
          + Add New Driver
        </button>
      </div>

      {/* Branch Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-2 overflow-x-auto">
        {branches.map((branch) => (
          <button
            key={branch}
            onClick={() => setSelectedBranch(branch)}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              selectedBranch === branch
                ? "bg-[#5A0A0A] text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {branch}
          </button>
        ))}
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">
            Riders - {selectedBranch}
          </h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
            {loading ? "..." : drivers.length} Drivers Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-gray-400 uppercase text-[10px] font-bold bg-gray-50/70">
                <th className="px-5 py-3">Driver Info</th>
                <th className="px-5 py-3">Contact Details</th>
                <th className="px-5 py-3">CNIC</th>
                <th className="px-5 py-3">Home Address</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading drivers...</span>
                    </div>
                  </td>
                </tr>
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    No drivers found for this branch.
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-900 text-[12px]">{driver.name}</div>
                      <div className="text-gray-400 text-[10px]">{driver.id}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-900 text-[11px]">{driver.phone}</div>
                      <div className="text-gray-400 text-[10px]">{driver.email}</div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-700">
                      {driver.cnic}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 max-w-[200px] truncate" title={driver.home_address}>
                      {driver.home_address}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        driver.status === "Active" 
                          ? "bg-green-50 text-green-600 border-green-200"
                          : driver.status === "On Delivery"
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button className="text-[#E63946] hover:bg-red-50 border border-transparent hover:border-red-100 font-bold px-3 py-1.5 rounded text-[10px] transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
