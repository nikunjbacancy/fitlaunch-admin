import { Outlet } from 'react-router-dom'
import kmvmtLogo from '@/assets/logo_bg_white.png'

export function AuthLayout(): React.ReactElement {
  return (
    <div className="min-h-screen bg-kmvmt-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src={kmvmtLogo} alt="KMVMT" className="w-12 h-12 rounded-xl object-contain" />
          <span className="text-xl font-semibold text-kmvmt-navy">KMVMT</span>
        </div>

        {/* Card */}
        <div className="bg-kmvmt-white rounded-xl border border-zinc-200 shadow-sm p-8">
          <Outlet />
        </div>

        <p className="text-center text-xs text-kmvmt-navy/50 mt-6">
          KMVMT Admin Portal &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
