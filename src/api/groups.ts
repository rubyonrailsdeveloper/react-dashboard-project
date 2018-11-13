import { normalize } from 'normalizr'
import api, { path } from 'src/api/api'
import { Group, groupSchema } from 'src/store/group/group-model'

const groups = path('groups')

const postProcessGroup = (g: Partial<Group>) => {
  // nothing so far
}

export const findAll = async () => {
  const result = await api.get(groups())
  const groupList: Array<Partial<Group>> = result.data.data

  groupList.forEach(postProcessGroup)

  return normalize(groupList, [groupSchema])
}

export const find = async (id: string) => {
  const result = await api.get(groups(id))
  const group: Partial<Group> = result.data

  postProcessGroup(group)

  return normalize(group, groupSchema)
}

export const quotas = async () => {
  const result = await api.get(groups('quotas'))
  return result.data || 'OK'
}

export interface GroupEditableProps {
  name: string
  clusters: string[]
  roles: string[]
}

export const create = async (id: string, payload: GroupEditableProps) => {
  const result = await api.post(groups(), payload)
  return result.data || 'OK'
}

export const update = async (id: string, payload: GroupEditableProps) => {
  const result = await api.put(groups(id), payload)
  return result.data || 'OK'
}

export const remove = async (id: string) => {
  const result = await api.delete(groups(id))
  return result.data || 'OK'
}
