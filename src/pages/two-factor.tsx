import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/errors'
import { useAuthStore } from '@/store/auth.store'
import { useTwoFactor } from '@/features/auth/useTwoFactor'
import { authService } from '@/features/auth/authService'

const OTP_LENGTH = 6
const RESEND_COOLDOWN_SECONDS = 60

export default function TwoFactorPage(): React.ReactElement {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [digits, setDigits] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ''))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array.from({ length: OTP_LENGTH }, (): HTMLInputElement | null => null)
  )

  const { mutate: verify, isPending } = useTwoFactor()

  // Redirect if not authenticated (came here directly without logging in)
  useEffect(() => {
    if (!isAuthenticated) {
      void navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Resend countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [secondsLeft])

  const submitOtp = useCallback(
    (otp: string) => {
      verify(
        { otp },
        {
          onError: (err) => {
            toast.error(getErrorMessage(err))
            setDigits(Array.from({ length: OTP_LENGTH }, () => ''))
            setTimeout(() => {
              inputRefs.current[0]?.focus()
            }, 0)
          },
        }
      )
    },
    [verify]
  )

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const updated = [...digits]
    updated[index] = digit
    setDigits(updated)

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (digit && index === OTP_LENGTH - 1) {
      const otp = updated.join('')
      if (otp.length === OTP_LENGTH) {
        submitOtp(otp)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return

    const updated = Array.from({ length: OTP_LENGTH }, () => '')
    pasted.split('').forEach((ch, i) => {
      updated[i] = ch
    })
    setDigits(updated)

    const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1
    inputRefs.current[nextEmpty]?.focus()

    if (pasted.length === OTP_LENGTH) {
      submitOtp(pasted)
    }
  }

  const handleResend = async (): Promise<void> => {
    try {
      setIsResending(true)
      await authService.refresh()
      setSecondsLeft(RESEND_COOLDOWN_SECONDS)
      toast.success('A new code has been sent to your authenticator app')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
          <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <Input
                key={index}
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isPending}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(index, e.target.value)
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  handleKeyDown(index, e)
                }}
                className="w-12 h-12 text-center text-lg font-semibold"
                aria-label={`Digit ${String(index + 1)}`}
              />
            ))}
          </div>

          {isPending && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying…
            </div>
          )}

          <div className="text-center">
            {secondsLeft > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend code in <span className="font-medium tabular-nums">{secondsLeft}s</span>
              </p>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void handleResend()
                }}
                disabled={isResending || isPending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Resend code'
                )}
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => {
              void navigate('/login')
            }}
            disabled={isPending}
          >
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
