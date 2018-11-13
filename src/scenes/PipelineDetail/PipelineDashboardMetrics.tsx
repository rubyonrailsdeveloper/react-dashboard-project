import * as React from 'react'
import { connect } from 'react-redux'
import { getPipelineMetricsQuery, PipelineGraph } from 'src/components/Graph/GraphData'
import {
  MetricsActions,
  PipelineGraphProps,
  PipelineMetricsConnect,
} from 'src/components/Graph/internal/types'
import metrics from 'src/components/Graph/metrics'
import makeMultipleGraphsLayout, { GraphToRender } from 'src/components/Graph/MultiplesGraphsLayout'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import withPhysicalPlanFilters, {
  PhysicalPlanFiltersInjectedProps,
} from 'src/components/Pipeline/withPhysicalPlanFilters'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { physicalPlanFilterMetricsGroup } from 'src/store/metrics/metrics-model'
import { Pipeline } from 'src/store/pipeline/pipeline-model'
import { pipelineResourceLimitsByFilter } from 'src/store/pipeline/pipeline-views'

interface PipelineDashboardMetricsProps
  extends MetricsActions,
    PhysicalPlanFiltersInjectedProps,
    GraphFiltersInjectedProps {
  pipeline: Pipeline
}

const MultipleGraphsLayout = makeMultipleGraphsLayout<PipelineGraphProps, PipelineMetricsConnect>()

class PipelineDashboardMetrics extends React.Component<PipelineDashboardMetricsProps> {
  graphsToRender: GraphToRender[] = [
    {
      title: null,
      metricsToRender: [
        { metric: metrics.CPU_USED },
        { metric: metrics.RAM_USED },
        { metric: metrics.FAILURES_COUNT },
        { metric: metrics.GC_TIME_PER_JVM },
        { metric: metrics.TIME_SPENT_UNDER_BACK_PRESSURE },
        { metric: metrics.EMIT_COUNT },
        { metric: metrics.COMPLETE_LATENCY },
        { metric: metrics.ACK_COUNT },
      ],
    },
  ]

  componentDidMount() {
    this.requestMetrics(this.props)
  }

  componentWillReceiveProps(nextProps: PipelineDashboardMetricsProps) {
    if (
      nextProps.timeRange !== this.props.timeRange ||
      nextProps.filterValue !== this.props.filterValue ||
      nextProps.filterType !== this.props.filterType ||
      nextProps.pipeline !== this.props.pipeline
    ) {
      this.requestMetrics(nextProps)
    }
  }

  requestMetrics = (props: PipelineDashboardMetricsProps) => {
    const { pipeline: { id }, filterValue, filterType, timeRange } = props
    this.graphsToRender.forEach(graph =>
      graph.metricsToRender.forEach(({ metric }) =>
        this.props.triggerRequestPipelineMetrics(
          getPipelineMetricsQuery({
            timeRange: timeRange || this.props.timeRange,
            id,
            metric,
            filterValue,
            filterType,
          })
        )
      )
    )
  }

  render() {
    const filterLimits = pipelineResourceLimitsByFilter(this.props.pipeline, this.props.filterType)
    let maxValue: number

    return (
      <MultipleGraphsLayout
        graphsToRender={this.graphsToRender}
        id={this.props.pipeline.id}
        onTimeRangeChange={this.props.setTimeRange}
        timeRange={this.props.timeRange}
      >
        {layoutProps => {
          if (layoutProps.metric === metrics.CPU_USED) {
            maxValue = filterLimits.cpu
          } else if (layoutProps.metric === metrics.RAM_USED) {
            maxValue = filterLimits.memory
          }

          return (
            <PipelineGraph
              maxValue={maxValue}
              groupValue={this.props.filterValue}
              groupType={physicalPlanFilterMetricsGroup(this.props.filterType)}
              {...layoutProps}
              showLoadingIndicator={false}
            />
          )
        }}
      </MultipleGraphsLayout>
    )
  }
}

export default withGraphFilters(() => 'pipeline-metrics')(
  withPhysicalPlanFilters()(connect(null, metricsActions)(PipelineDashboardMetrics))
)
