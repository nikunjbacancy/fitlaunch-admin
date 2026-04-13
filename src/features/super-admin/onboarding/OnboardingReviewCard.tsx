import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useReviewApplication } from './useOnboardingQueue'
import { ONBOARDING_COPY } from './onboarding.constants'
import type { OnboardingApplication } from './onboarding.types'

interface OnboardingReviewCardProps {
  application: OnboardingApplication
}

export function OnboardingReviewCard({ application }: OnboardingReviewCardProps) {
  const [confirmAction, setConfirmAction] = useState<'approved' | 'rejected' | null>(null)
  const { mutate: review, isPending } = useReviewApplication()

  const isPendingStatus = application.status === 'pending'
  const isRejected = application.status === 'rejected'
  const isApproved = application.status === 'approved'

  const initials = application.tenantName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const submittedDate = new Date(application.submittedAt)
  const formattedDate = submittedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const formattedTime = submittedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const isHighPriority = (application.memberCount ?? 0) > 50

  const handleReview = () => {
    if (!confirmAction) return
    review(
      { id: application.id, payload: { status: confirmAction } },
      {
        onSuccess: () => {
          setConfirmAction(null)
        },
      }
    )
  }

  return (
    <>
      <div
        className={`relative flex items-center gap-6 px-8 py-6 transition-colors hover:bg-kmvmt-bg/30 ${
          isRejected ? 'border-l-[3px] border-kmvmt-red-dark' : 'border-l-[3px] border-transparent'
        }`}
      >
        {/* Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-kmvmt-navy text-sm font-bold text-white">
          {initials}
        </div>

        {/* Company + date + badge */}
        <div className="w-44 shrink-0">
          <p className="text-sm font-bold tracking-tight text-kmvmt-navy">
            {application.tenantName}
          </p>
          <p className="mt-0.5 text-[11px] text-kmvmt-navy/50">
            Submitted: {formattedDate}, {formattedTime}
          </p>
          <div className="mt-2">
            {isRejected ? (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-kmvmt-red-dark">
                <AlertCircle className="h-3 w-3" />
                {ONBOARDING_COPY.BADGE_ACTION_REQUIRED}
              </span>
            ) : isApproved ? (
              <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                {ONBOARDING_COPY.BADGE_APPROVED}
              </span>
            ) : isHighPriority ? (
              <span className="inline-block rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                {ONBOARDING_COPY.BADGE_HIGH_PRIORITY}
              </span>
            ) : (
              <span className="inline-block rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {ONBOARDING_COPY.BADGE_STANDARD}
              </span>
            )}
          </div>
        </div>

        {/* Plan Selection */}
        <div className="w-36 shrink-0">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-kmvmt-navy/40">
            {ONBOARDING_COPY.COL_PLAN_SELECTION}
          </p>
          <p className="text-sm font-bold capitalize text-kmvmt-navy">{application.plan}</p>
          <p className="text-[11px] capitalize text-kmvmt-navy/50">
            {application.businessType.replace(/_/g, ' ')}
          </p>
        </div>

        {/* Owner */}
        <div className="w-44 shrink-0">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-kmvmt-navy/40">
            {ONBOARDING_COPY.COL_OWNER}
          </p>
          <p className="text-sm font-bold text-kmvmt-navy">{application.ownerName}</p>
          <p className="text-[11px] text-kmvmt-navy/50">{application.ownerEmail}</p>
        </div>

        {/* Review Notes */}
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-kmvmt-navy/40">
            {ONBOARDING_COPY.COL_REVIEW_NOTES}
          </p>
          <p className="line-clamp-3 text-xs italic text-kmvmt-navy/60">
            {application.notes ?? ONBOARDING_COPY.NO_NOTES}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 items-center gap-2">
          {isPendingStatus && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="border-kmvmt-red-dark text-kmvmt-red-dark hover:bg-red-50"
                disabled={isPending}
                onClick={() => {
                  setConfirmAction('rejected')
                }}
              >
                {ONBOARDING_COPY.BTN_REJECT}
              </Button>
              <Button
                size="sm"
                className="bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80"
                disabled={isPending}
                onClick={() => {
                  setConfirmAction('approved')
                }}
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  ONBOARDING_COPY.BTN_APPROVE
                )}
              </Button>
            </>
          )}
          {isRejected && (
            <>
              <Button
                size="sm"
                className="bg-kmvmt-red-dark text-white hover:bg-kmvmt-red-light"
                disabled={isPending}
                onClick={() => {
                  setConfirmAction('rejected')
                }}
              >
                {ONBOARDING_COPY.BTN_DECLINE}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-300 text-kmvmt-navy hover:bg-kmvmt-bg"
              >
                {ONBOARDING_COPY.BTN_REQUEST_INFO}
              </Button>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null)
        }}
        title={
          confirmAction === 'approved'
            ? ONBOARDING_COPY.CONFIRM_APPROVE_TITLE
            : ONBOARDING_COPY.CONFIRM_REJECT_TITLE
        }
        description={
          confirmAction === 'approved'
            ? ONBOARDING_COPY.CONFIRM_APPROVE_DESC
            : ONBOARDING_COPY.CONFIRM_REJECT_DESC
        }
        confirmLabel={
          confirmAction === 'approved' ? ONBOARDING_COPY.BTN_APPROVE : ONBOARDING_COPY.BTN_REJECT
        }
        variant={confirmAction === 'approved' ? 'default' : 'destructive'}
        isLoading={isPending}
        onConfirm={handleReview}
      />
    </>
  )
}
