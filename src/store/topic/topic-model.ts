import mapValues from 'lodash-es/mapValues'
import sumBy from 'lodash-es/sumBy'
import { denormalize, schema } from 'normalizr'
import { Health } from 'src/store/constants'
import { pagerFactory } from 'src/util/pager'
import { flatMap } from 'tslint/lib/utils'

interface CommonTopic {
  id: string
  health: Health
  groupId: string
  group: string
  namespaceId: string
  namespace: string
  name: string
  clusters: string[]
  msgRateIn: number
  msgThroughputIn: number
  msgRateOut: number
  msgThroughputOut: number
  averageMsgSize: number
  storageUsed: number
  storageSize: number
  replication: {}
  deduplicationStatus: DeduplicationStatus
  producers: Producer[]
  subscriptions: { [subscriptionId: string]: Subscription }
  msgBacklog: number
  partitions: {
    [partitionId: string]: Partition
  }
  brokers: Broker[]
}

interface Partition {
  health: Health
  averageMsgSize: number
  deduplicationStatus: DeduplicationStatus
  msgRateIn: number
  msgRateOut: number
  msgThroughputIn: number
  msgThroughputOut: number
  publishers: [string]
  replication: {}
  storageSize: number
  subscriptions: { [subscriptionId: string]: Subscription }
}

interface Broker {
  adress: string
  health: Health
}

export enum DeduplicationStatus {
  DISABLED = 'Disabled',
  RECOVERING = 'Recovering',
  ENABLED = 'Enabled',
  REMOVING = 'Removing',
  FAILED = 'Failed',
}

export type IdIfTypePipeline =
  | { type: TopicIOType.EXTERNAL }
  | { type: TopicIOType.PIPELINE; id: string }

export type Producer = IdIfTypePipeline & {
  address: string
  averageMsgSize: number
  clientVersion: string
  connectedSince: string
  connectedSinceTimestamp: number // in milliseconds
  msgRateIn: number
  msgThroughputIn: number
  producerId: number
  producerName: string
  health: Health
  pipelineId?: string | null // TODO: [ofer 5-Mar-18]: is this a hack?
}

export interface Subscription {
  blockedSubscriptionOnUnackedMsgs: boolean
  consumers: Consumer[]
  msgBacklog: number
  msgRateExpired: number
  msgRateOut: number
  msgRateRedeliver: number
  msgThroughputOut: number
  type: SubscriptionType
  unackedMessages: number
}

export type ConsumerWithSubsData = Consumer & {
  subscription: Subscription
  subscriptionId: string
  topicId: string
}

export type Consumer = IdIfTypePipeline & {
  address: string
  availablePermits: number
  blockedConsumerOnUnackedMsgs: boolean
  clientVersion: string
  connectedSince: string
  connectedSinceTimestamp: number // in milliseconds
  consumerName: string
  msgRateOut: number
  msgRateRedeliver: number
  msgThroughputOut: number
  unackedMessages: number
  health: Health
}

export enum TopicIOType {
  PIPELINE = 'pipeline',
  EXTERNAL = 'external',
}

export enum SubscriptionType {
  EXCLUSIVE = 'Exclusive',
  FAILOVER = 'Failover',
  SHARED = 'Shared',
}

export interface TopicPipelines {
  inputs: Producer[]
  outputs: Consumer[]
}

export type NormalizedTopic = CommonTopic

export type Topic = CommonTopic

export const topicSchema = new schema.Entity('topics', {})

// tslint:disable-next-line no-empty-interface
export interface TopicSubEntities {
  // Nothing yet
}

export const denormalizeTopic = (
  topic: NormalizedTopic | null,
  entities: TopicSubEntities
): Topic => denormalize(topic, topicSchema, entities)

export const TopicFields = {
  health: {
    id: 'health',
    label: '',
    sortIterator: null,
  },
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (t: Topic) => t.name,
  },
  clusters: {
    id: 'clusters',
    label: 'Clusters',
    sortIterator: null,
  },
  pipelines: {
    id: 'pipelines',
    label: 'Pipelines',
    sortIterator: (t: Topic) => sumBy(Object.values(topicPipelines(t)), p => p.length),
  },
  storage: {
    id: 'storage',
    label: 'Storage',
    sortIterator: (t: Topic) => t.storageUsed / t.storageSize,
  },
  averageMsgSize: {
    id: 'averageMsgSize',
    label: 'Average event size',
    sortIterator: (t: Topic) => t.averageMsgSize,
  },
  backlog: {
    id: 'backlog',
    label: 'Backlog',
    sortIterator: (t: Topic) => t.msgBacklog,
  },
  eventsRate: {
    id: 'eventsRate',
    label: 'Rate',
    sortIterator: null,
  },
  byteRate: {
    id: 'byteRate',
    label: 'Byte rate',
    sortIterator: null,
  },
}

export const ProducerFields = {
  health: {
    id: 'health',
    label: '',
    sortIterator: null,
  },
  producerName: {
    id: 'producerName',
    label: 'Name',
    sortIterator: null,
  },
  msgRateIn: {
    id: 'msgRateIn',
    label: 'Rate',
    sortIterator: null,
  },
  msgThroughputIn: {
    id: 'msgThroughputIn',
    label: 'Byte rate',
    sortIterator: null,
  },
  latency: {
    id: 'latency',
    label: 'Publish latency',
    sortIterator: null,
  },
  connectedSince: {
    id: 'connectedSince',
    label: 'Uptime',
    sortIterator: null,
  },
  address: {
    id: 'address',
    label: 'Client address',
    sortIterator: null,
  },
}

export const ConsumerFields = {
  health: {
    id: 'health',
    label: '',
    sortIterator: null,
  },
  consumerName: {
    id: 'consumerName',
    label: 'Name',
    sortIterator: null,
  },
  msgRateOut: {
    id: 'msgRateOut',
    label: 'Rate',
    sortIterator: null,
  },
  msgThroughputOut: {
    id: 'msgThroughputOut',
    label: 'Byte rate',
    sortIterator: null,
  },
  msgRateExpired: {
    id: 'msgRateExpired',
    label: 'Expired rate',
    sortIterator: null,
  },
  msgRateRedeliver: {
    id: 'msgRateRedeliver',
    label: 'Redelivery rate',
    sortIterator: null,
  },
  unackedMessages: {
    id: 'unackedMessages',
    label: 'Unacknowledged messages',
    sortIterator: null,
  },
  msgBacklog: {
    id: 'msgBacklog',
    label: 'Backlog',
    sortIterator: null,
  },
  connectedSince: {
    id: 'connectedSince',
    label: 'Uptime',
    sortIterator: null,
  },
  address: {
    id: 'address',
    label: 'Client address',
    sortIterator: null,
  },
}

const pager = pagerFactory<Topic>()
const sortIterators = mapValues(TopicFields, p => p.sortIterator)

export const makeTopicPager = () => pager(sortIterators)

// Utility functions
export const topicPipelines = (topic: Topic) => ({
  inputs: topic.producers.filter(isPipelineType),
  outputs: flatMap(Object.values(topic.subscriptions), (s: Subscription) =>
    s.consumers.filter(isPipelineType)
  ),
})

const isPipelineType = (p: IdIfTypePipeline) => p.type === TopicIOType.PIPELINE
