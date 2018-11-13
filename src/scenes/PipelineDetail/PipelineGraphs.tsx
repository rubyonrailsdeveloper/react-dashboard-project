import _uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import EntityDetailGraphsLayout from 'src/components/Graph/EntityDetailGraphsLayout'
import { getPipelineMetricsQuery, PipelineGraph } from 'src/components/Graph/GraphData'
import {
  EntityDetailGraphChildrenProps,
  EntityGraphsState,
  GraphCategory,
  MetricObj,
  MetricsActions,
} from 'src/components/Graph/internal/types'
import { filterByCategory, updateMetricObj } from 'src/components/Graph/internal/utils'
import metrics, { boltMetrics, customMetrics, spoutMetrics } from 'src/components/Graph/metrics'
import PipelineCategoryToolbar from 'src/components/GraphsCategoryToolbar/PipelineCategoryTolbar'
import withPhysicalPlanFilters, {
  PhysicalPlanFiltersInjectedProps,
} from 'src/components/Pipeline/withPhysicalPlanFilters'
import { EntityParams } from 'src/routes'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { physicalPlanFilterMetricsGroup } from 'src/store/metrics/metrics-model'
import { Pipeline } from 'src/store/pipeline/pipeline-model'
import { makeGetPipeline } from 'src/store/pipeline/pipeline-reducers'
import { pipelineResourceLimitsByFilter } from 'src/store/pipeline/pipeline-views'
import { State } from 'src/store/root-reducer'

interface PipelineGraphsProps
  extends RouteComponentProps<EntityParams>,
    PhysicalPlanFiltersInjectedProps,
    MetricsActions {
  pipeline: Pipeline
}

class PipelineGraphs extends React.Component<PipelineGraphsProps, EntityGraphsState> {
  initialCategory = GraphCategory.Topology
  state: EntityGraphsState = {
    activeCategory: this.initialCategory,
    metricsToRender: [
      { metric: metrics.CPU_USED, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.RAM_USED, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.GC_TIME_PER_JVM, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.GC_PER_JVM_COUNT, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.TIME_SPENT_UNDER_BACK_PRESSURE, id: _uniqueId(), className: 'col-6' },
      { metric: customMetrics.FAILURES_COUNT_BY_SPOUT, id: _uniqueId(), className: 'col-6' },
      { metric: boltMetrics.EXECUTE_COUNT, id: _uniqueId(), className: 'col-6' },
      { metric: boltMetrics.ACK_COUNT, id: _uniqueId(), className: 'col-6' },
      { metric: boltMetrics.EMIT_COUNT, id: _uniqueId(), className: 'col-6' },
      { metric: boltMetrics.FAILURES_COUNT, id: _uniqueId(), className: 'col-6' },
      { metric: boltMetrics.AVG_EXECUTE_LATENCY, id: _uniqueId(), className: 'col-6' },
      { metric: boltMetrics.AVG_PROCESS_LATENCY, id: _uniqueId(), className: 'col-6' },
      { metric: boltMetrics.AVG_FAILURE_LATENCY, id: _uniqueId(), className: 'col-6' },
      { metric: spoutMetrics.EMIT_COUNT, id: _uniqueId(), className: 'col-6' },
      { metric: spoutMetrics.FAILURES_COUNT, id: _uniqueId(), className: 'col-6' },
      { metric: spoutMetrics.ACK_COUNT, id: _uniqueId(), className: 'col-6' },
      { metric: spoutMetrics.AVG_COMPLETE_LATENCY, id: _uniqueId(), className: 'col-6' },
      { metric: spoutMetrics.AVG_FAILURE_LATENCY, id: _uniqueId(), className: 'col-6' },
      { metric: spoutMetrics.AVG_PENDING_ACKED_COUNT, id: _uniqueId(), className: 'col-6' },
    ],
  }

  componentWillReceiveProps(nextProps: PipelineGraphsProps) {
    if (
      nextProps.filterValue !== this.props.filterValue ||
      nextProps.filterType !== this.props.filterType
    ) {
      this.requestAllMetrics(nextProps, false)
    }
  }

  hardRequest = (metricObj?: MetricObj) => {
    if (metricObj) {
      this.requestMetric(metricObj, this.props, true)
      return
    }

    this.requestAllMetrics(this.props, true)
  }

  requestMetric = (
    { metric, timeRange }: MetricObj,
    { filterValue, filterType }: PipelineGraphsProps,
    forceReload = false
  ) => {
    this.props.triggerRequestPipelineMetrics(
      getPipelineMetricsQuery(
        {
          id: this.props.pipeline.id,
          timeRange: timeRange!,
          metric,
          filterValue,
          filterType,
        },
        forceReload
      )
    )
  }

  requestAllMetrics = (props: PipelineGraphsProps, forceReload: boolean) => {
    this.state.metricsToRender
      .filter(filterByCategory(this.state.activeCategory))
      .forEach((metricObj: MetricObj) => {
        this.requestMetric(metricObj, props, forceReload)
      })
  }

  updateCategory = (activeCategory: GraphCategory) => {
    this.setState({ activeCategory })
  }

  updateMetricObj = (metricObjToUpdate: MetricObj) => {
    this.requestMetric(metricObjToUpdate, this.props)
    this.setState(prevState => ({
      metricsToRender: updateMetricObj(prevState.metricsToRender, metricObjToUpdate),
    }))
  }

  render() {
    let maxValue: number
    const limits = this.props.pipeline
      ? pipelineResourceLimitsByFilter(this.props.pipeline, this.props.filterType)
      : { cpu: 0, memory: 0 }
    const filters = {
      groupValue: this.props.filterValue,
      groupType: physicalPlanFilterMetricsGroup(this.props.filterType),
    }

    return this.props.pipeline ? (
      <EntityDetailGraphsLayout
        metricsToRender={this.state.metricsToRender.filter(
          filterByCategory(this.state.activeCategory)
        )}
        initialCategory={this.initialCategory}
        onHardRefresh={this.hardRequest}
        onUpdateCategory={this.updateCategory}
        onUpdateMetricObj={this.updateMetricObj}
        categoryToolbar={PipelineCategoryToolbar}
      >
        {(props: EntityDetailGraphChildrenProps) => {
          if (props.metric === metrics.CPU_USED) {
            maxValue = limits.cpu
          } else if (props.metric === metrics.RAM_USED) {
            maxValue = limits.memory
          }

          return (
            <PipelineGraph
              id={this.props.pipeline.id}
              {...filters}
              {...props}
              showLoadingIndicator={false}
              maxValue={maxValue}
            />
          )
        }}
      </EntityDetailGraphsLayout>
    ) : null
  }
}

export default withPhysicalPlanFilters()(
  connect(() => {
    const getPipeline = makeGetPipeline()

    return (state: State, props: RouteComponentProps<EntityParams>) => ({
      pipeline: getPipeline(state, props.match.params),
    })
  }, metricsActions)(PipelineGraphs)
)
