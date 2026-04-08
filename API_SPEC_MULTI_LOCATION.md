# API Specification — Multi-Location Property Owner (Change Order #1)

> **Context:** The admin portal (React.js SPA) has been fully built for multi-location ownership.
> This document specifies every API endpoint the frontend expects. All endpoints return JSON.
> Auth: JWT Bearer token required on all routes except where noted.

---

## 1. Database Schema Changes

### New Tables

```sql
-- Ownership groups (one per property company)
CREATE TABLE owner_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,              -- e.g. "Meridian Properties LLC"
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Junction: which tenants (apartment complexes) belong to which owner group
CREATE TABLE owner_group_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_group_id UUID NOT NULL REFERENCES owner_groups(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(owner_group_id, tenant_id)
);

-- Representatives: multiple users with property_owner role under one owner group
CREATE TABLE owner_group_representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_group_id UUID NOT NULL REFERENCES owner_groups(id),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'invited',    -- 'active' | 'invited' | 'removed'
  invited_at TIMESTAMP DEFAULT NOW(),
  joined_at TIMESTAMP,
  removed_at TIMESTAMP
);
```

### Modified Tables

```sql
-- users table: add role enum value
ALTER TYPE user_role ADD VALUE 'property_owner';

-- users table: add owner_group_id for property_owner users
ALTER TABLE users ADD COLUMN owner_group_id UUID REFERENCES owner_groups(id);

-- tenants table: support multiple property managers (already many-to-many via admin_users)
-- No schema change needed if admin_users junction already supports multiple PMs per tenant.
-- If currently single-PM, convert:
--   DROP the single property_manager_id FK
--   Ensure tenant_admin_users junction table allows multiple rows per tenant_id
```

### JWT Payload Update

Add `owner_group_id` to the JWT payload for `property_owner` role users:

```json
{
  "sub": "user-uuid",
  "email": "owner@company.com",
  "full_name": "Robert Johnson",
  "role": "property_owner",
  "tenant_id": null,
  "owner_group_id": "group-uuid",
  "iat": 1234567890,
  "exp": 1234568790
}
```

---

## 2. API Endpoints

### 2.1 Owner Dashboard

#### `GET /owner/dashboard/metrics`

**Auth:** `property_owner` role required
**Description:** Aggregate metrics across all locations in the owner's group.
**Response:**

```json
{
  "totalLocations": 5,
  "totalUnits": 1200,
  "totalMembers": 890,
  "totalMrr": 4200.0,
  "activeLocations": 5,
  "membersActiveThisWeek": 312,
  "challengesRunning": 3
}
```

**Logic:** Look up `owner_group_id` from JWT → get all `tenant_id`s from `owner_group_locations` → aggregate.

---

#### `GET /owner/dashboard/location-stats`

**Auth:** `property_owner` role required
**Description:** Per-location stats for the dashboard table.
**Response:**

```json
[
  {
    "locationId": "tenant-uuid-1",
    "locationName": "The Meridian",
    "memberCount": 230,
    "activeThisWeek": 85,
    "occupancyRate": 0.76,
    "mrr": 900.0,
    "challengesRunning": 1,
    "recentRegistrations": 12
  }
]
```

---

#### `GET /owner/dashboard/comparison`

**Auth:** `property_owner` role required
**Description:** Same data as location-stats but structured for comparison charts.
**Response:**

```json
{
  "locations": [
    {
      "locationId": "tenant-uuid-1",
      "locationName": "The Meridian",
      "memberCount": 230,
      "activeThisWeek": 85,
      "occupancyRate": 0.76,
      "mrr": 900.0,
      "challengesRunning": 1,
      "recentRegistrations": 12
    }
  ]
}
```

---

### 2.2 Owner Locations

#### `GET /owner/locations`

**Auth:** `property_owner` role required
**Description:** List all locations (apartment complexes) in the owner's group.
**Response:**

```json
[
  {
    "id": "tenant-uuid",
    "name": "The Meridian",
    "appDisplayName": "Meridian Fitness",
    "logoUrl": "https://cdn.example.com/logo.png",
    "primaryColor": "#192640",
    "secondaryColor": "#4A90D9",
    "unitCount": 300,
    "memberCount": 230,
    "status": "active",
    "pricePerUnit": 3.0,
    "mrr": 900.0,
    "propertyManagers": [
      {
        "id": "user-uuid",
        "fullName": "Jane Smith",
        "email": "jane@meridian.com",
        "status": "active"
      }
    ],
    "createdAt": "2026-01-15T00:00:00Z"
  }
]
```

**Also used by:** Manager service aggregates `property_managers` from this response.

---

#### `POST /owner/locations`

**Auth:** `property_owner` role required
**Description:** Owner self-adds a new apartment complex. Must:

1. Create new tenant record with `tenant_type = 'apartment'`
2. Link it to the owner's `owner_group_id` in `owner_group_locations`
3. **Send alert to all Super Admin users** (push + email via SendGrid): "New location added by [Owner Group Name]: [Complex Name] — [unit_count] units"
4. **Auto-update Stripe subscription** — add the new location's units to the owner's existing subscription as a new line item

**Request:**

```json
{
  "complex_name": "Sunset Ridge",
  "unit_count": 150,
  "address": "456 Oak Ave, Denver, CO"
}
```

**Response:** Same shape as a single item from `GET /owner/locations`

---

#### `GET /owner/locations/:id`

**Auth:** `property_owner` role required. Verify the location belongs to the owner's group.
**Response:** Same shape as single item from `GET /owner/locations`

---

#### `GET /owner/locations/:id/stats`

**Auth:** `property_owner` role required
**Response:** Same shape as a single `OwnerLocationStats` object from `/owner/dashboard/location-stats`

---

#### `PATCH /owner/locations/:id/branding`

**Auth:** `property_owner` role required
**Description:** Owner overrides branding for any location they own. Both owner AND the local PM can edit branding — last write wins.
**Request:**

```json
{
  "app_display_name": "Meridian Fitness",
  "primary_color": "#192640",
  "secondary_color": "#4A90D9",
  "logo_url": "https://cdn.example.com/new-logo.png"
}
```

All fields optional. Only provided fields are updated.
**Response:** `200 OK`

---

#### `GET /owner/locations/:id/managers`

**Auth:** `property_owner` role required
**Response:**

```json
[
  {
    "id": "user-uuid",
    "full_name": "Jane Smith",
    "email": "jane@meridian.com",
    "status": "active"
  }
]
```

---

#### `POST /owner/locations/:id/managers`

**Auth:** `property_owner` role required
**Description:** Add a new property manager to a location. Creates user with `role = 'property_manager'` and sends invite email. Multiple PMs per location is allowed.
**Request:**

```json
{
  "full_name": "John Doe",
  "email": "john@meridian.com"
}
```

**Response:** `201 Created`

---

#### `DELETE /owner/locations/:locationId/managers/:managerId`

**Auth:** `property_owner` role required
**Description:** Remove a PM from a location. Revoke their access. Notify them via email.
**Response:** `200 OK`

---

### 2.3 Owner Representatives

#### `GET /owner/representatives`

**Auth:** `property_owner` role required
**Description:** List all representatives in the owner's group.
**Response:**

```json
[
  {
    "id": "user-uuid",
    "fullName": "Robert Johnson",
    "email": "robert@company.com",
    "status": "active",
    "joinedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "user-uuid-2",
    "fullName": "Sarah Lee",
    "email": "sarah@company.com",
    "status": "invited",
    "joinedAt": null
  }
]
```

---

#### `POST /owner/representatives/invite`

**Auth:** `property_owner` role required
**Description:** Invite a new representative. Creates a user with `role = 'property_owner'` and `owner_group_id` matching the inviter's group. Sends invite email via SendGrid. The new rep gets **equal access** to everything (all locations, billing, other reps).
**Request:**

```json
{
  "full_name": "Sarah Lee",
  "email": "sarah@company.com"
}
```

**Response:** The created representative object.

---

#### `DELETE /owner/representatives/:id`

**Auth:** `property_owner` role required
**Description:** Remove a representative. Set status to `removed`, revoke their JWT sessions. Cannot remove yourself.
**Response:** `200 OK`

---

### 2.4 Owner Billing

#### `GET /owner/billing`

**Auth:** `property_owner` role required
**Description:** Combined billing overview — one invoice covers all locations.
**Response:**

```json
{
  "totalMrr": 4200.0,
  "totalUnits": 1200,
  "nextInvoiceDate": "2026-05-01T00:00:00Z",
  "paymentMethodLast4": "4242",
  "perLocationBreakdown": [
    {
      "locationId": "tenant-uuid-1",
      "locationName": "The Meridian",
      "unitCount": 300,
      "pricePerUnit": 3.0,
      "monthlyTotal": 900.0
    },
    {
      "locationId": "tenant-uuid-2",
      "locationName": "Sunset Ridge",
      "unitCount": 150,
      "pricePerUnit": 3.5,
      "monthlyTotal": 525.0
    }
  ]
}
```

**Stripe logic:** The owner group has one Stripe Customer. The subscription has multiple line items — one per location. Each line item's quantity = unit_count, unit_amount = price_per_unit.

---

#### `GET /owner/billing/invoices`

**Auth:** `property_owner` role required
**Description:** Recent invoices from Stripe for this owner's subscription.
**Response:**

```json
[
  {
    "id": "inv_abc123",
    "date": "2026-04-01T00:00:00Z",
    "amount": 4200.0,
    "status": "paid",
    "pdfUrl": "https://pay.stripe.com/invoice/abc123/pdf"
  }
]
```

---

### 2.5 Super Admin — Owner Group Management

#### `GET /admin/owner-groups`

**Auth:** `super_admin` role required
**Response:**

```json
[
  {
    "id": "group-uuid",
    "name": "Meridian Properties LLC",
    "owner_email": "robert@company.com",
    "location_count": 3,
    "total_units": 750,
    "total_mrr": 2625.0,
    "created_at": "2026-01-15T00:00:00Z"
  }
]
```

---

#### `POST /admin/owner-groups`

**Auth:** `super_admin` role required
**Description:** Create a new owner group and invite the primary owner representative.

1. Create `owner_groups` record
2. Create user with `role = 'property_owner'`, `owner_group_id = new group id`
3. Create `owner_group_representatives` record with `status = 'invited'`
4. Send invite email via SendGrid (same flow as PM invite — accept page sets password + 2FA)
5. Create Stripe Customer for the owner group

**Request:**

```json
{
  "name": "Meridian Properties LLC",
  "owner_full_name": "Robert Johnson",
  "owner_email": "robert@company.com"
}
```

**Response:** The created `OwnerGroupListItem`

---

#### `GET /admin/owner-groups/:id`

**Auth:** `super_admin` role required
**Response:** Full owner group detail with locations and representatives arrays.

---

#### `POST /admin/owner-groups/:id/locations`

**Auth:** `super_admin` role required
**Description:** Assign an existing apartment complex to an owner group.
**Request:**

```json
{
  "tenant_id": "tenant-uuid"
}
```

**Response:** `200 OK`

---

#### `DELETE /admin/owner-groups/:groupId/locations/:locationId`

**Auth:** `super_admin` role required
**Description:** Remove a location from an owner group.
**Response:** `200 OK`

---

## 3. Middleware Requirements

### Owner Group Authorization Middleware

For all `/owner/*` routes, add middleware that:

1. Extracts `owner_group_id` from JWT
2. Verifies the user's `owner_group_id` is not null
3. For location-specific routes (`/owner/locations/:id/*`), verifies the location belongs to the user's owner group via `owner_group_locations` table
4. Rejects with `403 Forbidden` if any check fails

### Multi-PM Notification Updates

When a resident registers at an apartment complex (existing M10 flow), the push + email notification must now go to **all** property managers linked to that tenant, not just one.

Query: `SELECT * FROM tenant_admin_users WHERE tenant_id = ? AND role = 'property_manager'`

---

## 4. Stripe Integration Changes

### Owner-Level Billing (replaces per-tenant billing for owned locations)

When a location is assigned to an owner group:

1. Cancel the location's individual Stripe subscription (if any)
2. Add the location as a line item on the owner group's subscription
3. Line item: `quantity = unit_count`, `unit_amount = price_per_unit * 100` (cents)

When owner self-adds a new location (`POST /owner/locations`):

1. Create tenant record
2. Link to owner group
3. **Automatically** add as new line item to owner's existing Stripe subscription
4. Stripe webhook `customer.subscription.updated` will confirm the change

### Invoice Structure

Owner receives **one combined invoice** with per-location line items. Stripe's invoice PDF will show the breakdown automatically if line item descriptions include location names.

---

## 5. SendGrid Email Templates Needed

| Trigger                  | Template                          | Recipients             |
| ------------------------ | --------------------------------- | ---------------------- |
| Owner group created      | Owner invite (set password + 2FA) | Primary owner          |
| Representative invited   | Rep invite (set password + 2FA)   | New representative     |
| New location self-added  | Alert: new location added         | All Super Admin users  |
| PM added to location     | PM invite (set password + 2FA)    | New PM                 |
| PM removed from location | Access revoked notification       | Removed PM             |
| Representative removed   | Access revoked notification       | Removed representative |

---

## 6. Key Business Rules

1. **All representatives have equal access** — no permission hierarchy within an owner group
2. **Owner can edit branding on any owned location** — same permissions as the local PM
3. **No notification when owner steps into a location** — confirmed, removed from scope
4. **PM assignment is optional** on new location — owner can run a location without a PM
5. **Cross-location member access is separate** — each location's community is isolated (Phase 2)
6. **Gym chain support** — foundation built now (owner group model supports it), activation is Phase 2
