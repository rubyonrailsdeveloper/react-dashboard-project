import _uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import EntityDetailGraphsLayout from 'src/components/Graph/EntityDetailGraphsLayout'
import { RangeGraph } from 'src/components/Graph/GraphData'
import {
  EntityDetailGraphChildrenProps,
  EntityGraphsState,
  GraphCategory,
  MetricObj,
  MetricsActions,
} from 'src/components/Graph/internal/types'
import {
  filterByCategory,
  getStepBaseOnTimeRange,
  updateMetricObj,
} from 'src/components/Graph/internal/utils'
import metrics, { namespaceMetrics } from 'src/components/Graph/metrics'
import NamespaceCategoryToolbar from 'src/components/GraphsCategoryToolbar/NamespaceCategoryToolbar'
import { EntityParams } from 'src/routes'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { RangeQueryMetricGroup } from 'src/store/metrics/metrics-model'
import { NodeLimits } from 'src/store/node/node-model'
import { makeGetNodeContainersAsOrString } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'

interface OwnProps extends NestedId, RouteComponentProps<EntityParams> {
  limits: NodeLimits
}

interface NodeGraphsProps extends OwnProps, MetricsActions {
  containers: string
}

class NodeGraphs extends React.Component<NodeGraphsProps> {
  initialCategory = GraphCategory.Resources

  state: EntityGraphsState = {
    activeCategory: this.initialCategory,
    metricsToRender: [
      {
        metric: metrics.CPU_USED,
        id: _uniqueId(),
        className: 'col-12',
        maxValue: this.props.limits.cpu,
      },
      {
        metric: metrics.RAM_USED,
        id: _uniqueId(),
        className: 'col-12',
        maxValue: this.props.limits.memory,
      },
      {
        metric: namespaceMetrics.STORAGE_SIZE,
        id: _uniqueId(),
        className: 'col-12',
        maxValue: this.props.limits.storage,
      },
    ],
  }

  componentWillReceiveProps(nextProps: NodeGraphsProps) {
    if (nextProps.containers !== this.props.containers) {
      this.requestAllMetrics(nextProps.containers)
    }
  }

  hardRequest = (metricObj?: MetricObj) => {
    if (metricObj) {
      this.requestMetric(this.props.containers, metricObj, true)
      return
    }

    this.requestAllMetrics(this.props.containers, true)
  }

  requestAllMetrics = (containers: string, forceReload = false) => {
    this.state.metricsToRender
      .filter(filterByCategory(this.state.activeCategory))
      .forEach((metricObj: MetricObj) => {
        this.requestMetric(containers, metricObj, forceReload)
      })
  }

  requestMetric = (
    containers: string,
    { timeRange, metric: { fn, name, transform } }: MetricObj,
    forceReload: boolean
  ) => {
    if (!containers) return

    this.props.triggerRangeQueryMetrics({
      id: '',
      groupType: RangeQueryMetricGroup.CONTAINER,
      groupValue: containers,
      metric: name,
      step: getStepBaseOnTimeRange(timeRange!),
      timeRange: timeRange!,
      fn,
      forceReload,
      transform,
    })
  }

  updateMetricObj = (metricObjToUpdate: MetricObj) => {
    this.requestMetric(this.props.containers, metricObjToUpdate, false)

    this.setState((prevState: EntityGraphsState) => ({
      metricsToRender: updateMetricObj(prevState.metricsToRender, metricObjToUpdate),
    }))
  }

  updateCategory = (activeCategory: GraphCategory) => {
    this.setState({ activeCategory })
  }

  render() {
    return (
      <EntityDetailGraphsLayout
        metricsToRender={this.state.metricsToRender.filter(
          filterByCategory(this.state.activeCategory)
        )}
        initialCategory={this.initialCategory}
        onHardRefresh={this.hardRequest}
        onUpdateMetricObj={this.updateMetricObj}
        onUpdateCategory={this.updateCategory}
        categoryToolbar={NamespaceCategoryToolbar}
      >
        {(props: EntityDetailGraphChildrenProps) => (
          <RangeGraph
            {...props}
            showLoadingIndicator={false}
            id={''}
            groupType={RangeQueryMetricGroup.CONTAINER}
            groupValue={this.props.containers}
          />
        )}
      </EntityDetailGraphsLayout>
    )
  }
}

export default connect(() => {
  const getContainers = makeGetNodeContainersAsOrString()

  return (state: State, { match }: OwnProps) => ({
    containers: getContainers(state, match.params.id),
  })
}, metricsActions)(NodeGraphs)
