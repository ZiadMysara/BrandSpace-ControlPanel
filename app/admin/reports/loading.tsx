export default function ReportsLoading() {
  return (
    <div className="falcon-dashboard">
      <div className="lg:pl-72 flex flex-col flex-1">
        <div className="falcon-main p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="falcon-grid falcon-grid-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
