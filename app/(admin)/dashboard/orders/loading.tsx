export default function Loading() {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-7 w-36 bg-gray-200 rounded-lg" />
          <div className="h-4 w-56 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-9 w-32 bg-gray-200 rounded-lg" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="divide-y divide-gray-50">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 flex-1 bg-gray-100 rounded" />
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-6 w-20 bg-gray-100 rounded-full" />
              <div className="h-4 w-14 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
