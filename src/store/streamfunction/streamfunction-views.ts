import mapValues from 'lodash-es/mapValues'
import { StreamFunction } from 'src/store/streamfunction/streamfunction-model'
import { pagerFactory } from 'src/util/pager'

export const StreamFunctionFields = {
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (sf: StreamFunction) => sf.name,
  },
  latency: {
    id: 'latency',
    label: 'Latency',
    sortIterator: null
  },
  executeCount: {
    id: 'executeCount',
    label: 'Execute count',
    sortIterator: null // (sf: StreamFunction) => sf.executeCount
  },
  createdOn: {
    id: 'createdOn',
    label: 'Created on',
    sortIterator: null // (sf: StreamFunction) => sf.createdOn,
  },
  createdBy: {
    id: 'createdBy',
    label: 'Created by',
    sortIterator: null
  }
}
const pager = pagerFactory<StreamFunction>()
const sortIterators = mapValues(StreamFunctionFields, sf => sf.sortIterator)

export const makeStreamFunctionPager = () => pager(sortIterators)
