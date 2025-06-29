export default function SettingsLoading() {
  return (
    <div className="falcon-dashboard">
      <div className="lg:pl-72 flex flex-col flex-1">
        <div className="falcon-main p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-64 bg-slate-200 rounded"></div>
              <div className="h-64 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
