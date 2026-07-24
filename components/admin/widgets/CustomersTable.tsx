"use client";

import { useState } from "react";
import { CustomerRow } from "@/app/actions/customers";
import { User, Mail, Calendar, Phone, Venus, CheckCircle2, XCircle } from "lucide-react";

export function CustomersTable({ initialCustomers }: { initialCustomers: CustomerRow[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.first_name && c.first_name.toLowerCase().includes(search.toLowerCase())) ||
      (c.last_name && c.last_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 py-4 border-b border-gray-100 gap-4">
          <h3 className="font-bold text-gray-900 text-sm tracking-wide">
            REGISTERED CUSTOMERS ({filteredCustomers.length})
          </h3>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64"
          />
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500">
            No customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Gender</th>
                  <th className="px-5 py-3">DOB</th>
                  <th className="px-5 py-3">Marketing</th>
                  <th className="px-5 py-3 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                          <User size={16} />
                        </div>
                        <span className="font-medium text-gray-900">
                          {customer.first_name || customer.last_name
                            ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone size={14} className="text-gray-400" />
                        {customer.phone || <span className="text-gray-400 italic">N/A</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1 capitalize">
                        <Venus size={13} className="text-gray-400" />
                        {customer.gender || <span className="text-gray-400 italic">N/A</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {customer.dob ? (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-gray-400" />
                          {customer.dob}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {customer.email_marketing ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                          <CheckCircle2 size={12} /> Subscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                          <XCircle size={12} /> Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
