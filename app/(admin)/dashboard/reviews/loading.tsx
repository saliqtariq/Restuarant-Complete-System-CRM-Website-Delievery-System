export default function Loading() {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="divide-y divide-gray-50">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-8 w-8 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 w-4 bg-yellow-100 rounded" />
                ))}
              </div>
              <div className="h-6 w-20 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
