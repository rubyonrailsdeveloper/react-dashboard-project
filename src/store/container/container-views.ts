import mapValues from 'lodash-es/mapValues'
import { Container, Process } from 'src/store/container/container-model'
import { pagerFactory } from 'src/util/pager'

export const ContainerFields = {
  health: {
    id: 'health',
    label: '',
    sortIterator: null,
  },
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (container: Container) => container.name,
  },
  processes: {
    id: 'processes',
    label: 'Processes',
    sortIterator: (container: Container) =>
      (container.processes && container.processes.length) || -1,
  },
  tags: {
    id: 'tags',
    label: 'Type',
    sortIterator: null,
  },
  resources: {
    id: 'resources',
    label: 'Resource usage',
    sortIterator: null,
  },
  mountedVolumes: {
    id: 'mountedVolumes',
    label: 'Mounted Volumes',
    sortIterator: null,
  },
}

export const ProcessFields = {
  health: {
    id: 'health',
    label: '',
    sortIterator: null,
  },
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (process: Process) => process.name || process.id,
  },
  id: {
    id: 'id',
    label: 'Process ID',
    sortIterator: (process: Process) => process.id,
  },
  resources: {
    id: 'resources',
    label: 'Resource usage',
    sortIterator: null,
  },
}

const pager = pagerFactory<Container>()
const processPager = pagerFactory<Process>()
const sortIterators = mapValues(ContainerFields, container => container.sortIterator)
const processSortIterators = mapValues(ProcessFields, process => process.sortIterator)

export const makeContainersPager = () => pager(sortIterators)
export const makeProcessesPager = () => processPager(processSortIterators)
