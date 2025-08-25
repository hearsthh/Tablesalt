export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="w-48 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Menu Overview Skeleton */}
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>

          {/* Menu Items Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-64 h-3 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
