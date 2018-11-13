import mapValues from 'lodash-es/mapValues'
import { Node } from 'src/store/node/node-model'
import { pagerFactory } from 'src/util/pager'

export const NodeFields = {
  health: {
    id: 'health',
    label: '',
    sortIterator: null,
  },
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (n: Node) => n.name,
  },
  tags: {
    id: 'tags',
    label: 'Tags',
    sortIterator: null,
  },
  containers: {
    id: 'containers',
    label: 'Containers',
    sortIterator: (n: Node) => n.containers.length,
  },
  storageDevices: {
    id: 'storageDevices',
    label: 'Storage devices',
    sortIterator: (n: Node) => n.storageDevices,
  },
  resources: {
    id: 'resources',
    label: 'Resource usage',
    sortIterator: null,
  },
  address: {
    id: 'address',
    label: 'IP address',
    sortIterator: (n: Node) => n.address,
  },
}
const pager = pagerFactory<Node>()
const sortIterators = mapValues(NodeFields, n => n.sortIterator)

export const makeNodesPager = () => pager(sortIterators)
