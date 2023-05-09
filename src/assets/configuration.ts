export const api_base_url = import.meta.env.VITE_API_BASE_URL || 'https://test.chr.red'
export const environment = import.meta.env.ENVIROMENT || 'test'

export function setLinkDomain(shouldUseProduction: boolean = false): string {
    const url: string = shouldUseProduction ? "https://chr.red" : api_base_url
    return url
}
