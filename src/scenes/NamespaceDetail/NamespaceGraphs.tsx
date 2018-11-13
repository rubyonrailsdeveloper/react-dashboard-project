import _uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
import EntityDetailGraphsLayout from 'src/components/Graph/EntityDetailGraphsLayout'
import { NamespaceGraph, RangeGraph } from 'src/components/Graph/GraphData'
import {
  EntityDetailGraphChildrenProps,
  EntityGraphsState,
  GraphCategory,
  Metric,
  MetricObj,
  MetricsActions,
} from 'src/components/Graph/internal/types'
import {
  filterByCategory,
  getNamespaceId,
  getStepBaseOnTimeRange,
  updateMetricObj,
} from 'src/components/Graph/internal/utils'
import metrics, { namespaceMetrics } from 'src/components/Graph/metrics'
import NamespaceCategoryToolbar from 'src/components/GraphsCategoryToolbar/NamespaceCategoryToolbar'
import { EntityParams } from 'src/routes'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { NamespaceMetricsGroup, RangeQueryMetricGroup } from 'src/store/metrics/metrics-model'
import { Namespace } from 'src/store/namespace/namespace-model'
import { makeGetNamespace } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'

type OwnProps = RouteComponentProps<EntityParams>

export interface NamespaceGraphsProps
  extends OwnProps,
    ClusterFiltersInjectedProps,
    MetricsActions {
  namespace: Namespace | null
  id?: string
}

class NamespaceGraphs extends React.Component<NamespaceGraphsProps, EntityGraphsState> {
  initialCategory = GraphCategory.Resources
  customGraphs: Metric[] = [namespaceMetrics.CPU_USED, namespaceMetrics.RAM_USED]

  state: EntityGraphsState = {
    activeCategory: this.initialCategory,
    metricsToRender: [
      { metric: namespaceMetrics.CPU_USED, id: _uniqueId(), className: 'col-12' },
      { metric: namespaceMetrics.RAM_USED, id: _uniqueId(), className: 'col-12' },
      { metric: namespaceMetrics.STORAGE_SIZE, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.RATE_IN, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.RATE_OUT, id: _uniqueId(), className: 'col-6' },
      // { metric: namespaceMetrics.THROUGHPUT_IN, id: _uniqueId(), className: 'col-6' },
      // { metric: namespaceMetrics.THROUGHPUT_OUT, id: _uniqueId(), className: 'col-6' },
      // { metric: namespaceMetrics.BACKLOG, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.STORAGE_READ_RATE, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.STORAGE_WRITE_RATE, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.REPLICATION_RATE_IN, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.REPLICATION_RATE_OUT, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.REPLICATION_BACKLOG, id: _uniqueId(), className: 'col-12' },
    ],
  }

  componentWillReceiveProps(nextProps: NamespaceGraphsProps) {
    if (nextProps.cluster !== this.props.cluster) {
      this.requestAllMetrics()
    }
  }

  hardRequest = (metricObj?: MetricObj) => {
    if (metricObj) {
      this.requestMetric(metricObj, true)
      return
    }

    this.requestAllMetrics(true)
  }

  requestMetric = ({ metric, timeRange }: MetricObj, forceReload = false) => {
    const id = this.props.id || getNamespaceId(this.props.namespace)
    const query = {
      fn: metric.fn,
      metric: metric.name,
      timeRange: timeRange!,
      step: getStepBaseOnTimeRange(timeRange!),
      transform: metric.transform,
      forceReload,
    }

    if (id) {
      this.customGraphs.includes(metric)
        ? this.props.triggerRangeQueryMetrics({
            ...query,
            groupValue: id!.split('/').pop()!,
            groupType: RangeQueryMetricGroup.PIPELINE_NAMESPACE,
            id: '',
          })
        : this.props.triggerRequestNamespaceMetrics({
            ...query,
            groupType: this.props.cluster ? NamespaceMetricsGroup.CLUSTER : undefined,
            groupValue: this.props.cluster,
            id,
          })
    }
  }

  requestAllMetrics = (forceReload = false) => {
    this.state.metricsToRender
      .filter(filterByCategory(this.state.activeCategory))
      .forEach((metricObj: MetricObj) => {
        this.requestMetric(metricObj, forceReload)
      })
  }

  updateMetricObj = (metricObjToUpdate: MetricObj) => {
    this.requestMetric(metricObjToUpdate)
    this.setState(prevState => ({
      metricsToRender: updateMetricObj(prevState.metricsToRender, metricObjToUpdate),
    }))
  }

  updateCategory = (activeCategory: GraphCategory) => {
    this.setState({ activeCategory })
  }

  render() {
    const id = this.props.id || getNamespaceId(this.props.namespace)

    return id ? (
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
        {(props: EntityDetailGraphChildrenProps) => {
          return this.customGraphs.includes(props.metric) ? (
            <RangeGraph
              id=""
              metric={props.metric}
              groupType={RangeQueryMetricGroup.PIPELINE_NAMESPACE}
              groupValue={id.split('/').pop()!}
              showLoadingIndicator={false}
              {...props}
            />
          ) : (
            <NamespaceGraph
              id={id}
              groupType={this.props.cluster ? NamespaceMetricsGroup.CLUSTER : undefined}
              groupValue={this.props.cluster}
              showLoadingIndicator={false}
              {...props}
            />
          )
        }}
      </EntityDetailGraphsLayout>
    ) : null
  }
}

export default withClusterFilters()(
  connect(() => {
    const getNamespace = makeGetNamespace()

    return (state: State, props: OwnProps) => ({
      namespace: getNamespace(state, props.match.params),
    })
  }, metricsActions)(NamespaceGraphs)
)
