import { denormalize, schema } from 'normalizr'
import { Health, RelatedEntity } from 'src/store/constants'

export const streamFunctionSchema = new schema.Entity('streamfunction', {})

export interface CommonStreamFunction {
  id: string
  name: string
  group: string
  groupId: string
  namespace: string
  namespaceId: string
  topicIn: string
  topicOut: string
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

export type StreamFunction = CommonStreamFunction

export type NormalizedStreamFunction = CommonStreamFunction

// tslint:disable-next-line no-empty-interface
export interface StreamFunctionSubEntities {
  // Nothing yet
}

export const denormalizeStreamFunction = (
  streamFunction: NormalizedStreamFunction | null,
  entities: StreamFunctionSubEntities
): StreamFunction => denormalize(streamFunction, streamFunctionSchema, entities)

export const makeStreamFunctionId = (group: string, name: string) => `${group}/${name}`

