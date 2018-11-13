import * as React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { RangeGraph } from 'src/components/Graph/GraphData'
import {
  Metric,
  MetricsActions,
  NamespaceGraphProps,
  NamespaceMetricsConnect,
} from 'src/components/Graph/internal/types'
import {
  getNamespaceId,
  getStepBaseOnTimeRange,
} from 'src/components/Graph/internal/utils'
import metrics from 'src/components/Graph/metrics'
// import metrics, { namespaceMetrics } from 'src/components/Graph/metrics'
import makeMultipleGraphsLayout, { GraphToRender } from 'src/components/Graph/MultiplesGraphsLayout'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import {
  MetricLabel,
  NamespaceMetricsGroup,
  RangeQueryMetricGroup,
  TimeRange,
} from 'src/store/metrics/metrics-model'
import * as namespaceActions from 'src/store/namespace/namespace-actions'
import { Namespace } from 'src/store/namespace/namespace-model'
import { makeGetNamespacesByGroup } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'

type NamespaceActions = typeof namespaceActions

interface GroupMetricsOwnProps extends NestedId, GraphFiltersInjectedProps {}

interface GroupMetricsProps extends GroupMetricsOwnProps, MetricsActions, NamespaceActions {
  cluster?: string
  namespaces: Namespace[]
}

const MultipleGraphsLayout = makeMultipleGraphsLayout<
  NamespaceGraphProps,
  NamespaceMetricsConnect
>()

export class GroupMetrics extends React.Component<GroupMetricsProps> {
  pipelinesMetrics: Metric[] = [metrics.CPU_USED, metrics.RAM_USED]
  encodeNamespaceNames = makeEncodeNamespaceValue()
  encodeNamespaceIds = makeEncodeNamespaceValue()

  graphsToRender: GraphToRender[] = [
    {
      title: null,
      metricsToRender: [
        { metric: metrics.RATE_IN, className: 'graph-line-metric-rate-in' },
        { metric: metrics.RATE_OUT, className: 'graph-line-metric-rate-out' },
        { metric: metrics.THROUGHPUT_IN },
        { metric: metrics.THROUGHPUT_OUT },
      ],
    },
  ]

  static byId = (s: string, namespace: Namespace, i: number) => {
    if (i !== 0) return `${s}${getNamespaceId(namespace)}|`

    return `${s}${getNamespaceId(namespace)}`
  }

  static byName = (s: string, { name }: Namespace, i: number) => {
    if (i !== 0) return `${s}${name}|`

    return `${s}${name}`
  }

  componentDidMount() {
    this.props.triggerRequestNamespaceList()
  }

  componentWillReceiveProps(nextProps: GroupMetricsProps) {
    if (nextProps.id !== this.props.id) {
      this.props.triggerRequestNamespaceList()
    }

    if (
      nextProps.timeRange !== this.props.timeRange ||
      nextProps.namespaces.length !== this.props.namespaces.length ||
      nextProps.cluster !== this.props.cluster ||
      nextProps.id !== this.props.id
    ) {
      this.requestMetrics(nextProps.namespaces, nextProps.timeRange, nextProps.cluster)
    }
  }

  requestMetrics = (namespaces: Namespace[], timeRange: TimeRange, cluster?: string) => {
    const labels = cluster ? [[NamespaceMetricsGroup.CLUSTER, cluster] as MetricLabel] : []
    const query = {
      step: getStepBaseOnTimeRange(timeRange),
      id: '',
      timeRange,
    }

    if (!namespaces.length) return

    this.graphsToRender.forEach(graph =>
      graph.metricsToRender.forEach(({ metric }) => {
        const isPipelineMetric = this.pipelinesMetrics.includes(metric)

        isPipelineMetric
          ? this.props.triggerRangeQueryMetrics({
              ...query,
              fn: metric.fn,
              groupValue: this.encodeNamespaceNames(namespaces, false),
              groupType: RangeQueryMetricGroup.PIPELINE_NAMESPACE,
              metric: metric.name,
              transform: metric.transform,
            })
          : this.props.triggerRangeQueryMetrics({
              ...query,
              fn: metric.fn,
              metric: metric.name,
              groupType: RangeQueryMetricGroup.NAMESPACE,
              groupValue: this.encodeNamespaceIds(namespaces, true),
              transform: metric.transform,
              labels,
            })
      })
    )
  }

  render() {
    const { namespaces } = this.props
    const labels = this.props.cluster
      ? [[NamespaceMetricsGroup.CLUSTER, this.props.cluster] as MetricLabel]
      : []

    return namespaces.length ? (
      <MultipleGraphsLayout
        graphsToRender={this.graphsToRender}
        id={this.props.id}
        onTimeRangeChange={this.props.setTimeRange}
        timeRange={this.props.timeRange}
      >
        {layoutProps => {
          return this.pipelinesMetrics.includes(layoutProps.metric) ? (
            <RangeGraph
              {...layoutProps}
              showLoadingIndicator={false}
              groupValue={this.encodeNamespaceNames(namespaces, false)}
              groupType={RangeQueryMetricGroup.PIPELINE_NAMESPACE}
            />
          ) : (
            <RangeGraph
              {...layoutProps}
              showLoadingIndicator={false}
              groupType={RangeQueryMetricGroup.NAMESPACE}
              groupValue={this.encodeNamespaceIds(namespaces, true)}
              metric={{ ...layoutProps.metric, labels }}
            />
          )
        }}
      </MultipleGraphsLayout>
    ) : null
  }
}

export const makeEncodeNamespaceValue = () =>
  createSelector(
    (namespaces: Namespace[]) => namespaces,
    (_: Namespace[], encodeById: boolean) => (encodeById ? GroupMetrics.byId : GroupMetrics.byName),
    (namespaces, encodeBy) => {
      if (!namespaces) return ''

      return namespaces.reduceRight(encodeBy, '')
    }
  )

export default withGraphFilters(() => 'metrics')(
  connect(
    () => {
      const filterNamespaces = makeGetNamespacesByGroup()

      return (state: State, { id }: GroupMetricsOwnProps) => ({
        namespaces: filterNamespaces(state, { groupId: id }),
      })
    },
    { ...metricsActions, ...namespaceActions }
  )(GroupMetrics)
)
