import mapValues from 'lodash-es/mapValues'
import { healthSortWeight } from 'src/store/constants'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'
import { Pipeline } from 'src/store/pipeline/pipeline-model'
import { assertUnreachable } from 'src/util/misc'
import { pagerFactory } from 'src/util/pager'

export interface PipelineWithResources extends Pipeline {
  resourceUsage: {
    [metric: string]: { used: number | null; limit: number } | null
  }
}

export const PipelineFields = {
  health: {
    id: 'health',
    label: 'Health',
    sortIterator: (p: Pipeline) => healthSortWeight(p.health),
  },
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (p: Pipeline) => p.name,
  },
  author: {
    id: 'submissionUser',
    label: 'Author',
    sortIterator: (p: Pipeline) => p.submissionUser,
  },
  topics: {
    id: 'topics',
    label: 'Topic',
    sortIterator: (p: Pipeline) => p.sources.length + p.sinks.length,
  },
  cluster: {
    id: 'cluster',
    label: 'Cluster',
    sortIterator: (p: Pipeline) => p.clusters[0],
  },
  usage: {
    id: 'usage',
    label: 'Resource usage',
    sortIterator: null,
  },
  launched: {
    id: 'submissionTime',
    label: 'Launched',
    sortIterator: (p: Pipeline) => p.submissionTime,
  },
}

const pager = pagerFactory<Pipeline>()
const sortIterators = mapValues(PipelineFields, p => p.sortIterator)
export const makePipelinesPager = () => pager(sortIterators)

export const pipelineResourceLimitsByFilter = (pipeline: Pipeline, filter: PhysicalPlanFilter) => {
  switch (filter) {
    case null:
    case undefined:
    case PhysicalPlanFilter.COMPONENT:
      return pipeline.resources.limits
    case PhysicalPlanFilter.CONTAINER:
    case PhysicalPlanFilter.INSTANCE:
      return pipeline.resources.containerLimits
    default:
      return assertUnreachable(filter)
  }
}
