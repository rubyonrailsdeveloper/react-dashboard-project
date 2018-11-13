import { NormalizedCluster } from 'src/store/cluster/cluster-model'
import { NormalizedGroup } from 'src/store/group/group-model'
import { NormalizedNamespace } from 'src/store/namespace/namespace-model'
import { NormalizedNode } from 'src/store/node/node-model'
import { Instance, NormalizedPhysicalPlan } from 'src/store/physical-plan/physical-plan-model'
import { NormalizedPipeline } from 'src/store/pipeline/pipeline-model'
import { NormalizedStreamFunction } from 'src/store/streamfunction/streamfunction-model'
import { NormalizedTopic } from 'src/store/topic/topic-model'
import { NormalizedUser } from 'src/store/user/user-model'

export interface EntitiesById<T> {
  [id: string]: T
}

// See https://github.com/paularmstrong/normalizr/blob/master/docs/api.md#schema for result formats
export interface NormalizedPayload {
  entities: {
    pipelines?: EntitiesById<NormalizedPipeline>
    physicalPlans?: EntitiesById<NormalizedPhysicalPlan>
    instances?: EntitiesById<Instance>
    topics?: EntitiesById<NormalizedTopic>
    streamFunctions?: EntitiesById<NormalizedStreamFunction>
    namespaces?: EntitiesById<NormalizedNamespace>
    groups?: EntitiesById<NormalizedGroup>
    clusters?: EntitiesById<NormalizedCluster>
    nodes?: EntitiesById<NormalizedNode>
    containers?: EntitiesById<NormalizedNode>
    users?: EntitiesById<NormalizedUser>
  }
  result:
    | string
    | string[]
    | {
        pipelines?: string[]
        physicalPlans?: string[]
        instances?: string[]
      }
}

export type EntityDenormalizer<T, Denormalized, SubEntities> = (
  normalized: T,
  entities: SubEntities
) => Denormalized
