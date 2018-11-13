import compact from 'lodash-es/compact'
import groupBy from 'lodash-es/groupBy'
import intersection from 'lodash-es/intersection'
import map from 'lodash-es/map'
import { combineReducers } from 'redux'
import { createSelector, createStructuredSelector } from 'reselect'
import {
  EntityLoadingState,
  makeEntityLoadingReducer,
  makeGetEntityError,
  makeGetEntityIsLoading,
} from 'src/store/internal/entity-loading'
import {
  makeGetQList,
  makeGetQListEntity,
  makeGetQListIsLoading,
  makeQueryableListReducer,
  QueryableListState,
} from 'src/store/internal/list'
import {
  makeGetOperationState,
  makeOperationsByIdReducer,
  OperationsByIdState,
} from 'src/store/internal/operation'
import {
  MetricName,
  MetricsQueries,
  metricsQueryResultValByPipeline,
} from 'src/store/metrics/metrics-model'
import { getQueryResult } from 'src/store/metrics/metrics-reducer'
import { ComponentType, PhysicalPlan } from 'src/store/physical-plan/physical-plan-model'
import {
  FilterParams,
  filterTypeFromProps,
  filterValueFromProps,
} from 'src/store/physical-plan/physical-plan-reducers'
import {
  PhysicalPlanComponent,
  PhysicalPlanFilter,
} from 'src/store/physical-plan/physical-plan-views'
import {
  activatePipeline,
  ActivatePipelinePayload,
  deactivatePipeline,
  DeactivatePipelinePayload,
  deletePipeline,
  DeletePipelinePayload,
  requestPipeline,
  requestPipelineList,
} from 'src/store/pipeline/pipeline-actions'
import {
  denormalizePipeline,
  NormalizedPipeline,
  Pipeline,
  PipelineIOType,
  SourceSink,
} from 'src/store/pipeline/pipeline-model'
import { PipelineWithResources } from 'src/store/pipeline/pipeline-views'
import { State } from 'src/store/root-reducer'
import { ParametricSelector } from 'src/store/selectors'
import { assertUnreachable } from 'src/util/misc'

export interface PipelinesState {
  list: QueryableListState<NormalizedPipeline>
  loading: EntityLoadingState
  deactivate: OperationsByIdState<DeactivatePipelinePayload>
  activate: OperationsByIdState<ActivatePipelinePayload>
  delete: OperationsByIdState<DeletePipelinePayload>
}

export const pipelinesReducer = combineReducers({
  list: makeQueryableListReducer({
    actions: requestPipelineList,
    getEntities: results => results.entities.pipelines,
  }),
  loading: makeEntityLoadingReducer(requestPipeline),
  deactivate: makeOperationsByIdReducer({ actions: deactivatePipeline }),
  activate: makeOperationsByIdReducer({ actions: activatePipeline }),
  delete: makeOperationsByIdReducer({ actions: deletePipeline }),
})

/// Selectors
const getList = (state: State) => state.pipelines.list
const getLoading = (state: State) => state.pipelines.loading

const getPipelineSubEntities = createStructuredSelector({})

// Gets the list of all pipelines
export const getPipelineList = makeGetQList(getList, getPipelineSubEntities, denormalizePipeline)

// Gets whether the list of all pipelines is loading
export const getPipelineListIsLoading = makeGetQListIsLoading(getList)

// Gets the list of all pipelines in a given namespace id
export const makeGetPipelinesByNamespace = () =>
  createSelector(
    getPipelineList,
    (_: State, { namespaceId }: { namespaceId: string }) => namespaceId,
    (pipelines, namespaceId) => pipelines.filter(pipeline => pipeline.namespaceId === namespaceId)
  )

export const getPipelineWithResourcesList = createSelector(
  getPipelineList,
  state => getQueryResult(state, MetricsQueries.CPU_USED_BY_TOPOLOGY()),
  state => getQueryResult(state, MetricsQueries.RAM_USED_BY_TOPOLOGY()),
  (list, cpuUsage, ramUsage): PipelineWithResources[] => {
    if (!list) return list

    return list.map(pipeline => {
      const { cpu, memory } = pipeline.resources.limits
      const usedRam = ramUsage && metricsQueryResultValByPipeline(ramUsage, pipeline)

      return {
        ...pipeline,
        resourceUsage: {
          [MetricName.CPU_USED]: {
            used: cpuUsage && metricsQueryResultValByPipeline(cpuUsage, pipeline),
            limit: cpu,
          },
          [MetricName.RAM_USED]: {
            // Used ram comes in MB, while limit is on bytes, normalize to same unit
            used: usedRam && usedRam * 1024 * 1024,
            limit: memory,
          },
        },
      }
    })
  }
)

// Creates a selector that gets a pipeline by id
export const makeGetPipeline = () =>
  makeGetQListEntity(getList, getPipelineSubEntities, denormalizePipeline)

// Gets whether a pipeline is loading
export const getPipelineIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a pipeline
export const getPipelineLoadingError = makeGetEntityError(getLoading)

// Gets all instances grouped by component and appends component data to it
export const customGetPipelineComponents = <Props>(
  getPPlan: ParametricSelector<Props, PhysicalPlan | null>,
  getPipeline: ParametricSelector<Props, Pipeline | null>
) =>
  createSelector<
    State,
    Props,
    PhysicalPlan | null,
    Pipeline | null,
    PhysicalPlanComponent[] | null
  >(getPPlan, getPipeline, (plan, pipeline) => {
    if (!plan || !pipeline) return null

    const { logicalPlan } = pipeline
    return map(groupBy(plan.instances, instance => instance.name), (instances, id) => {
      const component = logicalPlan.spouts[id]
        ? { type: ComponentType.SPOUT, ...logicalPlan.spouts[id] }
        : logicalPlan.bolts[id] ? { type: ComponentType.BOLT, ...logicalPlan.bolts[id] } : null

      if (!component) throw new Error('Inconsistent API data')

      return {
        id,
        ...component,
        instances,
      }
    })
  })

// Creates a selector that gets the pipelines components with the physical plan information
export const customGetPipelineComponentsFiltered = <Props>(
  getComponents: ParametricSelector<Props, PhysicalPlanComponent[] | null>
) =>
  createSelector<
    State,
    FilterParams & Props,
    PhysicalPlanComponent[] | null,
    FilterParams['filterType'],
    FilterParams['filterValue'],
    PhysicalPlanComponent[] | null
  >(
    getComponents,
    filterTypeFromProps,
    filterValueFromProps,
    (components, filterType, filterValue) => {
      if (!filterType || !filterValue) return components
      if (!components) return null

      switch (filterType) {
        case PhysicalPlanFilter.COMPONENT:
          return compact([components.find(c => c.id === filterValue)])
        case PhysicalPlanFilter.CONTAINER:
          return components.filter(c => c.instances.some(i => i.containerId === filterValue))
        case PhysicalPlanFilter.INSTANCE:
          return compact([components.find(c => c.instances.some(i => i.id === filterValue))])
        default:
          return assertUnreachable(filterType)
      }
    }
  )

export const customGetPipelineInputTopics = <Props>(
  getPipeline: ParametricSelector<Props, Pipeline | null>,
  getFilteredComponents: ParametricSelector<Props, PhysicalPlanComponent[] | null>
) =>
  createSelector<
    State,
    Props,
    Pipeline | null,
    PhysicalPlanComponent[] | null,
    SourceSink[] | null
  >(getPipeline, getFilteredComponents, (pipeline, components) => {
    if (!pipeline) return null
    if (!components) return pipeline.sources
    const componentsName = components.map(c => c.id)
    return pipeline.sources.filter(
      s => s.type === PipelineIOType.TOPIC && intersection(s.outputs, componentsName).length
    )
  })

export const customGetPipelineOutputTopics = <Props>(
  getPipeline: ParametricSelector<Props, Pipeline | null>,
  getFilteredComponents: ParametricSelector<Props, PhysicalPlanComponent[] | null>
) =>
  createSelector<
    State,
    Props,
    Pipeline | null,
    PhysicalPlanComponent[] | null,
    SourceSink[] | null
  >(getPipeline, getFilteredComponents, (pipeline, components) => {
    if (!pipeline) return null
    if (!components) return pipeline.sinks
    const componentsName = components.map(c => c.id)
    return pipeline.sinks.filter(
      s => s.type === PipelineIOType.TOPIC && intersection(s.inputs, componentsName).length
    )
  })

// Operations
export const getPipelineDeleteState = makeGetOperationState({
  operationsState: s => s.pipelines.delete,
})

export const getPipelineDeactivateState = makeGetOperationState({
  operationsState: s => s.pipelines.deactivate,
})

export const getPipelineActivateState = makeGetOperationState({
  operationsState: s => s.pipelines.activate,
})
