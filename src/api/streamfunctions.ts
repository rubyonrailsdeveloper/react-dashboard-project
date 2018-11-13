import { normalize } from 'normalizr'
import api, { path } from 'src/api/api'
import { StreamFunction, streamFunctionSchema } from 'src/store/streamfunction/streamfunction-model'

const streamFunctions = path('functions')

const postProcessStreamFunction = (g: Partial<StreamFunction>) => {
  // nothing so far
}

export const findAll = async () => {
  const result = await api.get(streamFunctions())
  const streamFunctionList: Array<Partial<StreamFunction>> = result.data.data

  streamFunctionList.forEach(postProcessStreamFunction)

  return normalize(streamFunctionList, [streamFunctionSchema])
}

export const find = async (id: string) => {
  const result = await api.get(streamFunctions(id))
  const streamFunction: Partial<StreamFunction> = result.data

  postProcessStreamFunction(streamFunction)

  return normalize(streamFunction, streamFunctionSchema)
}

export interface StreamFunctionEditableProps {
  group: string
  namespace: string
  name: string
}

export const create = async (id: string, payload: StreamFunctionEditableProps) => {
  const result = await api.post(streamFunctions(), payload)
  return result.data || 'OK'
}

export const update = async (id: string, payload: StreamFunctionEditableProps) => {
  const result = await api.put(streamFunctions(id), payload)
  return result.data || 'OK'
}

export const remove = async (id: string) => {
  const result = await api.delete(streamFunctions(id))
  return result.data || 'OK'
}
