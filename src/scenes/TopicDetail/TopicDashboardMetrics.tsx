import * as React from 'react'
import { connect } from 'react-redux'
import { ClusterFiltersInjectedProps } from 'src/components/ClusterPanel/withClusterFilters'
import { TopicGraph } from 'src/components/Graph/GraphData'
import {
  MetricsActions,
  TopicGraphProps,
  TopicMetricsConnect,
} from 'src/components/Graph/internal/types'
import { getStepBaseOnTimeRange } from 'src/components/Graph/internal/utils'
import metrics, { topicMetrics } from 'src/components/Graph/metrics'
import makeMultipleGraphsLayout, { GraphToRender } from 'src/components/Graph/MultiplesGraphsLayout'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import {
  TimeRange,
  TopicMetricsGroup,
} from 'src/store/metrics/metrics-model'

interface TopicDashboardMetricsProps
  extends NestedId,
    GraphFiltersInjectedProps,
    ClusterFiltersInjectedProps,
    MetricsActions {}

const MultipleGraphsLayout = makeMultipleGraphsLayout<
  TopicGraphProps,
  TopicMetricsConnect
>()

class TopicDashboardMetrics extends React.Component<TopicDashboardMetricsProps> {
  graphsToRender: GraphToRender[] = [
    {
      title: null,
      metricsToRender: [
        { metric: metrics.BACKLOG },
        { metric: topicMetrics.STORAGE_SIZE },
        { metric: metrics.RATE_IN },
        { metric: metrics.RATE_OUT },
        { metric: metrics.THROUGHPUT_IN },
        { metric: metrics.THROUGHPUT_OUT },
      ]
    },
  ]

  componentDidMount() {
    this.requestMetrics(this.props.id, this.props.timeRange, this.props.cluster)
  }

  componentWillReceiveProps(nextProps: TopicDashboardMetricsProps) {
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
      graph.metricsToRender.forEach(({ metric }) => this.props.triggerRequestTopicMetrics({
          ...baseQuery,
          fn: metric.fn,
          metric: metric.name,
          groupType: cluster ? TopicMetricsGroup.CLUSTER : undefined,
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
        timeRange={this.props.timeRange}>
        {layoutProps => {
          return <TopicGraph
          showLoadingIndicator={false}
          groupType={this.props.cluster ? TopicMetricsGroup.CLUSTER : undefined}
          groupValue={this.props.cluster}
          {...layoutProps} />
        }}
      </MultipleGraphsLayout>
    )
  }
}

export default withGraphFilters(() => 'metrics')(
  connect(null, metricsActions)(TopicDashboardMetrics)
)
