import { api_base_url } from "./configuration"

export interface ShortenLinkRequest {
  target_url: string
}

export interface ShortenLinkResponse {
  target_url: string
  is_active: boolean
  clicks: number
  url: string
  admin_url: string
}

export default class API {

  static async shortenLink(body: ShortenLinkRequest): Promise<ShortenLinkResponse> {
    const res = await fetch(`${api_base_url}/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })
    
    const data: ShortenLinkResponse = await res.json()

    return data
  }
}
