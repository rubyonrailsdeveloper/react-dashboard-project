import { denormalize, schema } from 'normalizr'
import { Health, RelatedEntity } from 'src/store/constants'

export const groupSchema = new schema.Entity('groups', {})

export interface CommonGroup {
  id: string
  name: string
  health: Health
  clusters: string[]
  pipelines: RelatedEntity[]
  topics: RelatedEntity[]
  namespaces: RelatedEntity[]
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
}

export type Group = CommonGroup

export type NormalizedGroup = CommonGroup

// tslint:disable-next-line no-empty-interface
export interface GroupSubEntities {
  // Nothing yet
}

export const denormalizeGroup = (
  namespace: NormalizedGroup | null,
  entities: GroupSubEntities
): Group => denormalize(namespace, groupSchema, entities)
