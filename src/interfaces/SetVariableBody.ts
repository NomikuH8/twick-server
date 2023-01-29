export interface SetVariablesBody {
  twitter: {
    client_id: string
    client_secret: string
    callback: string
  },
  discord: {
    enabled: boolean
    token: string
    prefix: string
    allowed_channels: string[]
  }
}