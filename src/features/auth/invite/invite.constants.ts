// ── DISABLED: onboarding wizard redirect map ────────────────────────────────
// Product decision (2026-04-13): branding + unit directory are no longer part
// of invite acceptance. All roles now redirect to /login after setting their
// password. Kept commented so we can restore the wizard flow if product
// direction changes.
//
// export const INVITE_ONBOARDING_REDIRECT: Record<string, string> = {
//   password_set: '/pm/setup',
//   branding_complete: '/pm/setup',
//   billing_complete: '/pm/setup',
//   units_complete: '/dashboard',
//   active: '/dashboard',
// }
//
// export const INVITE_REDIRECT_FALLBACK = '/pm/setup'

export const INVITE_REDIRECT_LOGIN = '/login'

export const INVITE_COPY = {
  // Left panel feature bullets
  LEFT_FEATURE_1_TITLE: 'Secure by default',
  LEFT_FEATURE_1_DESC: 'Role-based access keeps your data protected',
  LEFT_FEATURE_2_TITLE: 'Resident management',
  LEFT_FEATURE_2_DESC: 'Manage units, residents, and fitness programs',
  LEFT_FEATURE_3_TITLE: 'Real-time analytics',
  LEFT_FEATURE_3_DESC: 'Track engagement across your community',
  LEFT_INVITED_TO: "You've been invited to",
  LEFT_EXPIRY: 'Invitation links expire after 48 hours',
  // Right panel
  RIGHT_HEADING: 'Create your password',
  RIGHT_SUBTITLE_PREFIX: 'Welcome, ',
  RIGHT_SUBTITLE_SUFFIX: '. Set a secure password to activate your account.',
  // Error states
  ALREADY_USED_TITLE: 'Your account is already set up',
  ALREADY_USED_MSG: "You've already accepted this invitation. Sign in to access your dashboard.",
  ALREADY_USED_CTA: 'Go to Login',
  INVALID_TITLE: 'Invalid invitation',
  INVALID_MSG: 'This invitation link is invalid. Please contact your administrator.',
  EXPIRED_MSG:
    'This invitation has expired (links are valid 48 hours). Please contact your administrator.',
  VALIDATING: 'Validating your invitation\u2026',
  // Form labels
  PASSWORD_LABEL: 'New Password',
  CONFIRM_LABEL: 'Confirm Password',
  SUBMIT: 'Set Password & Continue',
  SUBMITTING: 'Setting password\u2026',
  // Requirements
  REQ_LENGTH: 'At least 8 characters',
  REQ_UPPER: 'One uppercase letter',
  REQ_NUMBER: 'One number',
  REQ_SPECIAL: 'One special character',
} as const
