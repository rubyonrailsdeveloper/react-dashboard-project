import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { RangeVector } from 'src/api/metrics'
import LineGraph, { LineGraphOwnProps } from 'src/components/Graph/internal/LineGraph'
import {
  CustomDataSet,
  GraphDataProps,
  NamespaceGraphProps,
  OriginalStackDataSet,
  PipelineGraphProps,
  RangeGraphProps,
  StackDataSet,
  TopicGraphProps,
} from 'src/components/Graph/internal/types'
import { MetricMaxValue } from 'src/components/Graph/internal/types'
import {
  createDsWithClassByMetric,
  getStepBaseOnTimeRange,
  sliceDataSet,
  sliceStackDataSet,
} from 'src/components/Graph/internal/utils'
import { NestedId } from 'src/store/constants'
import {
  MetricsRangeQuery,
  physicalPlanFilterMetricsGroup,
  StackQueryMetricGroup,
} from 'src/store/metrics/metrics-model'
import {
  getNamespaceMetrics,
  getNamespaceMetricsIsLoading,
  getNamespaceMetricsLoadingError,
  getPipelineMetrics,
  getPipelineMetricsIsLoading,
  getPipelineMetricsLoadingError,
  getRangeMetrics,
  getRangeMetricsIsLoading,
  getRangeMetricsLoadingError,
  getStackQueryMetrics,
  getTopicMetrics,
  getTopicMetricsIsLoading,
  getTopicMetricsLoadingError,
} from 'src/store/metrics/metrics-reducer'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'
import { State } from 'src/store/root-reducer'
import { ParametricSelector } from 'src/store/selectors'

interface QueryProps<GroupType> extends GraphDataProps, NestedId, LineGraphOwnProps {
  groupType?: GroupType
  groupValue?: string
}

interface GraphSelectorProps {
  label: string
  maxValue?: number
}

interface MakeTriggerRequestPipelineMetrics extends GraphDataProps, NestedId {
  filterValue: string
  filterType: PhysicalPlanFilter
}

export const getPipelineMetricsQuery = (
  params: MakeTriggerRequestPipelineMetrics,
  forceReload?: boolean
) => {
  const { filterValue, filterType, id, metric: { fn, labels, name, transform }, timeRange } = params
  const query = {
    groupType: physicalPlanFilterMetricsGroup(filterType),
    groupValue: filterValue,
    metric: name,
    step: getStepBaseOnTimeRange(timeRange),
    forceReload,
    fn,
    id,
    labels,
    timeRange,
    transform,
  }

  return query
}

const getMetrics = <Props extends {}>(
  getMetricsData: ParametricSelector<Props & GraphSelectorProps, RangeVector | null>
) =>
  createSelector<
    State,
    Props & GraphSelectorProps,
    RangeVector | null,
    MetricMaxValue | undefined,
    string,
    CustomDataSet[]
  >(
    (state, props) => getMetricsData(state, props),
    (_, { maxValue }) => maxValue,
    (_, { label }) => label,
    (value, maxValue, label) => {
      // TODO: [ofer: 19-Mar-18]: We don't have access to a metric type so we hack by looking at label.
      if (label.toUpperCase() === 'CPU' || label.toUpperCase() === 'MEMORY' || label.toUpperCase() === 'STORAGE SIZE') {
        return sliceDataSet(value, label, maxValue)
      }
      return createDsWithClassByMetric(value, label)
    }
  )

export const getStackMetrics = <Props extends MetricsRangeQuery<StackQueryMetricGroup>>() =>
  createSelector<State, Props, OriginalStackDataSet[] | null, string, StackDataSet[]>(
    (state, props) => getStackQueryMetrics(state, props) as any,
    (_, { id }) => id,
    (value, id) => sliceStackDataSet(value, id)
  )

const getQuery = <GroupType extends {}>({
  id,
  maxValue,
  metric,
  timeRange,
  groupValue,
  groupType,
}: QueryProps<GroupType>) => ({
  fn: metric.fn,
  label: metric.label,
  metric: metric.name,
  step: getStepBaseOnTimeRange(timeRange),
  maxValue: maxValue || metric.maxValue,
  labels: metric.labels,
  groupValue,
  groupType,
  id,
  timeRange,
})

export const PipelineGraph = connect(() => {
  const selector = getMetrics(getPipelineMetrics)

  return (state: State, props: PipelineGraphProps) => {
    const query = getQuery(props)
    return {
      dataSets: selector(state, query),
      error: getPipelineMetricsLoadingError(state, query),
      isLoading: getPipelineMetricsIsLoading(state, query),
    }
  }
})(LineGraph)

export const NamespaceGraph = connect(() => {
  const selector = getMetrics(getNamespaceMetrics)

  return (state: State, props: NamespaceGraphProps) => {
    const query = getQuery(props)
    return {
      dataSets: selector(state, query),
      error: getNamespaceMetricsLoadingError(state, query),
      isLoading: getNamespaceMetricsIsLoading(state, query),
    }
  }
})(LineGraph)

export const TopicGraph = connect(() => {
  const selector = getMetrics(getTopicMetrics)

  return (state: State, props: TopicGraphProps) => {
    const query = getQuery(props)
    return {
      dataSets: selector(state, query),
      error: getTopicMetricsLoadingError(state, query),
      isLoading: getTopicMetricsIsLoading(state, query),
    }
  }
})(LineGraph)

// Used to any graph that doesn't need an static value like namespace or pipeline
export const RangeGraph = connect(() => {
  const selector = getMetrics(getRangeMetrics)

  return (state: State, props: RangeGraphProps) => {
    const query = getQuery(props)

    return {
      dataSets: selector(state, query),
      error: getRangeMetricsLoadingError(state, query),
      isLoading: getRangeMetricsIsLoading(state, query),
    }
  }
})(LineGraph)
