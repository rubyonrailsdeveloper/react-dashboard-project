import mapValues from 'lodash-es/mapValues'
import { healthSortWeight } from 'src/store/constants'
import { Group } from 'src/store/group/group-model'
import { pagerFactory } from 'src/util/pager'

export const GroupFields = {
  health: {
    id: 'health',
    label: 'Health',
    sortIterator: (g: Group) => healthSortWeight(g.health),
  },
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (g: Group) => g.name,
  },
  clusters: {
    id: 'clusters',
    label: 'Clusters',
    sortIterator: null,
  },
  pipelines: {
    id: 'pipelines',
    label: 'Pipelines',
    sortIterator: (g: Group) => g.pipelines.length,
  },
  topics: {
    id: 'topics',
    label: 'Topics',
    sortIterator: (g: Group) => g.topics.length,
  },
  namespaces: {
    id: 'namespaces',
    label: 'Namespaces',
    sortIterator: (g: Group) => g.namespaces.length,
  },
  resources: {
    id: 'resources',
    label: 'Resource usage',
    sortIterator: null,
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
const pager = pagerFactory<Group>()
const sortIterators = mapValues(GroupFields, g => g.sortIterator)

export const makeGroupPager = () => pager(sortIterators)
