import { normalize } from 'normalizr'
import api, { path } from 'src/api/api'
import { Namespace, namespaceSchema } from 'src/store/namespace/namespace-model'

const namespaces = path('namespaces')

const postProcessNamespace = (n: Partial<Namespace>) => {
  // Make it easy for the rest of the codebase to reference IDs
  n.groupId = n.group
}

export const findAll = async () => {
  const result = await api.get(namespaces())
  const namespaceList: Array<Partial<Namespace>> = result.data.data

  namespaceList.forEach(postProcessNamespace)

  return normalize(namespaceList, [namespaceSchema])
}

export const find = async (id: string) => {
  const result = await api.get(namespaces(id))
  const namespace: Partial<Namespace> = result.data

  postProcessNamespace(namespace)

  return normalize(namespace, namespaceSchema)
}

export const remove = async (id: string) => {
  const result = await api.delete(namespaces(id))
  return result.data || 'OK'
}

export interface NamespaceEditableProps {
  // optional list of clusters if not provide all clusters that the team has access to
  clusters?: string[]

  // authorizations "name-of-role": [list of actions (produce|consume)]
  authorizations: {
    [role: string]: Array<'produce' | 'consume'>
  }

  // optional ttl for message retention in seconds if not provided or 0 messages are discarded right away
  messageTtl?: number

  // optional
  backlogQuota?: {
    topic: {
      storageLimit: number // long bytes,
      action: 'block' | 'exception' | 'drop'
    }
  }

  // optional
  dataRetension?: {
    sizeLimit: number // bytes,
    time: number // long seconds
  }

  deduplication?: boolean | null // null default

  // persistence optional if provided then all fields in the object are all required
  persistence?: {
    writeQuorum: number
    ackQuorum: number
    ensembleSize: number
    cursorPersistentThrottling: number // long 0 - disabled
  }

  // optional resource limits for this namespace
  resourceLimits?: {
    cpu?: number
    memory?: number // bytes
    storage?: number // bytes
  }
}

export const create = async (id: string, payload: NamespaceEditableProps) => {
  const result = await api.post(namespaces(id), payload)
  return result.data || 'OK'
}

export const update = async (id: string, payload: Partial<NamespaceEditableProps>) => {
  const result = await api.put(namespaces(id), payload)
  return result.data || 'OK'
}

export const clearBacklog = async (id: string) => {
  const result = await api.post(namespaces(`${id}/clearbacklog`))
  return result.data || 'OK'
}

export const unload = async (id: string) => {
  const result = await api.post(namespaces(`${id}/unload`))
  return result.data || 'OK'
}
