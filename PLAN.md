# FitLaunch Admin Portal — Execution Plan

> **How to use this file:**
>
> - Check this file at the start of every session to see what's done and what's next.
> - Mark a day `[x]` only when ALL items in that day are fully complete (no stubs, no TODOs).
> - The "Current Day" section at the top always tells you exactly where to start.

---

## Current Status

**Current Day: Day 6**
**Total Progress: 5 / 20 days complete**

---

## What's Already Built (Infrastructure — Do Not Rebuild)

- [x] `src/lib/axios.ts` — JWT interceptor, 401 refresh, queue logic
- [x] `src/lib/permissions.ts` — ROLE_PERMISSIONS map + hasPermission()
- [x] `src/lib/logger.ts` — dev/prod aware logger
- [x] `src/lib/errors.ts` — getErrorMessage(), isUnauthorizedError()
- [x] `src/lib/query-client.ts` — React Query client, staleTime + retry
- [x] `src/lib/utils.ts` — cn() Tailwind utility
- [x] `src/store/auth.store.ts` — Zustand auth store, memory-only JWT, 2FA flag
- [x] `src/hooks/use-permissions.ts` — can(action) hook
- [x] `src/types/auth.types.ts` — UserRole, TenantType, AuthUser, LoginResponse
- [x] `src/types/api.types.ts` — ApiResponse<T>, PaginatedResponse<T>, ApiError
- [x] `src/types/tenant.types.ts` — TenantStatus, SubscriptionPlan, Tenant
- [x] `src/routes/index.tsx` — role-based lazy routes, 2FA guard
- [x] `src/routes/protected-route.tsx` — auth + 2FA + role checks
- [x] `src/layouts/AdminLayout.tsx` — responsive sidebar layout
- [x] `src/layouts/AuthLayout.tsx` — centered auth card
- [x] `src/layouts/Sidebar.tsx` — collapsible, role-aware nav
- [x] `src/layouts/Topbar.tsx` — breadcrumb, role badge
- [x] `src/layouts/Breadcrumb.tsx` — auto-generated from URL
- [x] `src/layouts/nav-config.ts` — centralized nav for all 3 roles
- [x] `src/App.tsx` + `src/main.tsx` — app entry, QueryProvider, Toaster
- [x] `src/pages/root-redirect.tsx` — role-based redirect

---

## Execution Plan

---

### Phase 1 — Foundation

---

#### Day 1 — shadcn/ui + Shared Component Layer

**Status: [x] Complete**
**Modules: All**

shadcn/ui components to install:

- [x] `src/components/ui/button.tsx`
- [x] `src/components/ui/input.tsx`
- [x] `src/components/ui/label.tsx`
- [x] `src/components/ui/card.tsx`
- [x] `src/components/ui/badge.tsx`
- [x] `src/components/ui/dialog.tsx`
- [x] `src/components/ui/alert-dialog.tsx`
- [x] `src/components/ui/table.tsx`
- [x] `src/components/ui/skeleton.tsx`
- [x] `src/components/ui/select.tsx`
- [x] `src/components/ui/textarea.tsx`
- [x] `src/components/ui/switch.tsx`
- [x] `src/components/ui/tabs.tsx`
- [x] `src/components/ui/separator.tsx`
- [x] `src/components/ui/dropdown-menu.tsx`
- [x] `src/components/ui/avatar.tsx`
- [x] `src/components/ui/tooltip.tsx`
- [x] `src/components/ui/form.tsx`
- [x] `src/components/ui/popover.tsx`
- [x] `src/components/ui/command.tsx`

Shared composite components to build:

- [x] `src/components/shared/PageHeader.tsx`
- [x] `src/components/shared/EmptyState.tsx`
- [x] `src/components/shared/ErrorState.tsx`
- [x] `src/components/shared/ConfirmDialog.tsx` ← wraps AlertDialog; used by EVERY destructive action
- [x] `src/components/shared/DataTableSkeleton.tsx` ← skeleton rows for all tables/lists
- [x] `src/components/shared/StatCard.tsx` ← metric card used on all dashboards
- [x] `src/components/shared/StatusBadge.tsx` ← status chip with color variants
- [x] `src/components/shared/ExportCsvButton.tsx` ← reused by residents + clients pages

**Done when:** All 28 files exist, TypeScript compiles clean.

---

#### Day 2 — Auth: Login + Two-Factor Pages

**Status: [x] Complete**
**Modules: M6**

- [x] `src/features/auth/authService.ts` — login(), logout(), refresh(), verifyTwoFactor()
- [x] `src/features/auth/useLogin.ts` — useMutation → setUser()
- [x] `src/features/auth/useTwoFactor.ts` — useMutation → setTwoFactorVerified()
- [x] `src/features/auth/auth.types.ts` — LoginFormValues, TwoFactorFormValues
- [x] `src/pages/login.tsx` — React Hook Form + Zod, email/password
- [x] `src/pages/two-factor.tsx` — 6-digit OTP, 60s resend timer, paste support
- [x] `src/pages/unauthorized.tsx` — messaging + back link
- [x] `src/pages/not-found.tsx` — messaging + home link

**Done when:** Full login → OTP → role dashboard redirect works end-to-end.

---

### Phase 2 — Super Admin Console

---

#### Day 3 — SA: Tenant List

**Status: [x] Complete**
**Modules: M6**

- [x] `src/features/super-admin/tenants/tenant.types.ts`
- [x] `src/features/super-admin/tenants/tenantService.ts`
- [x] `src/features/super-admin/tenants/useTenants.ts`
- [x] `src/features/super-admin/tenants/TenantList.tsx`
- [x] `src/features/super-admin/tenants/TenantFilters.tsx`
- [x] `src/features/super-admin/tenants/TenantTableRow.tsx`
- [x] `src/features/super-admin/tenants/constants.ts`
- [x] `src/pages/super-admin/tenants.tsx` — wired up

**Done when:** `/super-admin/tenants` shows paginated, searchable, filterable table with loading/error/empty states.

---

#### Day 4 — SA: Tenant Detail + Actions

**Status: [x] Complete**
**Modules: M6**

- [x] `src/features/super-admin/tenants/TenantDetail.tsx`
- [x] `src/features/super-admin/tenants/TenantStatusActions.tsx`
- [x] `src/features/super-admin/tenants/TenantMetaCard.tsx`
- [x] `src/features/super-admin/tenants/useTenantDetail.ts`
- [x] `src/features/super-admin/tenants/useTenantActions.ts`
- [x] `src/pages/super-admin/tenant-detail.tsx` — wired up

**Done when:** `/super-admin/tenants/:id` shows full profile; suspend/approve/reactivate all work with ConfirmDialog.

---

#### Day 5 — SA: Dashboard + Platform Analytics

**Status: [x] Complete**
**Modules: M9**

- [x] `src/features/super-admin/analytics/analytics.types.ts`
- [x] `src/features/super-admin/analytics/analyticsService.ts`
- [x] `src/features/super-admin/analytics/useAnalytics.ts`
- [x] `src/features/super-admin/analytics/MrrChart.tsx`
- [x] `src/features/super-admin/analytics/TenantGrowthChart.tsx`
- [x] `src/features/super-admin/analytics/SignupFunnelChart.tsx`
- [x] `src/features/super-admin/analytics/PlatformMetrics.tsx`
- [x] `src/features/super-admin/analytics/SuperAdminDashboardSummary.tsx`
- [x] `src/features/super-admin/analytics/AnalyticsView.tsx`
- [x] `src/pages/super-admin/dashboard.tsx` — wired up
- [x] `src/pages/super-admin/analytics.tsx` — wired up

**Done when:** SA dashboard shows StatCard grid + charts; analytics page shows MRR trend, tenant growth, funnel.

---

#### Day 6 — SA: Billing + Promo Codes + Pricing Tiers

**Status: [ ] Pending**
**Modules: M7**

- [ ] `src/features/super-admin/billing/billing.types.ts`
- [ ] `src/features/super-admin/billing/billingService.ts`
- [ ] `src/features/super-admin/billing/useBilling.ts`
- [ ] `src/features/super-admin/billing/BillingOverview.tsx`
- [ ] `src/features/super-admin/billing/InvoiceTable.tsx`
- [ ] `src/features/super-admin/billing/SubscriptionTable.tsx`
- [ ] `src/features/super-admin/billing/promo-codes/promoCode.types.ts`
- [ ] `src/features/super-admin/billing/promo-codes/promoCodeService.ts`
- [ ] `src/features/super-admin/billing/promo-codes/usePromoCodes.ts`
- [ ] `src/features/super-admin/billing/promo-codes/PromoCodeList.tsx`
- [ ] `src/features/super-admin/billing/promo-codes/CreatePromoCodeForm.tsx`
- [ ] `src/features/super-admin/billing/promo-codes/promoCode.constants.ts`
- [ ] `src/features/super-admin/billing/pricing-tiers/pricingTier.types.ts`
- [ ] `src/features/super-admin/billing/pricing-tiers/pricingTierService.ts`
- [ ] `src/features/super-admin/billing/pricing-tiers/usePricingTiers.ts`
- [ ] `src/features/super-admin/billing/pricing-tiers/PricingTierForm.tsx`
- [ ] `src/pages/super-admin/billing.tsx` — wired up
- [ ] `src/pages/super-admin/promo-codes.tsx` — wired up

**Done when:** Billing page shows invoices + subscriptions + pricing tier editor. Promo codes CRUD works.

---

#### Day 7 — SA: Feature Flags + Support + Onboarding Queue

**Status: [ ] Pending**
**Modules: M9**

- [ ] `src/features/super-admin/feature-flags/featureFlag.types.ts`
- [ ] `src/features/super-admin/feature-flags/featureFlagService.ts`
- [ ] `src/features/super-admin/feature-flags/useFeatureFlags.ts`
- [ ] `src/features/super-admin/feature-flags/FeatureFlagList.tsx`
- [ ] `src/features/super-admin/feature-flags/FeatureFlagRow.tsx`
- [ ] `src/features/super-admin/support/support.types.ts`
- [ ] `src/features/super-admin/support/supportService.ts`
- [ ] `src/features/super-admin/support/useSupportTickets.ts`
- [ ] `src/features/super-admin/support/SupportQueue.tsx`
- [ ] `src/features/super-admin/support/SupportTicketRow.tsx`
- [ ] `src/features/super-admin/support/SupportTicketDetail.tsx`
- [ ] `src/features/super-admin/onboarding/onboarding.types.ts`
- [ ] `src/features/super-admin/onboarding/onboardingService.ts`
- [ ] `src/features/super-admin/onboarding/useOnboardingQueue.ts`
- [ ] `src/features/super-admin/onboarding/OnboardingQueue.tsx`
- [ ] `src/features/super-admin/onboarding/OnboardingReviewCard.tsx`
- [ ] `src/pages/super-admin/feature-flags.tsx` — wired up
- [ ] `src/pages/super-admin/support.tsx` — wired up
- [ ] `src/pages/super-admin/onboarding.tsx` — wired up

**Done when:** Feature flags toggle. Support queue + detail dialog work. B2B onboarding queue approve/reject works. Super Admin console fully complete.

---

### Phase 3 — Property Manager Portal

---

#### Day 8 — PM: Dashboard + Residents + Bulk Approve + Pending Feed + Export CSV

**Status: [ ] Pending**
**Modules: M6, M10**

- [ ] `src/features/property-manager/residents/resident.types.ts`
- [ ] `src/features/property-manager/residents/residentService.ts`
- [ ] `src/features/property-manager/residents/useResidents.ts`
- [ ] `src/features/property-manager/residents/ResidentList.tsx`
- [ ] `src/features/property-manager/residents/ResidentFilters.tsx`
- [ ] `src/features/property-manager/residents/ResidentTableRow.tsx`
- [ ] `src/features/property-manager/residents/RemoveResidentDialog.tsx`
- [ ] `src/features/property-manager/residents/BulkApproveBar.tsx`
- [ ] `src/features/property-manager/residents/useBulkApproveResidents.ts`
- [ ] `src/features/property-manager/residents/constants.ts`
- [ ] `src/features/property-manager/dashboard/PmDashboardSummary.tsx`
- [ ] `src/features/property-manager/dashboard/EngagementChart.tsx`
- [ ] `src/features/property-manager/dashboard/PendingRegistrationsFeed.tsx`
- [ ] `src/features/property-manager/dashboard/useResidentNotifications.ts`
- [ ] `src/features/property-manager/dashboard/pmDashboard.types.ts`
- [ ] `src/features/property-manager/dashboard/usePmDashboard.ts`
- [ ] `src/pages/property-manager/dashboard.tsx` — wired up
- [ ] `src/pages/property-manager/residents.tsx` — wired up

**Done when:** PM dashboard shows stats + engagement chart + pending registrations feed. Residents page has bulk approve, remove with confirm, Export CSV.

---

#### Day 9 — PM: Unit Directory + CSV Import + Pending Flags

**Status: [ ] Pending**
**Modules: M10**

- [ ] `src/features/property-manager/units/unit.types.ts`
- [ ] `src/features/property-manager/units/unitService.ts`
- [ ] `src/features/property-manager/units/useUnits.ts`
- [ ] `src/features/property-manager/units/UnitList.tsx`
- [ ] `src/features/property-manager/units/UnitTableRow.tsx`
- [ ] `src/features/property-manager/units/UnitFormDialog.tsx`
- [ ] `src/features/property-manager/units/CsvImportDialog.tsx`
- [ ] `src/features/property-manager/units/useUnitMutations.ts`
- [ ] `src/features/property-manager/units/unit.constants.ts`
- [ ] `src/pages/property-manager/units.tsx` — wired up

**Done when:** Full unit directory with create/edit/delete, vacancy toggle, CSV import, pending registration flags, and summary counts (total/occupied/vacant).

---

#### Day 10 — PM: Branding + Challenges + Scheduled Announcements + Equipment

**Status: [ ] Pending**
**Modules: M6**

- [ ] `src/features/property-manager/branding/branding.types.ts`
- [ ] `src/features/property-manager/branding/brandingService.ts`
- [ ] `src/features/property-manager/branding/useBranding.ts`
- [ ] `src/features/property-manager/branding/BrandingForm.tsx`
- [ ] `src/features/property-manager/branding/LogoUpload.tsx`
- [ ] `src/features/property-manager/branding/ColorPicker.tsx`
- [ ] `src/features/property-manager/challenges/challenge.types.ts`
- [ ] `src/features/property-manager/challenges/challengeService.ts`
- [ ] `src/features/property-manager/challenges/useChallenges.ts`
- [ ] `src/features/property-manager/challenges/ChallengeList.tsx`
- [ ] `src/features/property-manager/challenges/ChallengeFormDialog.tsx`
- [ ] `src/features/property-manager/announcements/announcement.types.ts`
- [ ] `src/features/property-manager/announcements/announcementService.ts`
- [ ] `src/features/property-manager/announcements/useAnnouncements.ts`
- [ ] `src/features/property-manager/announcements/AnnouncementList.tsx`
- [ ] `src/features/property-manager/announcements/AnnouncementComposer.tsx`
- [ ] `src/features/shared/equipment/equipment.types.ts`
- [ ] `src/features/shared/equipment/equipmentService.ts`
- [ ] `src/features/shared/equipment/useEquipment.ts`
- [ ] `src/features/shared/equipment/EquipmentManager.tsx`
- [ ] `src/features/shared/equipment/EquipmentFormDialog.tsx`
- [ ] `src/pages/property-manager/announcements.tsx` — new page
- [ ] `src/pages/property-manager/equipment.tsx` — new page
- [ ] `src/pages/property-manager/branding.tsx` — wired up
- [ ] `src/pages/property-manager/challenges.tsx` — wired up
- [ ] `src/routes/index.tsx` — add PM /announcements + /equipment routes

**Done when:** Branding (logo + colors + live preview), challenges CRUD, announcements with scheduled delivery, equipment checklist. PM portal fully complete.

---

### Phase 4 — Trainer Portal

---

#### Day 11 — Trainer: Client List + Inactive Flags + Shareable Invite + Dashboard

**Status: [ ] Pending**
**Modules: M8**

- [ ] `src/features/trainer/clients/client.types.ts`
- [ ] `src/features/trainer/clients/clientService.ts`
- [ ] `src/features/trainer/clients/useClients.ts`
- [ ] `src/features/trainer/clients/ClientList.tsx`
- [ ] `src/features/trainer/clients/ClientTableRow.tsx`
- [ ] `src/features/trainer/clients/ClientFilters.tsx`
- [ ] `src/features/trainer/clients/InviteClientDialog.tsx` — tabs: Email Invite | Shareable Link
- [ ] `src/features/trainer/clients/useInviteClient.ts`
- [ ] `src/features/trainer/clients/useGenerateInviteLink.ts`
- [ ] `src/features/trainer/clients/client.constants.ts` — INACTIVE_AMBER_DAYS = 7, INACTIVE_RED_DAYS = 14
- [ ] `src/features/trainer/dashboard/trainerDashboard.types.ts`
- [ ] `src/features/trainer/dashboard/trainerDashboardService.ts`
- [ ] `src/features/trainer/dashboard/useTrainerDashboard.ts`
- [ ] `src/features/trainer/dashboard/TrainerDashboardSummary.tsx`
- [ ] `src/features/trainer/dashboard/ClientAdherenceChart.tsx`
- [ ] `src/features/trainer/dashboard/InactiveClientsAlert.tsx`
- [ ] `src/pages/trainer/clients.tsx` — wired up
- [ ] `src/pages/trainer/dashboard.tsx` — wired up

**Done when:** Trainer dashboard shows stats + adherence chart + inactive client alert. Client list shows amber/red flags, email invite, shareable link, Export CSV.

---

#### Day 12 — Trainer: Client Detail (Full Profile)

**Status: [ ] Pending**
**Modules: M8**

- [ ] `src/features/trainer/clients/ClientDetail.tsx`
- [ ] `src/features/trainer/clients/ClientMetaCard.tsx`
- [ ] `src/features/trainer/clients/ClientWorkoutLog.tsx`
- [ ] `src/features/trainer/clients/ClientNutritionSummary.tsx`
- [ ] `src/features/trainer/clients/ClientProgressSummary.tsx`
- [ ] `src/features/trainer/clients/useClientDetail.ts`
- [ ] `src/features/trainer/clients/useClientWorkoutLog.ts`
- [ ] `src/features/trainer/clients/useClientNutrition.ts`
- [ ] `src/pages/trainer/client-detail.tsx` — wired up

**Done when:** `/trainer/clients/:id` shows 4 tabs (Overview / Workouts / Nutrition / Progress), all sections load independently.

---

#### Day 13 — Trainer: Program + Nutrition Assignment

**Status: [ ] Pending**
**Modules: M8**

- [ ] `src/features/trainer/programs/program.types.ts`
- [ ] `src/features/trainer/programs/programService.ts`
- [ ] `src/features/trainer/programs/usePrograms.ts`
- [ ] `src/features/trainer/programs/ProgramList.tsx`
- [ ] `src/features/trainer/programs/ProgramCard.tsx`
- [ ] `src/features/trainer/programs/AssignProgramDialog.tsx`
- [ ] `src/features/trainer/programs/ProgramTemplateSelector.tsx`
- [ ] `src/features/trainer/programs/useAssignProgram.ts`
- [ ] `src/features/trainer/programs/program.constants.ts`
- [ ] `src/features/trainer/clients/AssignNutritionDialog.tsx`
- [ ] `src/features/trainer/clients/useAssignNutrition.ts`
- [ ] `src/features/trainer/clients/nutrition.types.ts`
- [ ] `src/pages/trainer/programs.tsx` — wired up

**Done when:** Programs page shows My Programs + Template Library. Assign Program and Assign Nutrition dialogs work from Client Detail.

---

#### Day 14 — Trainer: Check-In System

**Status: [ ] Pending**
**Modules: M8**

- [ ] `src/features/trainer/check-ins/checkIn.types.ts`
- [ ] `src/features/trainer/check-ins/checkInService.ts`
- [ ] `src/features/trainer/check-ins/useCheckIns.ts`
- [ ] `src/features/trainer/check-ins/CheckInList.tsx`
- [ ] `src/features/trainer/check-ins/CheckInCard.tsx`
- [ ] `src/features/trainer/check-ins/CheckInReplyDialog.tsx`
- [ ] `src/features/trainer/check-ins/CheckInScheduleForm.tsx`
- [ ] `src/features/trainer/check-ins/useCheckInMutations.ts`
- [ ] `src/features/trainer/check-ins/checkIn.constants.ts`
- [ ] `src/pages/trainer/check-ins.tsx` — wired up

**Done when:** Check-ins page shows Pending Replies tab + Schedule tab. Reply dialog works. Schedule form configures recurring form.

---

#### Day 15 — Trainer: Broadcast Messaging + Named Groups + Scheduled Delivery + Progress Dashboard

**Status: [ ] Pending**
**Modules: M8**

- [ ] `src/features/trainer/messaging/messaging.types.ts`
- [ ] `src/features/trainer/messaging/messagingService.ts`
- [ ] `src/features/trainer/messaging/useMessages.ts`
- [ ] `src/features/trainer/messaging/MessageComposer.tsx` — subject, body, audience, scheduled delivery
- [ ] `src/features/trainer/messaging/MessageHistory.tsx`
- [ ] `src/features/trainer/messaging/useSendBroadcast.ts`
- [ ] `src/features/trainer/messaging/ClientGroupList.tsx`
- [ ] `src/features/trainer/messaging/ClientGroupFormDialog.tsx`
- [ ] `src/features/trainer/messaging/useClientGroups.ts`
- [ ] `src/features/trainer/messaging/useClientGroupMutations.ts`
- [ ] `src/features/trainer/progress/progress.types.ts`
- [ ] `src/features/trainer/progress/progressService.ts`
- [ ] `src/features/trainer/progress/useClientProgress.ts`
- [ ] `src/features/trainer/progress/ClientProgressDashboard.tsx`
- [ ] `src/features/trainer/progress/WeightTrendChart.tsx`
- [ ] `src/features/trainer/progress/AdherenceChart.tsx`
- [ ] `src/features/trainer/progress/MacroAdherenceChart.tsx`
- [ ] `src/features/trainer/progress/GoalProgressRing.tsx`
- [ ] `src/features/trainer/progress/ExportProgressButton.tsx`
- [ ] `src/pages/trainer/messages.tsx` — Broadcast + Groups tabs

**Done when:** Broadcast messages send to all / named group / specific clients with scheduled delivery. Named groups can be created/edited. Client progress dashboard shows charts + goal ring + PDF export.

---

#### Day 16 — Trainer: 1-on-1 Client Messaging (Socket.io)

**Status: [ ] Pending**
**Modules: M8**

- [ ] `src/features/trainer/messaging/one-on-one/conversation.types.ts`
- [ ] `src/features/trainer/messaging/one-on-one/conversationService.ts`
- [ ] `src/features/trainer/messaging/one-on-one/useConversations.ts`
- [ ] `src/features/trainer/messaging/one-on-one/useSocketMessages.ts` — Socket.io client hook
- [ ] `src/features/trainer/messaging/one-on-one/ConversationList.tsx`
- [ ] `src/features/trainer/messaging/one-on-one/ChatWindow.tsx`
- [ ] `src/features/trainer/messaging/one-on-one/MessageBubble.tsx`
- [ ] `src/features/trainer/messaging/one-on-one/VoiceNoteRecorder.tsx` — MediaRecorder API → S3
- [ ] `src/features/trainer/messaging/one-on-one/FileAttachmentButton.tsx` — PDF upload
- [ ] `src/features/trainer/messaging/one-on-one/conversation.constants.ts`
- [ ] `src/pages/trainer/messages.tsx` — add Direct Messages tab

**Done when:** Direct Messages tab shows split-pane chat (conversation list left, chat right). Text, voice note, and PDF attachment all work. Messages update in real-time via Socket.io.

---

### Phase 5 — Shared Features + B2B Onboarding

---

#### Day 17 — Trainer Shared Settings + Close All Routing Gaps

**Status: [ ] Pending**
**Modules: M6**

- [ ] `src/features/trainer/challenges/trainerChallengeService.ts`
- [ ] `src/features/trainer/challenges/useTrainerChallenges.ts`
- [ ] `src/pages/trainer/challenges.tsx` — composes ChallengeList (from Day 10)
- [ ] `src/pages/trainer/branding.tsx` — composes BrandingForm (from Day 10)
- [ ] `src/pages/trainer/equipment.tsx` — composes EquipmentManager (from Day 10)
- [ ] `src/routes/index.tsx` — add ALL missing routes:
  - PM: `/announcements`, `/equipment`, `/billing`
  - Trainer: `/challenges`, `/branding`, `/equipment`, `/billing`

**Done when:** Trainer challenges/branding/equipment pages work. Every route in nav-config.ts resolves — zero 404s from nav clicks.

---

#### Day 18 — Shared Billing + Workspace Wizard + Trial Expiry UI

**Status: [ ] Pending**
**Modules: M7, M9**

- [ ] `src/features/shared/billing/billing.types.ts`
- [ ] `src/features/shared/billing/billingService.ts`
- [ ] `src/features/shared/billing/useBilling.ts`
- [ ] `src/features/shared/billing/BillingDashboard.tsx`
- [ ] `src/features/shared/billing/InvoiceList.tsx`
- [ ] `src/features/shared/billing/StripeBillingPortalButton.tsx`
- [ ] `src/features/shared/billing/TrialCountdownBanner.tsx`
- [ ] `src/features/shared/billing/TrialExpiredBanner.tsx` — disables write actions in read-only mode
- [ ] `src/features/trainer/onboarding/onboarding.types.ts`
- [ ] `src/features/trainer/onboarding/onboardingService.ts`
- [ ] `src/features/trainer/onboarding/WorkspaceWizard.tsx`
- [ ] `src/features/trainer/onboarding/steps/BrandingStep.tsx`
- [ ] `src/features/trainer/onboarding/steps/EquipmentStep.tsx`
- [ ] `src/features/trainer/onboarding/steps/PricingStep.tsx`
- [ ] `src/features/trainer/onboarding/steps/InviteStep.tsx`
- [ ] `src/features/trainer/onboarding/useWorkspaceWizard.ts`
- [ ] `src/features/trainer/onboarding/onboarding.constants.ts` — WIZARD_STEPS, TRIAL_DAYS = 14, GRACE_PERIOD_DAYS = 7
- [ ] `src/pages/trainer/billing.tsx` — new page
- [ ] `src/pages/property-manager/billing.tsx` — new page
- [ ] `src/layouts/AdminLayout.tsx` — inject TrialCountdownBanner / TrialExpiredBanner

**Done when:** Billing page works for PM + Trainer. Workspace wizard completes all 4 steps. Trial countdown banner shows. Trial expired banner disables write actions.

---

#### Day 19 — B2B Landing Page + Trainer Self-Service Registration

**Status: [ ] Pending**
**Modules: M9**

- [ ] `src/pages/landing.tsx` — public B2B marketing page
- [ ] `src/pages/register.tsx` — trainer self-service registration
- [ ] `src/features/trainer/onboarding/RegistrationForm.tsx` — name, email, password, business type, plan, terms
- [ ] `src/features/trainer/onboarding/useRegisterTrainer.ts`
- [ ] `src/features/trainer/onboarding/PricingCard.tsx` — Starter/Growth/Pro cards
- [ ] `src/features/trainer/onboarding/TrialConversionBanner.tsx` — 14-day countdown in dashboard
- [ ] `src/features/trainer/onboarding/registration.types.ts`
- [ ] `src/features/trainer/onboarding/registration.constants.ts` — BUSINESS_TYPES array
- [ ] `src/routes/index.tsx` — add /landing + /register public routes

**Done when:** `/landing` shows hero + features + pricing cards + CTA. `/register` has business type dropdown, email verification flow, and redirects to workspace wizard on completion.

---

### Phase 6 — Polish + Tests

---

#### Day 20 — Audit + Tests + CI Green

**Status: [ ] Pending**
**Modules: All**

Audit checklist:

- [ ] Every data-fetching page has loading / error / empty states
- [ ] Every destructive action uses ConfirmDialog
- [ ] Every form uses a Zod schema
- [ ] `tsc --noEmit` exits 0 (no `any` types)
- [ ] ESLint passes (no `console.log`)
- [ ] All Recharts charts in `ResponsiveContainer`
- [ ] All icon-only buttons have `aria-label`
- [ ] All nav-config routes resolve (no 404s)
- [ ] Trial expired banner disables write actions
- [ ] Scheduled announcements/messages show clock badge
- [ ] Inactive client flags show at 7 and 14 day thresholds
- [ ] Socket.io connects and disconnects cleanly

Tests to write:

- [ ] `src/features/auth/authService.test.ts`
- [ ] `src/features/super-admin/tenants/useTenants.test.ts`
- [ ] `src/features/super-admin/tenants/TenantList.test.tsx`
- [ ] `src/features/super-admin/billing/pricing-tiers/PricingTierForm.test.tsx`
- [ ] `src/features/property-manager/residents/useBulkApproveResidents.test.ts`
- [ ] `src/features/trainer/clients/useClients.test.ts`
- [ ] `src/features/trainer/clients/useGenerateInviteLink.test.ts`
- [ ] `src/features/trainer/messaging/one-on-one/useSocketMessages.test.ts`
- [ ] `src/components/shared/ConfirmDialog.test.tsx`
- [ ] `src/components/shared/StatusBadge.test.tsx`
- [ ] `src/components/shared/ExportCsvButton.test.tsx`
- [ ] `src/lib/errors.test.ts`
- [ ] `src/lib/permissions.test.ts`

**Done when:** `vitest run` passes. `tsc --noEmit` exits 0. ESLint clean. CI pipeline green.

---

## Document Coverage Checklist

Everything from the SOW document that belongs to the admin portal:

### M6 — Admin Portal

- [x] Infrastructure (already built)
- [ ] Auth — login, 2FA, role-based route guards → **Day 2**
- [ ] Resident/client management — list, search, filter, suspend, remove → **Days 8, 11**
- [ ] Export CSV — residents + clients → **Days 8, 11**
- [ ] Bulk approve residents → **Day 8**
- [ ] Pending registrations feed → **Day 8**
- [ ] Unit directory — CRUD, CSV import, vacancy, pending flags → **Day 9**
- [ ] Branding config — logo, colors, live preview → **Day 10**
- [ ] Gym equipment management → **Day 10**
- [ ] Basic engagement overview (dashboard) → **Day 8**
- [ ] SA — tenant list + detail + actions → **Days 3, 4**
- [ ] SA — platform analytics → **Day 5**
- [ ] SA — pricing tier management → **Day 6**
- [ ] SA — feature flags → **Day 7**
- [ ] SA — support escalation queue → **Day 7**
- [ ] SA — B2B onboarding approval queue → **Day 7**

### M7 — Billing

- [ ] Billing dashboard (plan, invoices, Stripe portal) → **Day 18**
- [ ] SA promo codes → **Day 6**
- [ ] Trainer → Client Stripe Connect OAuth → **Day 18**
- [ ] Upgrade/downgrade/cancel subscription → **Day 18**

### M8 — Trainer Portal

- [ ] Client list + profile view → **Days 11, 12**
- [ ] Inactive client amber flags → **Day 11**
- [ ] Shareable invite link → **Day 11**
- [ ] Export CSV clients → **Day 11**
- [ ] Program assignment (AI / curated / custom) → **Day 13**
- [ ] Nutrition plan assignment → **Day 13**
- [ ] 1-on-1 messaging (Socket.io, voice note, PDF) → **Day 16**
- [ ] Broadcast messaging + named groups + scheduled → **Day 15**
- [ ] Client check-in system → **Day 14**
- [ ] Client progress dashboard + PDF export → **Day 15**

### M9 — B2B Onboarding

- [ ] B2B marketing landing page → **Day 19**
- [ ] Trainer self-service registration + business type → **Day 19**
- [ ] Workspace setup wizard (4 steps) → **Day 18**
- [ ] Self-service subscription management → **Day 18**
- [ ] Trial countdown + expiry read-only UI → **Day 18**
- [ ] SA platform analytics → **Day 5**

### M10 — Unit Directory + PM Workflow

- [ ] Unit directory CRUD + CSV import + pending flags → **Day 9**
- [ ] Resident removal → **Day 8**
- [ ] PM notification on new resident registration → **Day 8**

---

## Architecture Rules (Quick Reference)

1. `Component → useXxx hook → xxxService.ts → src/lib/axios.ts` — never break this chain
2. Named exports everywhere except page files (default exports for lazy loading)
3. Max 200 lines per component — split if exceeded
4. Skeleton loading (`DataTableSkeleton`) for all lists/tables — no spinners for data
5. `ConfirmDialog` for every destructive action
6. `can(action)` from `usePermissions()` — never `user.role === 'x'` in JSX
7. `toast.error(getErrorMessage(err))` on every mutation catch — no silent failures
8. All Recharts charts in `ResponsiveContainer`
9. All constants in `constants.ts` — no magic numbers or strings
10. Shared feature components written once, imported by both PM and Trainer
