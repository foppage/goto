export interface Destination {
  id: number
  name: string
  url: string
}

export interface Alias {
  id: number
  name: string
  destination_id: number
}

export interface CreateDestinationPayload {
  name: string
  url: string
}

export interface UpdateDestinationPayload {
  name: string
  url: string
}

export interface CreateAliasPayload {
  name: string
  destination_id: number
}

export interface UpdateAliasPayload {
  name: string
  destination_id: number
}
