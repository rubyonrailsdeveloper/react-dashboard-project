import api, { path, unauthenticatedApi } from 'src/api/api'

const loginPath = path('login')
const logoutPath = path('logout')
const currentUserPath = path('me')

export interface AuthProps {
  username: string
  password: string
}

export const login = async (payload: AuthProps) => {
  try {
    const result = await unauthenticatedApi.post(loginPath(), payload)
    return result.data
  } catch (e) {
    const { message } = e.response.data
    throw new Error(message)
  }
}

export const logout = async () => {
  await api.post(logoutPath())
  return {}
}

export const currentUser = async (token: string) => {
  const result = await unauthenticatedApi.get(currentUserPath(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return result.data
}
