import * as React from 'react'
import { connect } from 'react-redux'
import { RangeGraph } from 'src/components/Graph/GraphData'
import { MetricsActions } from 'src/components/Graph/internal/types'
import { RangeGraphProps, RangeMetricsConnect } from 'src/components/Graph/internal/types'
import { getStepBaseOnTimeRange } from 'src/components/Graph/internal/utils'
import metrics, { namespaceMetrics, nodeMetrics } from 'src/components/Graph/metrics'
import makeMultipleGraphsLayout from 'src/components/Graph/MultiplesGraphsLayout'
import { GraphToRender } from 'src/components/Graph/MultiplesGraphsLayout'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { RangeQueryMetricGroup, TimeRange } from 'src/store/metrics/metrics-model'
import { NodeLimits } from 'src/store/node/node-model'
import { makeGetNodeContainersAsOrString } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'
import { bytesToMB } from 'src/util/formating'

interface OwnProps extends NestedId, GraphFiltersInjectedProps {
  limits: NodeLimits
}

interface NodeMetricsProps extends OwnProps, MetricsActions {
  containers: string
}

const MultipleGraphsLayout = makeMultipleGraphsLayout<RangeGraphProps, RangeMetricsConnect>()

export class NodeMetrics extends React.Component<NodeMetricsProps> {
  graphsToRender: GraphToRender[] = [
    {
      title: 'Resource Usage',
      metricsToRender: [
        {
          metric: metrics.CPU_USED,
          maxValue: this.props.limits.cpu,
        },
        {
          metric: metrics.RAM_USED,
          maxValue: bytesToMB(this.props.limits.memory),
        },
        {
          metric: namespaceMetrics.STORAGE_SIZE,
          maxValue: bytesToMB(this.props.limits.storage),
        },
      ],
    },
    {
      title: 'Network Traffic',
      metricsToRender: [
        {
          metric: nodeMetrics.REPLICATION_RATE_IN,
        },
        {
          metric: nodeMetrics.REPLICATION_RATE_OUT,
        },
      ],
    },
  ]

  componentDidMount() {
    this.requestMetrics(this.props.containers, this.props.timeRange)
  }

  componentWillReceiveProps(nextProps: NodeMetricsProps) {
    if (
      nextProps.timeRange !== this.props.timeRange ||
      nextProps.containers !== this.props.containers ||
      nextProps.id !== this.props.id
    ) {
      this.requestMetrics(nextProps.containers, nextProps.timeRange)
    }
  }

  requestMetrics = (containers: string, timeRange: TimeRange) => {
    const query = {
      id: '',
      groupValue: containers,
      groupType: RangeQueryMetricGroup.CONTAINER,
      step: getStepBaseOnTimeRange(timeRange),
      timeRange,
    }

    if (!containers) return

    this.graphsToRender.forEach(graph =>
      graph.metricsToRender.forEach(({ metric: { fn, name, transform } }) =>
        this.props.triggerRangeQueryMetrics({
          ...query,
          metric: name,
          fn,
          transform,
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
        groupType={RangeQueryMetricGroup.CONTAINER}
        groupValue={this.props.containers}
      >
        {layoutProps => <RangeGraph {...layoutProps} showLoadingIndicator={false} />}
      </MultipleGraphsLayout>
    )
  }
}

export default withGraphFilters(() => 'metrics')(
  connect(() => {
    return (state: State, { id }: OwnProps) => {
      const getContainers = makeGetNodeContainersAsOrString()

      return {
        containers: getContainers(state, id),
      }
    }
  }, metricsActions)(NodeMetrics)
)
