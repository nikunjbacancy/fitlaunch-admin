import { useState } from 'react'
import { Check, X, Globe, Users, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useReviewApplication } from './useOnboardingQueue'
import {
  ONBOARDING_STATUS_LABELS,
  ONBOARDING_STATUS_CLASSES,
  BUSINESS_TYPE_LABELS,
  ONBOARDING_COPY,
} from './onboarding.constants'
import type { OnboardingApplication } from './onboarding.types'

interface OnboardingReviewCardProps {
  application: OnboardingApplication
}

export function OnboardingReviewCard({ application }: OnboardingReviewCardProps) {
  const [notes, setNotes] = useState('')
  const [confirmAction, setConfirmAction] = useState<'approved' | 'rejected' | null>(null)
  const { mutate: review, isPending } = useReviewApplication()

  const isPending_ = application.status === 'pending'

  const handleReview = () => {
    if (!confirmAction) return
    review(
      { id: application.id, payload: { status: confirmAction, notes: notes || undefined } },
      {
        onSuccess: () => {
          setConfirmAction(null)
          setNotes('')
        },
      }
    )
  }

  return (
    <>
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">{application.tenantName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{application.ownerEmail}</p>
            </div>
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${ONBOARDING_STATUS_CLASSES[application.status]}`}
            >
              {ONBOARDING_STATUS_LABELS[application.status]}
            </Badge>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <div>
              <p className="text-muted-foreground">{ONBOARDING_COPY.CARD_BUSINESS_TYPE}</p>
              <p className="font-medium mt-0.5">{BUSINESS_TYPE_LABELS[application.businessType]}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{ONBOARDING_COPY.CARD_PLAN}</p>
              <p className="font-medium mt-0.5 capitalize">{application.plan}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{ONBOARDING_COPY.CARD_OWNER}</p>
              <p className="font-medium mt-0.5">{application.ownerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium mt-0.5">
                {new Date(application.submittedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Extra info */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {application.website && (
              <a
                href={application.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                {ONBOARDING_COPY.CARD_WEBSITE}
              </a>
            )}
            {application.memberCount !== null && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {application.memberCount} {ONBOARDING_COPY.CARD_MEMBERS}
              </span>
            )}
          </div>

          {/* Review notes (for already reviewed) */}
          {application.notes && (
            <div className="rounded-md bg-muted p-2.5 text-xs text-muted-foreground">
              <span className="font-medium">Notes: </span>
              {application.notes}
            </div>
          )}

          {/* Actions — only for pending */}
          {isPending_ && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor={`notes-${application.id}`} className="text-xs">
                  {ONBOARDING_COPY.CARD_NOTES_LABEL}
                </Label>
                <Textarea
                  id={`notes-${application.id}`}
                  placeholder={ONBOARDING_COPY.CARD_NOTES_PLACEHOLDER}
                  rows={2}
                  className="text-xs resize-none"
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setNotes(e.target.value)
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isPending}
                  onClick={() => {
                    setConfirmAction('approved')
                  }}
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      {ONBOARDING_COPY.BTN_APPROVE}
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  disabled={isPending}
                  onClick={() => {
                    setConfirmAction('rejected')
                  }}
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  {ONBOARDING_COPY.BTN_REJECT}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
