export interface SetVariablesBody {
  twitter: {
    consumer_key: string
    consumer_secret: string
    callback: string
  },
  discord: {
    enabled: boolean
    token: string
    prefix: string
    allowed_channels: string[]
  }
}