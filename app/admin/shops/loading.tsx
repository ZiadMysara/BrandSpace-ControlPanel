export default function ShopsLoading() {
  return (
    <div className="sidebar-layout">
      <div className="sidebar-content">
        <div className="falcon-main p-6">
          <div className="animate-pulse space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>

            {/* Stats Cards */}
            <div className="falcon-grid falcon-grid-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="h-10 bg-slate-200 rounded flex-1"></div>
              <div className="h-10 bg-slate-200 rounded w-48"></div>
            </div>

            {/* Table */}
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}