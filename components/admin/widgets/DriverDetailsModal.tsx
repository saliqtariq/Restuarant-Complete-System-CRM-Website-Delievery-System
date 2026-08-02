import { Driver } from "@/app/actions/drivers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
};

export function DriverDetailsModal({ isOpen, onClose, driver }: Props) {
  if (!isOpen || !driver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Driver Details</h2>
            <p className="text-sm text-gray-500 mt-1">Information for {driver.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Status</label>
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border inline-block ${
                driver.status === "Active" 
                  ? "bg-green-50 text-green-600 border-green-200"
                  : driver.status === "On Delivery"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}>
                {driver.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Phone Number</label>
              <div className="text-sm font-medium text-gray-900">{driver.phone}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
              <div className="text-sm font-medium text-gray-900">{driver.email || "N/A"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">CNIC</label>
              <div className="text-sm font-medium text-gray-900">{driver.cnic}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Assigned Branch</label>
              <div className="text-sm font-medium text-gray-900">{driver.branch}</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Home Address</label>
            <div className="text-sm font-medium text-gray-900">{driver.home_address}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#E63946] hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors min-w-30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
