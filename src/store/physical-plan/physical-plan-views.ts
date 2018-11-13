import mapValues from 'lodash-es/mapValues'
import { Health, healthSortWeight } from 'src/store/constants'
import { ComponentType, Instance } from 'src/store/physical-plan/physical-plan-model'
import { pagerFactory } from 'src/util/pager'

export interface PhysicalPlanContainer {
  id: string
  health: Health
  instances: Instance[]
}
export interface PhysicalPlanComponent {
  id: string
  health: Health
  instances: Instance[]
  type: ComponentType
}

export interface InstanceWithMetrics extends Instance {
  emitCount: InstanceMetric<number>
  latency: InstanceMetric<number>
  ackCount: InstanceMetric<number>
  uptime: InstanceMetric<number>
}

interface InstanceMetric<T> {
  result: T | null
  isLoading: boolean
  error: object | null
}

export const InstanceWithMetricsFields = {
  health: {
    id: 'health',
    label: '',
    sortIterator: null,
  },
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (i: InstanceWithMetrics) => i.id,
  },
  emissions: {
    id: 'emissions',
    label: 'Emit count',
    sortIterator: (i: InstanceWithMetrics) => i.emitCount.result || -1,
  },
  latency: {
    id: 'latency',
    label: 'Latency',
    sortIterator: (i: InstanceWithMetrics) => i.latency.result || -1,
  },
  ackCount: {
    id: 'ackCount',
    label: 'Ack Count',
    sortIterator: (i: InstanceWithMetrics) => i.ackCount.result || -1,
  },
  uptime: {
    id: 'uptime',
    label: 'Uptime',
    sortIterator: (i: InstanceWithMetrics) => i.uptime.result || -1,
  },
  logfile: {
    id: 'logfile',
    label: 'Log File',
    sortIterator: null,
  },
}
const pager = pagerFactory<InstanceWithMetrics>()
const sortIterators = mapValues(InstanceWithMetricsFields, p => p.sortIterator)
export const makeInstancesPager = () => pager(sortIterators)

export const PhysicalPlanContainerFields = {
  health: {
    id: 'health',
    label: 'Health',
    sortIterator: (c: PhysicalPlanContainer) =>
      c.instances.reduce((acc, instance) => acc + healthSortWeight(instance.health), 0),
  },
}

export enum PhysicalPlanFilter {
  COMPONENT = 'component',
  CONTAINER = 'container',
  INSTANCE = 'instance',
}
