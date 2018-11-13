import _uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
import EntityDetailGraphsLayout from 'src/components/Graph/EntityDetailGraphsLayout'
import { RangeGraph } from 'src/components/Graph/GraphData'
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
  getStepBaseOnTimeRange,
  updateMetricObj,
} from 'src/components/Graph/internal/utils'
import metrics, { namespaceMetrics } from 'src/components/Graph/metrics'
import NamespaceCategoryToolbar from 'src/components/GraphsCategoryToolbar/NamespaceCategoryToolbar'
import { EntityParams } from 'src/routes'
import { makeEncodeNamespaceValue } from 'src/scenes/GroupDetail/GroupDashboardMetrics'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import {
  MetricLabel,
  NamespaceMetricsGroup,
  RangeQueryMetricGroup,
} from 'src/store/metrics/metrics-model'
import * as namespaceActions from 'src/store/namespace/namespace-actions'
import { Namespace } from 'src/store/namespace/namespace-model'
import { makeGetNamespacesByGroup } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'

type NamespaceActions = typeof namespaceActions

type OwnProps = RouteComponentProps<EntityParams>

export interface GroupGraphsProps
  extends OwnProps,
    ClusterFiltersInjectedProps,
    MetricsActions,
    NamespaceActions {
  namespaces: Namespace[]
}

class GroupGraphs extends React.Component<GroupGraphsProps, EntityGraphsState> {
  initialCategory = GraphCategory.Resources
  customGraphs: Metric[] = [namespaceMetrics.CPU_USED, namespaceMetrics.RAM_USED]
  encodeNamespaceNames = makeEncodeNamespaceValue()
  encodeNamespaceIds = makeEncodeNamespaceValue()

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
      { metric: metrics.REPLICATION_RATE_IN, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.REPLICATION_RATE_OUT, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.REPLICATION_BACKLOG, id: _uniqueId(), className: 'col-12' },
    ],
  }

  componentDidMount() {
    this.props.triggerRequestNamespaceList()
  }

  componentWillReceiveProps(nextProps: GroupGraphsProps) {
    const { id } = nextProps.match.params

    if (id !== this.props.match.params.id) {
      this.props.triggerRequestNamespaceList()
    }

    if (
      nextProps.namespaces.length !== this.props.namespaces.length ||
      nextProps.cluster !== this.props.cluster
    ) {
      this.requestAllMetrics(nextProps.namespaces, nextProps.cluster)
    }
  }

  hardRequest = (metricObj?: MetricObj) => {
    if (metricObj) {
      this.requestMetric(this.props.namespaces, this.props.cluster, metricObj, true)
      return
    }

    this.requestAllMetrics(this.props.namespaces, this.props.cluster, true)
  }

  requestMetric = (
    namespaces: Namespace[],
    cluster: string,
    { metric, timeRange }: MetricObj,
    forceReload: boolean
  ) => {
    let query
    const labels = cluster ? [[NamespaceMetricsGroup.CLUSTER, cluster] as MetricLabel] : []
    const baseQuery = {
      fn: metric.fn,
      metric: metric.name,
      timeRange: timeRange!,
      step: getStepBaseOnTimeRange(timeRange!),
      transform: metric.transform,
      forceReload,
    }

    if (!namespaces.length) return

    query = this.customGraphs.includes(metric)
      ? {
          ...baseQuery,
          id: '',
          groupValue: this.encodeNamespaceNames(namespaces, false),
          groupType: RangeQueryMetricGroup.PIPELINE_NAMESPACE,
        }
      : {
          ...baseQuery,
          id: this.encodeNamespaceIds(namespaces, true),
          groupType: RangeQueryMetricGroup.NAMESPACE,
          groupValue: this.encodeNamespaceIds(namespaces, true),
          labels,
        }

    this.props.triggerRangeQueryMetrics(query)
  }

  requestAllMetrics = (namespaces: Namespace[], cluster: string, forceReload = false) => {
    this.state.metricsToRender
      .filter(filterByCategory(this.state.activeCategory))
      .forEach((metricObj: MetricObj) => {
        this.requestMetric(namespaces, cluster, metricObj, forceReload)
      })
  }

  updateMetricObj = (metricObjToUpdate: MetricObj) => {
    this.requestMetric(this.props.namespaces, this.props.cluster, metricObjToUpdate, false)
    this.setState(prevState => ({
      metricsToRender: updateMetricObj(prevState.metricsToRender, metricObjToUpdate),
    }))
  }

  updateCategory = (activeCategory: GraphCategory) => {
    this.setState({ activeCategory })
  }

  render() {
    const { namespaces, match } = this.props
    const labels = this.props.cluster
      ? [[NamespaceMetricsGroup.CLUSTER, this.props.cluster] as MetricLabel]
      : []

    return this.props.namespaces.length ? (
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
              {...props}
              showLoadingIndicator={false}
              id={match.params.id}
              groupValue={this.encodeNamespaceNames(namespaces, false)}
              groupType={RangeQueryMetricGroup.PIPELINE_NAMESPACE}
            />
          ) : (
            <RangeGraph
              {...props}
              showLoadingIndicator={false}
              id={match.params.id}
              groupType={RangeQueryMetricGroup.NAMESPACE}
              groupValue={this.encodeNamespaceIds(namespaces, true)}
              metric={{ ...props.metric, labels }}
            />
          )
        }}
      </EntityDetailGraphsLayout>
    ) : null
  }
}

export default withClusterFilters()(
  connect(
    () => {
      const filterNamespaces = makeGetNamespacesByGroup()

      return (state: State, { match }: OwnProps) => ({
        namespaces: filterNamespaces(state, { groupId: match.params.id }),
      })
    },
    { ...metricsActions, ...namespaceActions }
  )(GroupGraphs)
)
