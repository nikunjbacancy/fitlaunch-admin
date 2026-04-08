import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { LocationManager, TAddManagerPayload } from './manager.types'

interface LocationWithManagers {
  id: string
  name: string
  property_managers?: {
    id: string
    full_name: string
    email: string
    status: string
  }[]
  propertyManagers?: {
    id: string
    fullName: string
    email: string
    status: string
  }[]
}

export const managerService = {
  async getAll(): Promise<LocationManager[]> {
    const results: LocationManager[] = []

    try {
      const locations = await apiClient.get<{
        success: boolean
        data: LocationWithManagers[]
      }>(API_ENDPOINTS.OWNER_LOCATIONS.LIST)

      for (const loc of locations.data.data) {
        // Handle both snake_case and camelCase response shapes
        const managers = loc.property_managers ?? loc.propertyManagers ?? []
        for (const pm of managers) {
          results.push({
            id: pm.id,
            fullName: 'full_name' in pm ? pm.full_name : pm.fullName,
            email: pm.email,
            status: pm.status,
            locationId: loc.id,
            locationName: loc.name,
          })
        }
      }
    } catch {
      // If locations endpoint fails, return empty — the ManagerList will show empty state
      return []
    }

    return results
  },

  async addToLocation(payload: TAddManagerPayload): Promise<void> {
    await apiClient.post(API_ENDPOINTS.OWNER_LOCATIONS.ADD_MANAGER(payload.location_id), {
      full_name: payload.full_name,
      email: payload.email,
    })
  },

  async removeFromLocation(locationId: string, managerId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.OWNER_LOCATIONS.REMOVE_MANAGER(locationId, managerId))
  },
}
