import { Button, Classes } from '@blueprintjs/core'
import classnames from 'classnames'
import * as React from 'react'
import { ContentRect } from 'react-measure'
import { connect } from 'react-redux'
import { TopicGraph } from 'src/components/Graph/GraphData'
import {
  MetricsActions,
  TopicGraphProps,
  TopicMetricsConnect,
} from 'src/components/Graph/internal/types'
// import { getStepBaseOnTimeRange } from 'src/components/Graph/internal/utils'
import metrics from 'src/components/Graph/metrics'
import makeMultipleGraphsLayout, { GraphToRender } from 'src/components/Graph/MultiplesGraphsLayout'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { TimeRange } from 'src/store/metrics/metrics-model'
import { State } from 'src/store/root-reducer'
import { Topic, TopicIOType } from 'src/store/topic/topic-model'
import { getTopicIsLoading, makeGetTopic } from 'src/store/topic/topic-reducers'
import DetailMap from './internal/DetailMap'
import TopicSource, { TopicSourceProps } from './internal/TopicSource'

type OwnProps = NestedId

interface TopicDetailMapProps extends OwnProps, GraphFiltersInjectedProps, MetricsActions {
  topic: Topic | null
  loadingTopic: boolean
}

const MultipleGraphsLayout = makeMultipleGraphsLayout<
  TopicGraphProps,
  TopicMetricsConnect
>()
// TODO: [ofer: 6-Mar-18]: Get rid of this hack (see also line #204-226)
const MultipleGraphsLayout2 = makeMultipleGraphsLayout<
  TopicGraphProps,
  TopicMetricsConnect
>()

// A subscription may have multiple consumers or none if external
function normalizeSubscriptions(topic: Topic) {
  return Object.keys(topic.subscriptions).reduce((acc: TopicSourceProps[], k) => {
    const sub = topic.subscriptions[k]
    const con = sub.consumers[0]
    acc.push({
      name: k,
      type: sub.type,
      id: k,
      pipelineId: con && con.type === TopicIOType.PIPELINE ? con.id : null,
      count: sub.consumers.length,
    })
    return acc
  }, [])
}

function normalizeProducers(topic: Topic) {
  return topic.producers.map(p => {
    if (p.type === TopicIOType.PIPELINE) {
      p.pipelineId = p.id
    }
    return p
  })
}

class TopicDetailMap extends React.Component<TopicDetailMapProps> {
  static defaultProps = {
    timeRange: TimeRange.HOUR,
  }

  state = {
    left: -1,
    right: -1,
    y: -1,
    showByteRate: false,
    topicId: '',
  }
  sourceTargetId = 'sources-target'
  sinkTargetId = 'sinks-target'

  // graphsToRender = (): GraphToRender[] => {
  //   return [
  //     this.state.showByteRate
  //       ? {
  //           metricsToRender: [
  //             { metric: metrics.THROUGHPUT_IN },
  //             { metric: metrics.THROUGHPUT_OUT },
  //             { metric: metrics.BACKLOG },
  //           ],
  //           title: null,
  //         }
  //       : {
  //           metricsToRender: [
  //             { metric: metrics.RATE_IN },
  //             { metric: metrics.RATE_OUT },
  //             { metric: metrics.BACKLOG },
  //           ],
  //           title: null,
  //         },
  //   ]
  // }

  rateGraphsToRender: GraphToRender[] = [{
    title: 'rate',
    metricsToRender: [
      { metric: metrics.RATE_IN },
      { metric: metrics.RATE_OUT },
      { metric: metrics.BACKLOG },
    ]
  }]
  byteRateGraphsToRender: GraphToRender[] = [{
    title: 'byte',
    metricsToRender: [
      { metric: metrics.THROUGHPUT_IN },
      { metric: metrics.THROUGHPUT_OUT },
      { metric: metrics.BACKLOG },
    ]
  }]

  setDimensions = (cr: ContentRect) => {
    const { offset, bounds } = cr
    if (offset && bounds) {
      this.setState({ left: offset.left, right: offset.left + bounds.width, y: bounds.height / 2 })
    }
  }

  // requestMetrics = () => {
  //   this.graphsToRender().forEach(graph =>
  //     graph.metricsToRender.forEach(metric =>
  //       this.props.triggerRequestTopicMetrics({
  //         fn: metric.metric.fn,
  //         id: this.state.topicId,
  //         metric: metric.metric.name,
  //         step: getStepBaseOnTimeRange(this.props.timeRange),
  //         timeRange: this.props.timeRange,
  //         transform: metric.metric.transform,
  //       })
  //     )
  //   )
  // }

  showByteRate = () => this.setState({ showByteRate: true })

  showRate = () => this.setState({ showByteRate: false })

  setTopicId = (topic: Topic) =>
    this.setState({ topicId: [topic.group, topic.namespace, topic.name].join('/') })

  componentWillReceiveProps(nextProps: TopicDetailMapProps) {
    const { topic } = nextProps
    if (topic && !this.props.topic) {
      this.setTopicId(topic)
    }
    // this.requestMetrics()
  }

  componentDidMount() {
    if (this.props.topic) this.setTopicId(this.props.topic)
    // this.requestMetrics()
  }

  render() {
    const { topic } = this.props
    const { showByteRate } = this.state

    if (!topic) return null

    const producers = normalizeProducers(topic)
    const subscriptions = normalizeSubscriptions(topic)

    return (
      <DetailMap
        componentId="topic-detail-map"
        entityId={topic.id}
        Component={TopicSource}
        sourceConnections={producers.map(p => ({
          sourceId: p.producerName,
          targetId: this.sourceTargetId,
        }))}
        targetElementsById={{
          [this.sourceTargetId]: { x: this.state.left, y: this.state.y },
          [this.sinkTargetId]: { x: this.state.right, y: this.state.y },
        }}
        sources={producers.map(p => ({ ...p, id: p.producerName, name: p.producerName }))}
        sinkConnections={subscriptions.map(s => ({
          sourceId: s.id!,
          targetId: this.sinkTargetId,
        }))}
        sinks={subscriptions.map(s => ({ ...s, id: s.id! }))}
        onContentResize={this.setDimensions}
      >
        <div className="topic-graph">
          <header>
            <div className={Classes.BUTTON_GROUP}>
              <Button className={classnames(!showByteRate && Classes.ACTIVE, 'button-tab')}
                text="Rate"
                onClick={this.showRate} />
              <Button className={classnames(showByteRate && Classes.ACTIVE, 'button-tab')}
                text="Byte Rate"
                onClick={this.showByteRate} />
            </div>
          </header>
          {!this.state.showByteRate ?
          <MultipleGraphsLayout
            id={this.state.topicId}
            hideToolbar={true}
            graphsToRender={this.rateGraphsToRender}
            timeRange={this.props.timeRange}
            noInteractions={true}>
            {layoutProps => (
              <TopicGraph {...layoutProps} hasDots={false} hasPointerInteraction={false} showLoadingIndicator={false} />
            )}
          </MultipleGraphsLayout>
          :
          <MultipleGraphsLayout2
            id={this.state.topicId}
            hideToolbar={true}
            graphsToRender={this.byteRateGraphsToRender}
            timeRange={this.props.timeRange}
            noInteractions={true}>
            {layoutProps => (
              <TopicGraph {...layoutProps} hasDots={false} hasPointerInteraction={false} showLoadingIndicator={false} />
            )}
          </MultipleGraphsLayout2>
          }
        </div>
      </DetailMap>
    )
  }
}

const connected = connect(() => {
  const getTopic = makeGetTopic()

  return (state: State, props: OwnProps) => {
    return {
      topic: getTopic(state, props),
      loadingTopic: getTopicIsLoading(state, props),
    }
  }
}, metricsActions)(TopicDetailMap)

export default withGraphFilters(() => 'topic-metrics')(connected)
