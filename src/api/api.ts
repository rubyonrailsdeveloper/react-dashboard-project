import axios from 'axios'
import storage from 'src/util/storage'

const API_BASE = process.env.API_BASE

// Maybe we should encodeURIComponent the suffix (but convert the slashes back to normal)?
// Chris' comment on this: currently they [entity names] should only contain
// letters, numbers ‘-’ and ‘.’
export const path = (basePath: string) => (suffix?: string) =>
  `${basePath}${suffix ? '/' + suffix : ''}`

const baseConfig = {
  baseURL: API_BASE,
  headers: {
    Accept: 'application/json',
  },
}

const api = axios.create(baseConfig)

const enableAuth = 'debugAuth'

api.interceptors.request.use(config => {
  if (process.env.ENABLE_AUTH) {
    if (!config.params) config.params = {}
    config.params[enableAuth] = true
    const { auth: { token } } = storage.load()
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const unauthenticatedApi = axios.create(baseConfig)

export default api
