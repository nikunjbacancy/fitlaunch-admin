import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  BarChart3,
  Users,
  Shield,
  FlaskConical,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/errors'
import { useLogin } from '@/features/auth/useLogin'
import { loginSchema, type LoginFormValues } from '@/features/auth/auth.types'
import { useAuthStore } from '@/store/auth.store'
import { useNavigate } from 'react-router-dom'
import type { AuthUser, UserRole } from '@/types/auth.types'

const DEV_USERS: { role: UserRole; label: string; color: string; user: AuthUser }[] = [
  {
    role: 'super_admin',
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    user: {
      id: 'dev-sa-001',
      email: 'superadmin@fitlaunch.com',
      fullName: 'Dev Super Admin',
      role: 'super_admin',
      tenantId: null,
      tenantType: null,
      isTwoFactorVerified: true,
    },
  },
  {
    role: 'property_manager',
    label: 'Property Manager',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    user: {
      id: 'dev-pm-001',
      email: 'pm@fitlaunch.com',
      fullName: 'Dev Property Manager',
      role: 'property_manager',
      tenantId: 'tenant-apt-001',
      tenantType: 'apartment',
      isTwoFactorVerified: true,
    },
  },
  {
    role: 'trainer',
    label: 'Trainer',
    color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    user: {
      id: 'dev-tr-001',
      email: 'trainer@fitlaunch.com',
      fullName: 'Dev Trainer',
      role: 'trainer',
      tenantId: 'tenant-tr-001',
      tenantType: 'trainer',
      isTwoFactorVerified: true,
    },
  },
]

const ROLE_REDIRECT: Record<UserRole, string> = {
  super_admin: '/super-admin',
  property_manager: '/dashboard',
  trainer: '/trainer',
}

const FEATURE_HIGHLIGHTS = [
  {
    icon: Users,
    title: 'Multi-Tenant Management',
    description: 'Oversee gyms, trainers, and apartment communities from one place.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track MRR, member growth, and platform health at a glance.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Granular permissions for Super Admin, Property Manager, and Trainer roles.',
  },
]

export default function LoginPage(): React.ReactElement {
  const { mutate: login, isPending, isError, error } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const { setUser, setTwoFactorVerified } = useAuthStore()
  const navigate = useNavigate()

  const handleDevLogin = (devUser: (typeof DEV_USERS)[number]) => {
    setUser(devUser.user, 'dev-access-token')
    setTwoFactorVerified()
    void navigate(ROLE_REDIRECT[devUser.role])
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onError: (err) => {
        toast.error(getErrorMessage(err))
      },
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[52%] flex-col justify-between overflow-hidden bg-slate-900 px-12 py-10">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-2xl" />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white tracking-tight">FitLaunch</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
              Admin Console
            </p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Your entire fitness
            <br />
            platform,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              one console.
            </span>
          </h1>
          <p className="mt-4 text-base text-slate-400 leading-relaxed max-w-sm">
            Manage tenants, analytics, billing, and member engagement across your entire network.
          </p>

          {/* Feature list */}
          <ul className="mt-10 space-y-6">
            {FEATURE_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-slate-400">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <p className="text-xs text-slate-500">All systems operational</p>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">FitLaunch Admin</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to your admin account to continue
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <form
              onSubmit={(e) => {
                void handleSubmit(onSubmit)(e)
              }}
              noValidate
              className="space-y-5"
            >
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@fitlaunch.com"
                    disabled={isPending}
                    className="pl-10 h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    disabled={isPending}
                    className="pl-10 pr-10 h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => {
                      setShowPassword((prev) => !prev)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Inline error */}
              {isError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm shadow-blue-600/20 transition-all mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </div>

          {/* Security note */}
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Shield className="h-3.5 w-3.5" />
            Secured with 256-bit encryption and two-factor authentication
          </p>

          {/* Dev quick-access — only visible in development */}
          {import.meta.env.DEV && (
            <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
              <div className="mb-3 flex items-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5 text-amber-600" />
                <p className="text-xs font-semibold text-amber-700">Dev quick access</p>
              </div>
              <div className="flex flex-col gap-2">
                {DEV_USERS.map((devUser) => (
                  <button
                    key={devUser.role}
                    type="button"
                    onClick={() => {
                      handleDevLogin(devUser)
                    }}
                    className={`rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${devUser.color}`}
                  >
                    <span className="font-semibold">{devUser.label}</span>
                    <span className="ml-1.5 opacity-60">{devUser.user.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
