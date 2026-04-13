import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react'
import kmvmtLogoWhite from '@/assets/logo_bg_white.png'
import kmvmtLogoBlue from '@/assets/logo_bg_blue.png'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/errors'
import { useLogin } from '@/features/auth/useLogin'
import { loginSchema, type LoginFormValues } from '@/features/auth/auth.types'

const LOGIN_COPY = {
  TAGLINE_L1: 'Manage,',
  TAGLINE_L2: 'Control',
  TAGLINE_L3: '& Scale Your',
  TAGLINE_L4_ACCENT: 'Fitness',
  TAGLINE_L4_REST: ' Platform.',
  BRAND_NAME: 'KMVMT',
  BRAND_SUB: 'Admin Console',
  HEADING: 'Sign in',
  SUBHEADING: 'Enter your credentials to access the admin console.',
  LABEL_EMAIL: 'Email address',
  LABEL_PASSWORD: 'Password',
  PLACEHOLDER_EMAIL: 'you@kmvmt.com',
  SHOW_PASSWORD: 'Show password',
  HIDE_PASSWORD: 'Hide password',
  SUBMIT: 'Sign in',
  SUBMITTING: 'Signing in…',
  FOOTER: '256-bit encryption · Two-factor authentication required',
  COPYRIGHT: '© 2026 KMVMT · All rights reserved',
} as const

export default function LoginPage(): React.ReactElement {
  const { mutate: login, isPending, isError, error } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

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
      {/* ── Left branding panel ────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[38%] flex-col justify-between overflow-hidden bg-gradient-to-br from-kmvmt-navy via-[#1a2f52] to-kmvmt-blue-light/80 px-10 py-10">
        {/* Red accent strip — top of left panel only */}
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-kmvmt-red-dark to-kmvmt-red-light" />

        {/* Dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-kmvmt-blue-light/25 blur-3xl" />
          <div className="absolute -bottom-16 right-0 h-56 w-56 rounded-full bg-kmvmt-blue-light/20 blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 h-40 w-40 rounded-full bg-kmvmt-red-dark/15 blur-2xl" />
        </div>

        {/* ── Brand — top ── */}
        <div className="relative flex items-center gap-4">
          <img
            src={kmvmtLogoWhite}
            alt={LOGIN_COPY.BRAND_NAME}
            className="h-14 w-14 object-contain"
          />
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-white">
              {LOGIN_COPY.BRAND_NAME}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-kmvmt-blue-light/70">
              {LOGIN_COPY.BRAND_SUB}
            </p>
          </div>
        </div>

        {/* ── Tagline — vertically centered ── */}
        <div className="relative flex flex-1 flex-col justify-center">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            <span className="text-white">{LOGIN_COPY.TAGLINE_L1}</span>
            <br />
            <span className="text-white">{LOGIN_COPY.TAGLINE_L2}</span>
            <br />
            <span className="text-kmvmt-blue-light">{LOGIN_COPY.TAGLINE_L3}</span>
            <br />
            <span className="text-kmvmt-red-light">{LOGIN_COPY.TAGLINE_L4_ACCENT}</span>
            <span className="text-white">{LOGIN_COPY.TAGLINE_L4_REST}</span>
          </h1>
          <p className="mt-6 max-w-[260px] text-sm leading-relaxed text-white/50">
            One console to manage all your tenants, analytics, billing, and members.
          </p>
        </div>

        {/* ── Bottom status ── */}
        <div className="relative flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <p className="text-xs text-white/30">All systems operational</p>
        </div>
      </div>

      {/* ── Right form panel ───────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col bg-kmvmt-white">
        {/* Vertically centered form area */}
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-kmvmt-navy">
              <img
                src={kmvmtLogoWhite}
                alt={LOGIN_COPY.BRAND_NAME}
                className="h-7 w-7 rounded-lg object-contain"
              />
            </div>
            <span className="text-base font-extrabold text-kmvmt-navy">
              {LOGIN_COPY.BRAND_NAME}
            </span>
          </div>

          <div className="w-full max-w-[360px]">
            {/* Logo mark — desktop */}
            <div className="mb-6 hidden lg:flex flex-col items-center">
              <div className="flex h-18 w-18 items-center justify-center rounded-2xl shadow-sm">
                <img
                  src={kmvmtLogoBlue}
                  alt=""
                  aria-hidden="true"
                  className="h-14 w-14 object-contain"
                />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-kmvmt-navy">
                {LOGIN_COPY.HEADING}
              </h2>
              <p className="mt-2 text-sm text-kmvmt-navy/50">{LOGIN_COPY.SUBHEADING}</p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                void handleSubmit(onSubmit)(e)
              }}
              noValidate
              className="space-y-6"
            >
              {/* Email — underline style */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-kmvmt-navy/60">
                  {LOGIN_COPY.LABEL_EMAIL}
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-kmvmt-navy/30" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={LOGIN_COPY.PLACEHOLDER_EMAIL}
                    disabled={isPending}
                    className="w-full h-10 border-0 border-b border-zinc-300 bg-transparent px-8 text-sm leading-none text-kmvmt-navy placeholder:text-kmvmt-navy/30 outline-none transition-all focus:border-b-2 focus:border-kmvmt-navy disabled:opacity-50"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-kmvmt-red-dark">{errors.email.message}</p>
                )}
              </div>

              {/* Password — underline style */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-kmvmt-navy/60">
                  {LOGIN_COPY.LABEL_PASSWORD}
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-kmvmt-navy/30" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    disabled={isPending}
                    className="w-full h-10 border-0 border-b border-zinc-300 bg-transparent px-8 text-sm leading-none text-kmvmt-navy placeholder:text-kmvmt-navy/30 outline-none transition-all focus:border-b-2 focus:border-kmvmt-navy disabled:opacity-50"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword((prev) => !prev)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-kmvmt-navy/30 hover:text-kmvmt-navy"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-kmvmt-red-dark">{errors.password.message}</p>
                )}
              </div>

              {/* API error */}
              {isError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-kmvmt-red-dark/20 bg-kmvmt-red-dark/5 px-3.5 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-kmvmt-red-dark" />
                  <p className="text-sm text-kmvmt-red-dark">{getErrorMessage(error)}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-kmvmt-navy via-[#2a4a7f] to-kmvmt-blue-light text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {LOGIN_COPY.SUBMITTING}
                  </>
                ) : (
                  LOGIN_COPY.SUBMIT
                )}
              </Button>
            </form>

            {/* Security note */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <Shield className="h-3.5 w-3.5 text-kmvmt-navy/25" />
              <p className="text-xs text-kmvmt-navy/30">{LOGIN_COPY.FOOTER}</p>
            </div>
          </div>
        </div>

        {/* Copyright — pinned to bottom */}
        <div className="pb-6 text-center">
          <p className="text-xs text-kmvmt-navy/20">{LOGIN_COPY.COPYRIGHT}</p>
        </div>
      </div>
    </div>
  )
}
