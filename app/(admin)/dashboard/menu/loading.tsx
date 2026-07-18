export default function Loading() {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-pulse">
      <div className="h-7 w-44 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="h-8 flex-1 bg-gray-100 rounded-lg" />
              <div className="h-8 w-16 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
        {/* Items panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
              <div className="h-4 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
