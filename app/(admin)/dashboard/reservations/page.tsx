"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type Reservation = {
  id: string;
  customer_name: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  table_number: string | null;
  status: string;
  created_at: string;
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("reservation_date", { ascending: false })
        .order("reservation_time", { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) throw error;
      
      setReservations((prev) => 
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#3B0A0A] mb-6">Table Reservations</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#E63946]" size={40} />
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500">No reservations found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Guests</th>
                  <th className="px-6 py-4">Table</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{res.customer_name}</td>
                    <td className="px-6 py-4">{res.phone}</td>
                    <td className="px-6 py-4">
                      {res.reservation_date} <br/>
                      <span className="text-xs text-gray-500">{res.reservation_time}</span>
                    </td>
                    <td className="px-6 py-4">{res.number_of_guests}</td>
                    <td className="px-6 py-4">{res.table_number || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        res.status === "confirmed" ? "bg-green-100 text-green-800" :
                        res.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {res.status === "pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateStatus(res.id, "confirmed")}
                            className="text-green-600 hover:bg-green-50 p-1.5 rounded transition"
                            title="Confirm"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => updateStatus(res.id, "cancelled")}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition"
                            title="Cancel"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
