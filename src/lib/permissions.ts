import type { UserRole } from '@/types/auth.types'

// All possible actions in the admin portal
export type PermissionAction =
  // Super Admin — tenant management
  | 'view_all_tenants'
  | 'approve_tenant'
  | 'suspend_tenant'
  | 'reactivate_tenant'
  | 'edit_pricing_tiers'
  | 'manage_platform_subscriptions'
  | 'generate_promo_codes'
  | 'view_platform_analytics'
  | 'manage_feature_flags'
  | 'manage_platform_branding'
  | 'view_support_queue'
  | 'resolve_support_ticket'
  // Property Manager — residents & units
  | 'view_residents'
  | 'remove_resident'
  | 'manage_units'
  | 'view_unit_directory'
  // Trainer — clients & programs
  | 'invite_client'
  | 'view_clients'
  | 'assign_program'
  | 'assign_nutrition_plan'
  | 'message_client'
  | 'view_client_progress'
  | 'manage_check_ins'
  // Shared admin
  | 'manage_challenges'
  | 'post_announcement'
  | 'configure_branding'
  | 'manage_equipment'
  | 'view_billing'

const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  super_admin: [
    'view_all_tenants',
    'approve_tenant',
    'suspend_tenant',
    'reactivate_tenant',
    'edit_pricing_tiers',
    'manage_platform_subscriptions',
    'generate_promo_codes',
    'view_platform_analytics',
    'manage_feature_flags',
    'manage_platform_branding',
    'view_support_queue',
    'resolve_support_ticket',
    'view_billing',
  ],
  property_manager: [
    'view_residents',
    'remove_resident',
    'manage_units',
    'view_unit_directory',
    'manage_challenges',
    'post_announcement',
    'configure_branding',
    'manage_equipment',
    'view_billing',
  ],
  trainer: [
    'invite_client',
    'view_clients',
    'assign_program',
    'assign_nutrition_plan',
    'message_client',
    'view_client_progress',
    'manage_check_ins',
    'manage_challenges',
    'post_announcement',
    'configure_branding',
    'manage_equipment',
    'view_billing',
  ],
}

export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  return ROLE_PERMISSIONS[role].includes(action)
}
