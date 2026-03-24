import { Outlet } from 'react-router-dom'

export function AuthLayout(): React.ReactElement {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-semibold text-foreground">FitLaunch</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-8">
          <Outlet />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          FitLaunch Admin Portal &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
