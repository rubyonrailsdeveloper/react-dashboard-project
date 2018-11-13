import mapValues from 'lodash-es/mapValues'
import { Cluster } from 'src/store/cluster/cluster-model'
import { pagerFactory } from 'src/util/pager'

export const ClusterFields = {
  health: {
    id: 'health',
    label: '',
    sortIterator: null,
  },
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (c: Cluster) => c.name,
  },
  nodesStatus: {
    id: 'nodes',
    label: 'Nodes',
    sortIterator: (c: Cluster) => c.nodesStatus.total,
  },
  containerStatus: {
    id: 'containers',
    label: 'Containers',
    sortIterator: (c: Cluster) => c.containerStatus.total,
  },
  resources: {
    id: 'resources',
    label: 'Resource usage',
    sortIterator: null,
  },
  localMsgBacklog: {
    id: 'backlog',
    label: 'Local backlog',
    sortIterator: (c: Cluster) => c.localMsgBacklog,
  },
  remoteMsgBacklog: {
    id: 'backlog',
    label: 'Replication backlog',
    sortIterator: (c: Cluster) => c.remoteMsgBacklog,
  },
  localRates: {
    id: 'rates',
    label: 'Local rate',
    sortIterator: null,
  },
  remoteRates: {
    id: 'throughput',
    label: 'Replication rate',
    sortIterator: null,
  },
}
const pager = pagerFactory<Cluster>()
const sortIterators = mapValues(ClusterFields, g => g.sortIterator)

export const makeClusterPager = () => pager(sortIterators)
