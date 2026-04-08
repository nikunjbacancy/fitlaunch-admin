import {
  LayoutDashboard,
  Building2,
  UserCheck,
  CreditCard,
  Tag,
  BarChart3,
  ToggleLeft,
  HeadphonesIcon,
  Users,
  Home,
  Megaphone,
  Palette,
  Dumbbell,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  MapPin,
  GitCompareArrows,
  UserPlus,
  UsersRound,
} from 'lucide-react'
import type { UserRole } from '@/types/auth.types'

export interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

export const NAV_CONFIG: Record<UserRole, NavGroup[]> = {
  super_admin: [
    {
      items: [{ label: 'Dashboard', path: '/super-admin', icon: LayoutDashboard }],
    },
    {
      title: 'Apartments',
      items: [
        { label: 'All Complexes', path: '/super-admin/tenants', icon: Building2 },
        { label: 'Owner Groups', path: '/super-admin/owner-groups', icon: UsersRound },
      ],
    },
    {
      title: 'Trainers & Gyms',
      items: [
        { label: 'All Trainers', path: '/super-admin/trainers', icon: Dumbbell },
        { label: 'Onboarding Queue', path: '/super-admin/onboarding', icon: UserCheck },
      ],
    },
    {
      title: 'Billing',
      items: [
        { label: 'Subscriptions', path: '/super-admin/billing', icon: CreditCard },
        { label: 'Promo Codes', path: '/super-admin/promo-codes', icon: Tag },
      ],
    },
    {
      title: 'Platform',
      items: [
        { label: 'Analytics', path: '/super-admin/analytics', icon: BarChart3 },
        { label: 'Feature Flags', path: '/super-admin/feature-flags', icon: ToggleLeft },
        { label: 'Support Queue', path: '/super-admin/support', icon: HeadphonesIcon },
      ],
    },
  ],

  property_owner: [
    {
      items: [{ label: 'Dashboard', path: '/property-owner', icon: LayoutDashboard }],
    },
    {
      title: 'Locations',
      items: [
        { label: 'All Locations', path: '/property-owner/locations', icon: MapPin },
        { label: 'Compare', path: '/property-owner/comparison', icon: GitCompareArrows },
      ],
    },
    {
      title: 'Team',
      items: [
        { label: 'Managers', path: '/property-owner/managers', icon: Users },
        { label: 'Representatives', path: '/property-owner/representatives', icon: UserPlus },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Branding', path: '/property-owner/branding', icon: Palette },
        { label: 'Billing', path: '/property-owner/billing', icon: CreditCard },
      ],
    },
  ],

  property_manager: [
    {
      items: [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Community',
      items: [
        { label: 'Residents', path: '/residents', icon: Users },
        { label: 'Units', path: '/units', icon: Home },
        { label: 'Challenges', path: '/challenges', icon: TrendingUp },
        { label: 'Announcements', path: '/announcements', icon: Megaphone },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Branding', path: '/branding', icon: Palette },
        { label: 'Equipment', path: '/equipment', icon: Dumbbell },
        { label: 'Billing', path: '/billing', icon: CreditCard },
      ],
    },
  ],

  trainer: [
    {
      items: [{ label: 'Dashboard', path: '/trainer', icon: LayoutDashboard }],
    },
    {
      title: 'Clients',
      items: [
        { label: 'Client List', path: '/trainer/clients', icon: Users },
        { label: 'Programs', path: '/trainer/programs', icon: ClipboardList },
        { label: 'Check-Ins', path: '/trainer/check-ins', icon: TrendingUp },
        { label: 'Messages', path: '/trainer/messages', icon: MessageSquare },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Challenges', path: '/challenges', icon: TrendingUp },
        { label: 'Branding', path: '/branding', icon: Palette },
        { label: 'Equipment', path: '/equipment', icon: Dumbbell },
        { label: 'Billing', path: '/billing', icon: CreditCard },
      ],
    },
  ],
}
