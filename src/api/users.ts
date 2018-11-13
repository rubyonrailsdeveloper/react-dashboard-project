import { normalize } from 'normalizr'
import api, { path } from 'src/api/api'
import { User, userSchema } from 'src/store/user/user-model'

const users = path('users')

export const findAll = async () => {
  const result = await api.get(users())
  const userList: Array<Partial<User>> = result.data.data

  return normalize(userList, [userSchema])
}

export const find = async (id: string) => {
  const result = await api.get(users(id))
  const user: Partial<User> = result.data

  return normalize(user, userSchema)
}

export interface UserEditableProps {
  name: string
  username: string
  email: string[]
  password?: string
  passwordConfirmation?: string
}

export const create = async (payload: UserEditableProps) => {
  const result = await api.post(users(), payload)
  return result.data || 'OK'
}

export const update = async (id: string, payload: UserEditableProps) => {
  const result = await api.post(users(id), payload)
  return result.data || 'OK'
}

export const remove = async (id: string) => {
  const result = await api.delete(users(id))
  return result.data || 'OK'
}
