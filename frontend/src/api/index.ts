import type {
  Alias,
  CreateAliasPayload,
  CreateDestinationPayload,
  Destination,
  UpdateAliasPayload,
  UpdateDestinationPayload,
} from "./types"

const BASE = import.meta.env.VITE_API_BASE_URL || ""

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text()
    try {
      const parsed = JSON.parse(body)
      throw new Error(parsed.error || parsed.message || body || res.statusText)
    } catch {
      if (body) throw new Error(body)
      throw new Error(res.statusText)
    }
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  // Destinations
  listDestinations: () =>
    request<Destination[]>("/destinations"),

  createDestination: (payload: CreateDestinationPayload) =>
    request<Destination>("/destinations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateDestination: (id: number, payload: UpdateDestinationPayload) =>
    request<Destination>(`/destinations/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteDestination: (id: number) =>
    request<void>(`/destinations/${id}`, { method: "DELETE" }),

  // Aliases
  listAliases: () =>
    request<Alias[]>("/aliases"),

  createAlias: (payload: CreateAliasPayload) =>
    request<Alias>("/aliases", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateAlias: (id: number, payload: UpdateAliasPayload) =>
    request<Alias>(`/aliases/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteAlias: (id: number) =>
    request<void>(`/aliases/${id}`, { method: "DELETE" }),
}
