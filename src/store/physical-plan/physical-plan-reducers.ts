import compact from 'lodash-es/compact'
import groupBy from 'lodash-es/groupBy'
import map from 'lodash-es/map'
import { combineReducers } from 'redux'
import { createSelector, createStructuredSelector } from 'reselect'
import { SortOrder } from 'src/constants'
import { NestedId } from 'src/store/constants'
import {
  EntityLoadingState,
  makeEntityLoadingReducer,
  makeGetEntityError,
  makeGetEntityIsLoading,
} from 'src/store/internal/entity-loading'
import { EntityListState, makeEntityListReducer, makeGetEListEntity } from 'src/store/internal/list'
import { MetricsQueries, metricsQueryResultValByInstance } from 'src/store/metrics/metrics-model'
import { getQueryResultState } from 'src/store/metrics/metrics-reducer'
import { requestPhysicalPlan } from 'src/store/physical-plan/physical-plan-actions'
import {
  denormalizePhysicalPlan,
  Instance,
  NormalizedPhysicalPlan,
  PhysicalPlan,
  PhysicalPlanSubEntities,
} from 'src/store/physical-plan/physical-plan-model'
import {
  InstanceWithMetrics,
  PhysicalPlanContainer,
  PhysicalPlanFilter,
} from 'src/store/physical-plan/physical-plan-views'
import { State } from 'src/store/root-reducer'
import { ParametricSelector } from 'src/store/selectors'
import { EntitiesById } from 'src/store/util/normalize'
import { assertUnreachable } from 'src/util/misc'
import { FieldIterator, sortWithIterator } from 'src/util/pager'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

interface InstancesState {
  [pipelineId: string]: EntityListState<Instance>
}

const instanceByPlanReducer = makeEntityListReducer({
  getEntities: results => results.entities.instances,
})

const instancesReducer = reducerWithInitialState<InstancesState>({})
  .caseWithAction(requestPhysicalPlan.done, (state, action) => {
    // This won't work with many entities returned from a single action, but for physical plans
    // there are no list endpoints at this time
    const pipelineId = action.payload.result.result as string
    return { ...state, [pipelineId]: instanceByPlanReducer(state[pipelineId], action) }
  })
  .build()

export interface PhysicalPlansState {
  byId: EntityListState<NormalizedPhysicalPlan>
  loading: EntityLoadingState
  instances: InstancesState
}

export const physicalPlansReducer = combineReducers<PhysicalPlansState>({
  byId: makeEntityListReducer({
    getEntities: results => results.entities.physicalPlans,
  }),
  loading: makeEntityLoadingReducer(requestPhysicalPlan),
  instances: instancesReducer,
})

// export const

/// Selectors
const getById = (state: State) => state.physicalPlans.byId
const getLoading = (state: State) => state.physicalPlans.loading
const getInstances = (state: State) => state.physicalPlans.instances

export const getPPlanInstances = (state: State, { id }: NestedId): EntitiesById<Instance> =>
  getInstances(state)[id] || null

// Creates a selector that gets a physical plan by id
export const makeGetPPlan = () =>
  makeGetEListEntity(
    getById,
    createStructuredSelector<State, NestedId, PhysicalPlanSubEntities>({
      instances: getPPlanInstances,
    }),
    denormalizePhysicalPlan
  )

// Gets whether a physical plan is loading
export const getPPlanIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a physical plan
export const getPPlanLoadingError = makeGetEntityError(getLoading)

export interface FilterParams {
  filterType?: PhysicalPlanFilter
  filterValue?: string
}

export const filterTypeFromProps = (_: {}, { filterType }: FilterParams) => filterType
export const filterValueFromProps = (_: {}, { filterValue }: FilterParams) => filterValue

const instanceRunsComponent = (instance: Instance, component: string) => instance.name === component

export const customGetPPlanInstancesFiltered = <Params>(
  getPhysicalPlan: ParametricSelector<Params, PhysicalPlan | null>
) =>
  createSelector<
    State,
    FilterParams & Params,
    PhysicalPlan | null,
    FilterParams['filterType'],
    FilterParams['filterValue'],
    Instance[] | null
  >(getPhysicalPlan, filterTypeFromProps, filterValueFromProps, (plan, filterType, filterValue) => {
    if (!plan) return null

    const instances = plan.instances

    if (!filterType || !filterValue) return plan.instances

    switch (filterType) {
      case PhysicalPlanFilter.COMPONENT:
        return instances.filter(i => instanceRunsComponent(i, filterValue))
      case PhysicalPlanFilter.CONTAINER:
        return instances.filter(i => i.containerId === filterValue)
      case PhysicalPlanFilter.INSTANCE:
        return instances.filter(i => i.id === filterValue)
      default:
        return assertUnreachable(filterType)
    }
  })

export const makeGetPPlanInstancesFiltered = () => customGetPPlanInstancesFiltered(makeGetPPlan())

export const customGetPPlanInstancesWithMetrics = <Params>(
  getInstancesSel: ParametricSelector<Params & NestedId, Instance[] | null>
) =>
  createSelector(
    getInstancesSel,
    (state, params) => getQueryResultState(state, MetricsQueries.EMIT_COUNT_BY_INSTANCE(params)),
    (state, params) =>
      getQueryResultState(state, MetricsQueries.EXECUTE_LATENCY_BY_INSTANCE(params)),
    (state, params) => getQueryResultState(state, MetricsQueries.ACK_COUNT_BY_INSTANCE(params)),
    (state, params) => getQueryResultState(state, MetricsQueries.UPTIME_BY_INSTANCE(params)),
    (instances, emitCount, latency, ackCount, uptime): InstanceWithMetrics[] | null => {
      if (!instances) return instances

      return instances.map(instance => ({
        ...instance,
        emitCount: {
          ...emitCount,
          result: emitCount.result && metricsQueryResultValByInstance(emitCount.result, instance),
        },
        latency: {
          ...latency,
          result: latency.result && metricsQueryResultValByInstance(latency.result, instance),
        },
        ackCount: {
          ...ackCount,
          result: ackCount.result && metricsQueryResultValByInstance(ackCount.result, instance),
        },
        uptime: {
          ...uptime,
          result: uptime.result && metricsQueryResultValByInstance(uptime.result, instance),
        },
      }))
    }
  )

export const customGetPPlanContainers = <Props>(
  GetPPlan: ParametricSelector<Props, PhysicalPlan | null>
) =>
  createSelector(GetPPlan, plan => {
    if (!plan) return null

    const instancesByContainer = groupBy(plan.instances, i => i.containerId)

    return map(plan.instance_groups, ({ health, instances }, id) => {
      return {
        id,
        health,
        instances: instancesByContainer[id],
      }
    })
  })

export const makeGetPPlanContainers = () => customGetPPlanContainers(makeGetPPlan())

interface ContainersSortParams {
  iterator: FieldIterator<PhysicalPlanContainer>
  order: SortOrder
}

export const customGetPPlanContainersSorted = <Props>(
  getContainers: ParametricSelector<Props, PhysicalPlanContainer[] | null>
) =>
  createSelector<
    State,
    ContainersSortParams & Props,
    PhysicalPlanContainer[] | null,
    ContainersSortParams['iterator'],
    ContainersSortParams['order'],
    PhysicalPlanContainer[] | null
  >(
    getContainers,
    (_, { iterator }) => iterator,
    (_, { order }) => order,
    (containers, iterator, order) => {
      return sortWithIterator(containers, iterator, order)
    }
  )

export const makeGetPPlanContainersSorted = () =>
  customGetPPlanContainersSorted(makeGetPPlanContainers())

export const customGetPPlanContainersFiltered = <Props>(
  getContainers: ParametricSelector<Props, PhysicalPlanContainer[] | null>
) =>
  createSelector<
    State,
    FilterParams & Props,
    PhysicalPlanContainer[] | null,
    FilterParams['filterType'],
    FilterParams['filterValue'],
    PhysicalPlanContainer[] | null
  >(
    getContainers,
    filterTypeFromProps,
    filterValueFromProps,
    (containers, filterType, filterValue) => {
      if (!filterType || !filterValue) return containers
      if (!containers) return null

      switch (filterType) {
        case PhysicalPlanFilter.COMPONENT:
          return containers.filter(c =>
            c.instances.some(i => instanceRunsComponent(i, filterValue))
          )
        case PhysicalPlanFilter.CONTAINER:
          return compact([containers.find(c => c.id === filterValue)])
        case PhysicalPlanFilter.INSTANCE:
          return compact([containers.find(c => c.instances.some(i => i.id === filterValue))])
        default:
          return assertUnreachable(filterType)
      }
    }
  )

export const makeGetPPlanContainersFiltered = () =>
  customGetPPlanContainersFiltered(makeGetPPlanContainers())
