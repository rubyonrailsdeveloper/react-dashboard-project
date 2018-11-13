import { denormalize, schema } from 'normalizr'
import { Health } from 'src/store/constants'

export const clusterSchema = new schema.Entity('clusters', {})

interface RelatedEntityCount {
  total: number
  warning: number
  failing: number
}

export interface CommonCluster {
  id: string
  name: string
  health: Health
  nodesStatus: RelatedEntityCount
  containerStatus: RelatedEntityCount
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
  localRateIn: number
  localRateOut: number
  localRateProcessing: number
  localMsgBacklog: number
  remoteRateIn: number
  remoteRateOut: number
  remoteRateProcessing: number
  remoteMsgBacklog: number
}

export type Cluster = CommonCluster

export type NormalizedCluster = CommonCluster

// tslint:disable-next-line no-empty-interface
export interface ClusterSubEntities {
  // Nothing yet
}

export const denormalizeCluster = (
  cluster: NormalizedCluster | null,
  entities: ClusterSubEntities
): Cluster => denormalize(cluster, clusterSchema, entities)
