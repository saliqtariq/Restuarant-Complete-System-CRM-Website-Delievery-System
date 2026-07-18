export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-pulse">
      {/* Page header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-72 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-9 w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-16 bg-gray-300 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="h-5 w-32 bg-gray-200 rounded" />
          </div>
          {/* Table rows */}
          <div className="divide-y divide-gray-50">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 flex-1 bg-gray-100 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                <div className="h-4 w-14 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar skeleton */}
        <div className="w-full lg:w-64 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="h-4 w-28 bg-gray-200 rounded mb-4" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center mb-3">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-10 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="h-3 w-28 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom analytics skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-40 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
