import React from 'react'
import { Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ComingSoonFeature {
  title: string
  description: string
}

interface ComingSoonPageProps {
  icon: LucideIcon
  title: string
  description: string
  features?: ComingSoonFeature[]
  badgeLabel?: string
}

export function ComingSoonPage({
  icon: Icon,
  title,
  description,
  features,
  badgeLabel = 'In development',
}: ComingSoonPageProps): React.ReactElement {
  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light text-white shadow-lg">
            <Icon className="h-6 w-6" />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-extrabold tracking-tight text-kmvmt-navy">{title}</h2>
            <p className="mt-2 text-sm text-kmvmt-navy/50">{description}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-kmvmt-navy/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy">
            <Sparkles className="h-3 w-3" />
            {badgeLabel}
          </span>
        </div>
      </div>

      {features && features.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl bg-kmvmt-white p-6 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/50">
                {feature.title}
              </p>
              <p className="mt-2 text-sm text-kmvmt-navy/60">{feature.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
