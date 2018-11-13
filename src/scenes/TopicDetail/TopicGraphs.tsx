import _uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
import EntityDetailGraphsLayout from 'src/components/Graph/EntityDetailGraphsLayout'
import { TopicGraph } from 'src/components/Graph/GraphData'
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
  getTopicId,
  updateMetricObj,
} from 'src/components/Graph/internal/utils'
import metrics, { topicMetrics } from 'src/components/Graph/metrics'
import TopicCategoryToolbar from 'src/components/GraphsCategoryToolbar/TopicCategoryToolbar'
import { EntityParams } from 'src/routes'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { TopicMetricsGroup } from 'src/store/metrics/metrics-model'
import { State } from 'src/store/root-reducer'
import { Topic } from 'src/store/topic/topic-model'
import { makeGetTopic } from 'src/store/topic/topic-reducers'

type OwnProps = RouteComponentProps<EntityParams>

export interface TopicGraphsProps
  extends OwnProps,
    ClusterFiltersInjectedProps,
    MetricsActions {
  topic: Topic | null
  id?: string
}

class TopicGraphs extends React.Component<TopicGraphsProps, EntityGraphsState> {
  initialCategory = GraphCategory.Events

  state: EntityGraphsState = {
    activeCategory: this.initialCategory,
    metricsToRender: [
      { metric: topicMetrics.STORAGE_SIZE, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.RATE_IN, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.RATE_OUT, id: _uniqueId(), className: 'col-6' },
      // { metric: topicMetrics.THROUGHPUT_IN, id: _uniqueId(), className: 'col-6' },
      // { metric: topicMetrics.THROUGHPUT_OUT, id: _uniqueId(), className: 'col-6' },
      // { metric: topicMetrics.BACKLOG, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.STORAGE_READ_RATE, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.STORAGE_WRITE_RATE, id: _uniqueId(), className: 'col-12' },
      { metric: metrics.REPLICATION_RATE_IN, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.REPLICATION_RATE_OUT, id: _uniqueId(), className: 'col-6' },
      { metric: metrics.REPLICATION_BACKLOG, id: _uniqueId(), className: 'col-12' },
    ],
  }

  componentWillReceiveProps(nextProps: TopicGraphsProps) {
    // console.log('TopicGraphs.componentWillReceiveProps, nextProps: %o', nextProps)
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
    const id = this.props.id || getTopicId(this.props.topic)
    const query = {
      fn: metric.fn,
      metric: metric.name,
      timeRange: timeRange!,
      step: getStepBaseOnTimeRange(timeRange!),
      transform: metric.transform,
      forceReload,
    }
    // console.log('TopicGraphs.requestMetric(), id: %o\nquery: %o', id, query);
    if (id) {
      this.props.triggerRequestTopicMetrics({
        ...query,
        groupType: this.props.cluster ? TopicMetricsGroup.CLUSTER : undefined,
        groupValue: this.props.cluster,
        id,
      })
    }
  }

  requestAllMetrics = (forceReload = false) => {
    // console.log('TopicGraphs.requestAllMetrics, state: %o', this.state)
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
    // console.log('TopicGraphs.render(), props: %o', this.props)
    const id = this.props.id || getTopicId(this.props.topic)

    return id ? (
      <EntityDetailGraphsLayout
        metricsToRender={this.state.metricsToRender.filter(
          filterByCategory(this.state.activeCategory)
        )}
        initialCategory={this.initialCategory}
        onHardRefresh={this.hardRequest}
        onUpdateMetricObj={this.updateMetricObj}
        onUpdateCategory={this.updateCategory}
        categoryToolbar={TopicCategoryToolbar}
      >
        {(props: EntityDetailGraphChildrenProps) => {
          return <TopicGraph id={id}
            groupType={this.props.cluster ? TopicMetricsGroup.CLUSTER : undefined}
            groupValue={this.props.cluster}
            showLoadingIndicator={false}
            {...props} />
        }}
      </EntityDetailGraphsLayout>
    ) : null
  }
}

export default withClusterFilters()(
  connect(() => {
    const getTopic = makeGetTopic()

    return (state: State, props: OwnProps) => ({
      topic: getTopic(state, props.match.params),
    })
  }, metricsActions)(TopicGraphs)
)
