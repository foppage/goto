import { z } from "zod"
import {
  type Alias,
  type CreateAliasPayload,
  type CreateDestinationPayload,
  type Destination,
  type UpdateAliasPayload,
  type UpdateDestinationPayload,
  AliasArraySchema,
  AliasSchema,
  CreateAliasPayloadSchema,
  CreateDestinationPayloadSchema,
  DestinationArraySchema,
  DestinationSchema,
  UpdateAliasPayloadSchema,
  UpdateDestinationPayloadSchema,
} from "./types"

const BASE = import.meta.env.VITE_API_BASE_URL || ""

function validate<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(`${label}: ${result.error.message}`)
  }
  return result.data
}

async function request<T>(url: string, schema: z.ZodType<T>, options?: RequestInit): Promise<T> {
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
  const data = await res.json()
  return validate(schema, data, "Invalid server response")
}

export const api = {
  // Destinations
  listDestinations: () =>
    request<Destination[]>("/api/destinations", DestinationArraySchema),

  createDestination: (payload: CreateDestinationPayload) =>
    request<Destination>("/api/destinations", DestinationSchema, {
      method: "POST",
      body: JSON.stringify(validate(CreateDestinationPayloadSchema, payload, "Invalid request payload")),
    }),

  updateDestination: (id: number, payload: UpdateDestinationPayload) =>
    request<Destination>(`/api/destinations/${id}`, DestinationSchema, {
      method: "PUT",
      body: JSON.stringify(validate(UpdateDestinationPayloadSchema, payload, "Invalid request payload")),
    }),

  deleteDestination: (id: number) =>
    request<void>(`/api/destinations/${id}`, z.void(), { method: "DELETE" }),

  // Aliases
  listAliases: () =>
    request<Alias[]>("/api/aliases", AliasArraySchema),

  createAlias: (payload: CreateAliasPayload) =>
    request<Alias>("/api/aliases", AliasSchema, {
      method: "POST",
      body: JSON.stringify(validate(CreateAliasPayloadSchema, payload, "Invalid request payload")),
    }),

  updateAlias: (id: number, payload: UpdateAliasPayload) =>
    request<Alias>(`/api/aliases/${id}`, AliasSchema, {
      method: "PUT",
      body: JSON.stringify(validate(UpdateAliasPayloadSchema, payload, "Invalid request payload")),
    }),

  deleteAlias: (id: number) =>
    request<void>(`/api/aliases/${id}`, z.void(), { method: "DELETE" }),
}
