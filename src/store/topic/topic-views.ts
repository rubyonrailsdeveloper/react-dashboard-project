import flatMap from 'lodash-es/flatMap'
import mapValues from 'lodash-es/mapValues'
import sumBy from 'lodash-es/sumBy'
import { healthSortWeight } from 'src/store/constants'
import { IdIfTypePipeline, Subscription, Topic, TopicIOType } from 'src/store/topic/topic-model'
import { pagerFactory } from 'src/util/pager'

export const TopicFields = {
  health: {
    id: 'health',
    label: 'Health',
    sortIterator: (t: Topic) => healthSortWeight(t.health),
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
    sortIterator: (t: Topic) => t.storageSize / t.storageUsed,
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

const isPipelineType = (p: IdIfTypePipeline) => p.type === TopicIOType.PIPELINE

export const topicPipelines = (topic: Topic) => ({
  inputs: topic.producers.filter(isPipelineType),
  outputs: flatMap(Object.values(topic.subscriptions), (s: Subscription) =>
    s.consumers.filter(isPipelineType)
  ),
})
