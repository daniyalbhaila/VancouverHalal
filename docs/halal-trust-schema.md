# Halal Trust System - Database Schema

> This document defines the database fields required for the halal verification and dietary information features.

## Current Schema

### `halal_restaurants` Table

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `halal_status` | `text` | `'community_listed'` | Verification tier (see values below) |

### Valid `halal_status` Values

| Value | Badge Color | Meaning |
|-------|-------------|---------|
| `certified` | 🟢 Green | Has official halal certification documents |
| `community_listed` | ⚪ Gray | Crowd-sourced listing, generally trusted |
| `verbally_confirmed` | 🟡 Amber | Staff confirmed halal options, verify yourself |
| `muslim_owned` | 🔵 Blue | Muslim-owned business (legacy, maps to community) |
| `unverified` | 🔴 Red | No verification, use caution |

---

## Future Schema (Not Yet Implemented)

### Dietary Information Columns

When ready to add detailed dietary flags, add these columns to `halal_restaurants`:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `alcohol_served` | `text` | `null` | `'none'`, `'served'`, or `'bar_separated'` |
| `pork_on_menu` | `text` | `null` | `'none'`, `'served'`, or `'kitchen_shared'` |
| `meat_source` | `text` | `null` | `'hand_slaughtered'`, `'machine_cut'`, `'mixed'`, or `'unverified'` |

### SQL Migration Example

```sql
-- Add dietary columns
ALTER TABLE halal_restaurants
ADD COLUMN alcohol_served text DEFAULT NULL,
ADD COLUMN pork_on_menu text DEFAULT NULL,
ADD COLUMN meat_source text DEFAULT NULL;

-- Update a restaurant with dietary info
UPDATE halal_restaurants
SET 
  halal_status = 'certified',
  alcohol_served = 'none',
  pork_on_menu = 'none',
  meat_source = 'hand_slaughtered'
WHERE name = 'Paramount Fine Foods';
```

---

## How to Add a New Restaurant

1. **Set `halal_status`** based on your verification source:
   - Got official docs? → `'certified'`
   - From a halal list/community? → `'community_listed'`
   - Staff said it's halal? → `'verbally_confirmed'`

2. **(Optional) Set dietary flags** if known:
   - Does it serve alcohol? → `alcohol_served`
   - Is there pork in the kitchen? → `pork_on_menu`
   - How is the meat slaughtered? → `meat_source`

---

## Code References

- **Type definitions**: `lib/data.ts` (`RestaurantCard`, `DietaryInfo`)
- **Badge component**: `components/TrustBadge.tsx`
- **Dietary flags component**: `components/DietaryFlags.tsx`
- **Data fetching**: `lib/data.ts` (`getDiscoveryRestaurants`, `getRestaurantBySlug`)
