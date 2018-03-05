export const ENDPOINT = 'https://mylitmus.cloud'
export const API_BASE = `${ENDPOINT}/v1`
export const LOGIN_URL = `${ENDPOINT}/auth/login/`
export const ZONES_API = `${API_BASE}/users/self/zones/`
export const ZONE_INFO_API = `${API_BASE}/zones/`

const SECONDS = 1000
export const DASHBOARD_REFRESH_TIME = 30 * SECONDS

export const SVG_DEFAULT_HEIGHT = 500