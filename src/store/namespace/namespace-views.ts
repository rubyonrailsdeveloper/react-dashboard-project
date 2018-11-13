import mapValues from 'lodash-es/mapValues'
import { healthSortWeight } from 'src/store/constants'
import { Namespace } from 'src/store/namespace/namespace-model'
import { pagerFactory } from 'src/util/pager'

export const NamespaceFields = {
  health: {
    id: 'health',
    label: 'Health',
    sortIterator: (n: Namespace) => healthSortWeight(n.health),
  },
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (n: Namespace) => n.name,
  },
  clusters: {
    id: 'clusters',
    label: 'Clusters',
    sortIterator: null,
  },
  pipelines: {
    id: 'pipelines',
    label: 'Pipelines',
    sortIterator: (n: Namespace) => n.pipelines.length,
  },
  topics: {
    id: 'topics',
    label: 'Topics',
    sortIterator: (n: Namespace) => n.topics.length,
  },
  resources: {
    id: 'resources',
    label: 'Resource usage',
    sortIterator: null,
  },
  msgBacklog: {
    id: 'backlog',
    label: 'Backlog',
    sortIterator: (n: Namespace) => n.msgBacklog,
  },
  rates: {
    id: 'rates',
    label: 'Rates',
    sortIterator: null,
  },
  throughput: {
    id: 'throughput',
    label: 'Byte rate',
    sortIterator: null,
  },
}

const pager = pagerFactory<Namespace>()
const sortIterators = mapValues(NamespaceFields, p => p.sortIterator)
export const makeNamespacesPager = () => pager(sortIterators)
