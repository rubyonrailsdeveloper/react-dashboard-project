import * as React from 'react'
import { connect } from 'react-redux'
import { ClusterFiltersInjectedProps } from 'src/components/ClusterPanel/withClusterFilters'
import { NamespaceGraph, RangeGraph } from 'src/components/Graph/GraphData'
import {
  Metric,
  MetricsActions,
  NamespaceGraphProps,
  NamespaceMetricsConnect,
} from 'src/components/Graph/internal/types'
import { getStepBaseOnTimeRange } from 'src/components/Graph/internal/utils'
import metrics, { namespaceMetrics } from 'src/components/Graph/metrics'
import makeMultipleGraphsLayout, { GraphToRender } from 'src/components/Graph/MultiplesGraphsLayout'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import {
  NamespaceMetricsGroup,
  RangeQueryMetricGroup,
  TimeRange,
} from 'src/store/metrics/metrics-model'

interface NamespaceDashboardMetricsProps
  extends NestedId,
    GraphFiltersInjectedProps,
    ClusterFiltersInjectedProps,
    MetricsActions {}

const MultipleGraphsLayout = makeMultipleGraphsLayout<
  NamespaceGraphProps,
  NamespaceMetricsConnect
>()

class NamespaceDashboardMetrics extends React.Component<NamespaceDashboardMetricsProps> {
  customGraphs: Metric[] = [namespaceMetrics.CPU_USED, namespaceMetrics.RAM_USED]

  graphsToRender: GraphToRender[] = [
    {
      title: null,
      metricsToRender: [
        { metric: metrics.BACKLOG },
        { metric: metrics.RATE_IN },
        { metric: metrics.RATE_OUT },
        { metric: metrics.THROUGHPUT_IN },
        { metric: metrics.THROUGHPUT_OUT },
      ],
    },
  ]

  componentDidMount() {
    this.requestMetrics(this.props.id, this.props.timeRange, this.props.cluster)
  }

  componentWillReceiveProps(nextProps: NamespaceDashboardMetricsProps) {
    if (
      nextProps.timeRange !== this.props.timeRange ||
      nextProps.id !== this.props.id ||
      nextProps.cluster !== this.props.cluster
    ) {
      this.requestMetrics(nextProps.id, nextProps.timeRange, nextProps.cluster)
    }
  }

  requestMetrics = (id: string, timeRange: TimeRange, cluster?: string) => {
    const baseQuery = {
      step: getStepBaseOnTimeRange(timeRange),
      id,
      timeRange,
    }

    this.graphsToRender.forEach(graph =>
      graph.metricsToRender.forEach(
        ({ metric }) =>
          this.customGraphs.includes(metric)
            ? this.props.triggerRangeQueryMetrics({
                ...baseQuery,
                id: '',
                fn: metric.fn,
                groupValue: id.split('/').pop()!,
                groupType: RangeQueryMetricGroup.PIPELINE_NAMESPACE,
                metric: metric.name,
                transform: metric.transform,
              })
            : this.props.triggerRequestNamespaceMetrics({
                ...baseQuery,
                fn: metric.fn,
                metric: metric.name,
                groupType: cluster ? NamespaceMetricsGroup.CLUSTER : undefined,
                groupValue: cluster,
                transform: metric.transform,
              })
      )
    )
  }

  render() {
    return (
      <MultipleGraphsLayout
        graphsToRender={this.graphsToRender}
        id={this.props.id}
        onTimeRangeChange={this.props.setTimeRange}
        timeRange={this.props.timeRange}
      >
        {layoutProps => {
          return this.customGraphs.includes(layoutProps.metric) ? (
            <RangeGraph
              {...layoutProps}
              showLoadingIndicator={false}
              groupValue={this.props.id!.split('/').pop()!}
              groupType={RangeQueryMetricGroup.PIPELINE_NAMESPACE}
            />
          ) : (
            <NamespaceGraph
              showLoadingIndicator={false}
              groupType={this.props.cluster ? NamespaceMetricsGroup.CLUSTER : undefined}
              groupValue={this.props.cluster}
              {...layoutProps}
            />
          )
        }}
      </MultipleGraphsLayout>
    )
  }
}

export default withGraphFilters(() => 'metrics')(
  connect(null, metricsActions)(NamespaceDashboardMetrics)
)
