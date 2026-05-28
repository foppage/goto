import { z } from "zod"

export const DestinationSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
})

export const AliasSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, "Name is required"),
  destination_id: z.number().int(),
})

export const CreateDestinationPayloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
})

export const UpdateDestinationPayloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
})

export const CreateAliasPayloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  destination_id: z.number().int(),
})

export const UpdateAliasPayloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  destination_id: z.number().int(),
})

export const DestinationArraySchema = z.array(DestinationSchema)
export const AliasArraySchema = z.array(AliasSchema)

export type Destination = z.infer<typeof DestinationSchema>
export type Alias = z.infer<typeof AliasSchema>
export type CreateDestinationPayload = z.infer<typeof CreateDestinationPayloadSchema>
export type UpdateDestinationPayload = z.infer<typeof UpdateDestinationPayloadSchema>
export type CreateAliasPayload = z.infer<typeof CreateAliasPayloadSchema>
export type UpdateAliasPayload = z.infer<typeof UpdateAliasPayloadSchema>
