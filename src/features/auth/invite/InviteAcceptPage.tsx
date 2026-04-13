import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import {
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Lock,
  AlertCircle,
  Building2,
  Clock,
  Shield,
  Users,
  BarChart3,
} from 'lucide-react'
import kmvmtLogo from '@/assets/logo_bg_white.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
// import { useAuthStore } from '@/store/auth.store' // see note below — wizard redirect disabled
import { useValidateInviteToken, useAcceptInvite } from './useInvite'
import { acceptInviteSchema } from './invite.types'
import {
  // INVITE_ONBOARDING_REDIRECT, // disabled: branding/units wizard removed from invite flow
  // INVITE_REDIRECT_FALLBACK,   // disabled: branding/units wizard removed from invite flow
  INVITE_REDIRECT_LOGIN,
  INVITE_COPY,
} from './invite.constants'
import { getErrorMessage, getErrorCode } from '@/lib/errors'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { z } from 'zod'

type FormValues = z.infer<typeof acceptInviteSchema>

const LEFT_FEATURES = [
  {
    icon: Shield,
    title: INVITE_COPY.LEFT_FEATURE_1_TITLE,
    description: INVITE_COPY.LEFT_FEATURE_1_DESC,
  },
  {
    icon: Users,
    title: INVITE_COPY.LEFT_FEATURE_2_TITLE,
    description: INVITE_COPY.LEFT_FEATURE_2_DESC,
  },
  {
    icon: BarChart3,
    title: INVITE_COPY.LEFT_FEATURE_3_TITLE,
    description: INVITE_COPY.LEFT_FEATURE_3_DESC,
  },
] as const

export function InviteAcceptPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  // NOTE: tenantOnboardingStep previously drove the multi-step wizard redirect.
  // Kept commented so we can restore the wizard flow if product direction changes.
  // const tenantOnboardingStep = useAuthStore((s) => s.tenantOnboardingStep)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: invite, isLoading, isError, error } = useValidateInviteToken(token)
  const acceptInvite = useAcceptInvite()

  const form = useForm<FormValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const password = form.watch('password')
  const requirements = [
    { label: INVITE_COPY.REQ_LENGTH, met: password.length >= 8 },
    { label: INVITE_COPY.REQ_UPPER, met: /[A-Z]/.test(password) },
    { label: INVITE_COPY.REQ_NUMBER, met: /[0-9]/.test(password) },
    { label: INVITE_COPY.REQ_SPECIAL, met: /[^A-Za-z0-9]/.test(password) },
  ]
  const metCount = requirements.filter((r) => r.met).length

  const handleSubmit = (values: FormValues) => {
    if (!token) return
    setSubmitError(null)
    acceptInvite.mutate(
      { token, password: values.password },
      {
        onSuccess: () => {
          // All roles now redirect to login after setting their password.
          // Branding and unit directory setup moved post-login (handled via nav + in-app pages).
          //
          // Previous behavior (kept for reference — restore if wizard returns):
          //   - property_owner → /login
          //   - owner-managed PM → /login
          //   - standalone PM → /pm/setup wizard based on tenantOnboardingStep
          void navigate(INVITE_REDIRECT_LOGIN, { replace: true })
        },
        onError: (err) => {
          setSubmitError(getErrorMessage(err))
        },
      }
    )
  }

  // ── Split-screen shell ──────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative hidden lg:flex lg:w-[52%] flex-col justify-between overflow-hidden bg-kmvmt-navy px-12 py-10">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-kmvmt-blue-light/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-kmvmt-blue-light/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-kmvmt-blue-light/10 blur-2xl" />
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
          <img src={kmvmtLogo} alt="KMVMT" className="h-14 w-14 rounded-2xl object-contain" />
          <div>
            <p className="text-base font-bold tracking-tight text-white">KMVMT</p>
            <p className="text-[11px] font-medium uppercase tracking-widest text-kmvmt-blue-light/60">
              Admin Console
            </p>
          </div>
        </div>

        {/* Middle: invite context card + features */}
        <div className="relative space-y-8">
          {/* Invite card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Building2 className="h-5 w-5 text-kmvmt-blue-light" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50">
                  {INVITE_COPY.LEFT_INVITED_TO}
                </p>
                {isLoading ? (
                  <Skeleton className="mt-1 h-4 w-32 bg-white/10" />
                ) : (
                  <p className="text-base font-bold text-white">
                    {invite?.complex_name ?? '\u2014'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Clock className="h-3.5 w-3.5" />
              <span>{INVITE_COPY.LEFT_EXPIRY}</span>
            </div>
          </div>

          {/* Feature bullets */}
          <ul className="space-y-6">
            {LEFT_FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon className="h-4 w-4 text-kmvmt-blue-light" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-kmvmt-blue-light/70">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <p className="text-xs text-kmvmt-blue-light/50">All systems operational</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-kmvmt-bg px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <img src={kmvmtLogo} alt="KMVMT" className="h-12 w-12 rounded-xl object-contain" />
          <span className="text-lg font-bold text-kmvmt-navy">KMVMT Admin</span>
        </div>

        <div className="w-full max-w-sm">
          <RightPanelContent
            isLoading={isLoading}
            isError={isError}
            error={error}
            invite={invite}
            form={form}
            showPassword={showPassword}
            showConfirm={showConfirm}
            setShowPassword={setShowPassword}
            setShowConfirm={setShowConfirm}
            requirements={requirements}
            metCount={metCount}
            acceptInvite={acceptInvite}
            submitError={submitError}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

// ── Right panel content — extracted to keep InviteAcceptPage under 200 lines ──

interface RightPanelContentProps {
  isLoading: boolean
  isError: boolean
  error: unknown
  invite: { full_name: string; complex_name: string | null } | undefined
  form: ReturnType<typeof useForm<FormValues>>
  showPassword: boolean
  showConfirm: boolean
  setShowPassword: (fn: (p: boolean) => boolean) => void
  setShowConfirm: (fn: (p: boolean) => boolean) => void
  requirements: { label: string; met: boolean }[]
  metCount: number
  acceptInvite: { isPending: boolean }
  submitError: string | null
  handleSubmit: (values: FormValues) => void
}

function RightPanelContent({
  isLoading,
  isError,
  error,
  invite,
  form,
  showPassword,
  showConfirm,
  setShowPassword,
  setShowConfirm,
  requirements,
  metCount,
  acceptInvite,
  submitError,
  handleSubmit,
}: RightPanelContentProps) {
  const navigate = useNavigate()
  if (isLoading) {
    return (
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-kmvmt-white p-8 shadow-sm">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <p className="text-center text-sm text-zinc-500">{INVITE_COPY.VALIDATING}</p>
      </div>
    )
  }

  if (isError || !invite) {
    const errorCode = getErrorCode(error)
    const msg = getErrorMessage(error)
    const isAlreadyUsed = errorCode === 'token_already_used'
    const isExpired = !isAlreadyUsed && msg.toLowerCase().includes('expir')

    return (
      <div className="rounded-2xl border border-zinc-200 bg-kmvmt-white p-8 shadow-sm text-center">
        {isAlreadyUsed ? (
          <>
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-kmvmt-navy/[0.08]">
              <CheckCircle2 className="h-6 w-6 text-kmvmt-navy" />
            </div>
            <h2 className="text-lg font-bold text-kmvmt-navy">{INVITE_COPY.ALREADY_USED_TITLE}</h2>
            <p className="mt-2 text-sm text-zinc-500">{INVITE_COPY.ALREADY_USED_MSG}</p>
            <Button
              className="mt-6 h-11 w-full bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80 font-semibold"
              onClick={() => {
                void navigate('/login')
              }}
            >
              {INVITE_COPY.ALREADY_USED_CTA}
            </Button>
          </>
        ) : (
          <>
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-kmvmt-red-dark/10">
              <AlertCircle className="h-6 w-6 text-kmvmt-red-dark" />
            </div>
            <h2 className="text-lg font-bold text-kmvmt-navy">{INVITE_COPY.INVALID_TITLE}</h2>
            <p className="mt-2 text-sm text-zinc-500">
              {isExpired ? INVITE_COPY.EXPIRED_MSG : INVITE_COPY.INVALID_MSG}
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-kmvmt-navy">{INVITE_COPY.RIGHT_HEADING}</h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          {INVITE_COPY.RIGHT_SUBTITLE_PREFIX}
          <span className="font-medium text-kmvmt-navy">{invite.full_name}</span>
          {INVITE_COPY.RIGHT_SUBTITLE_SUFFIX}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(handleSubmit)(e)
          }}
          noValidate
          className="space-y-5"
        >
          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel htmlFor="password" className="text-xs font-medium text-zinc-700">
                  {INVITE_COPY.PASSWORD_LABEL}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kmvmt-navy/40" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      disabled={acceptInvite.isPending}
                      className="h-11 border-zinc-200 bg-kmvmt-white pl-10 pr-10 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                      {...field}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => {
                        setShowPassword((p) => !p)
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password strength bar + requirement pills */}
          <PasswordStrength requirements={requirements} metCount={metCount} />

          {/* Confirm password field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel htmlFor="confirmPassword" className="text-xs font-medium text-zinc-700">
                  {INVITE_COPY.CONFIRM_LABEL}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kmvmt-navy/40" />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      disabled={acceptInvite.isPending}
                      className="h-11 border-zinc-200 bg-kmvmt-white pl-10 pr-10 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                      {...field}
                    />
                    <button
                      type="button"
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      onClick={() => {
                        setShowConfirm((p) => !p)
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error banner */}
          {submitError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="mt-2 h-11 w-full bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80 font-semibold"
            disabled={acceptInvite.isPending}
          >
            {acceptInvite.isPending ? INVITE_COPY.SUBMITTING : INVITE_COPY.SUBMIT}
          </Button>
        </form>
      </Form>
    </>
  )
}

// ── Password strength sub-component ────────────────────────────────────────

interface PasswordStrengthProps {
  requirements: { label: string; met: boolean }[]
  metCount: number
}

function PasswordStrength({ requirements, metCount }: PasswordStrengthProps) {
  const barColor =
    metCount === 0
      ? 'bg-zinc-200'
      : metCount === 1
        ? 'bg-red-400'
        : metCount <= 3
          ? 'bg-amber-400'
          : 'bg-emerald-500'

  return (
    <div className="space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              i < metCount ? barColor : 'bg-zinc-200'
            )}
          />
        ))}
      </div>
      {/* Requirement pills */}
      <div className="flex flex-wrap gap-1.5">
        {requirements.map((req) => (
          <span
            key={req.label}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-all',
              req.met
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-zinc-200 bg-zinc-100 text-zinc-400'
            )}
          >
            {req.met ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
            {req.label}
          </span>
        ))}
      </div>
    </div>
  )
}
