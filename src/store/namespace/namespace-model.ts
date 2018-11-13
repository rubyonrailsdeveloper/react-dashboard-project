import { denormalize, schema } from 'normalizr'
import { Health, RelatedEntity } from 'src/store/constants'

export const namespaceSchema = new schema.Entity('namespaces', {})

export interface CommonNamespace {
  id: string
  group: string
  groupId: string
  name: string
  health: Health
  clusters: string[]
  pipelines: RelatedEntity[]
  topics: RelatedEntity[]
  resources: {
    limits: {
      cpu: number
      storage: number
      memory: number
    }
    used: {
      cpu: number
      storage: number
      memory: number
    }
  }
  msgRateIn: number
  msgRateOut: number
  msgRateProcessing: number
  msgThroughputIn: number
  msgThroughputOut: number
  msgThroughputProcessing: number
  msgBacklog: number
}

export type Namespace = CommonNamespace

export type NormalizedNamespace = CommonNamespace

// tslint:disable-next-line no-empty-interface
export interface NamespaceSubEntities {
  // Nothing yet
}

export const denormalizeNamespace = (
  namespace: NormalizedNamespace | null,
  entities: NamespaceSubEntities
): Namespace => denormalize(namespace, namespaceSchema, entities)

export const makeNamespaceId = (group: string, name: string) => `${group}/${name}`
