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
import metrics from 'src/components/Graph/metrics'
import makeMultipleGraphsLayout, { GraphToRender } from 'src/components/Graph/MultiplesGraphsLayout'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import Panel from 'src/components/Panel/Panel'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { TimeRange } from 'src/store/metrics/metrics-model'
import { State } from 'src/store/root-reducer'
import { Topic, TopicIOType } from 'src/store/topic/topic-model'
import { getTopicIsLoading, makeGetTopic } from 'src/store/topic/topic-reducers'
import TopicSource, { TopicSourceProps } from './internal/TopicSource'

type OwnProps = NestedId

interface TopicDetailOverviewProps extends OwnProps, GraphFiltersInjectedProps, MetricsActions {
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

class TopicDetailOverview extends React.Component<TopicDetailOverviewProps> {
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

  rateGraphsToRender: GraphToRender[] = [{
    title: null,
    metricsToRender: [
      { metric: metrics.RATE_IN },
      { metric: metrics.RATE_OUT },
      { metric: metrics.BACKLOG },
    ]
  }]
  byteRateGraphsToRender: GraphToRender[] = [{
    title: null,
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

  showByteRate = () => this.setState({ showByteRate: true })

  showRate = () => this.setState({ showByteRate: false })

  setTopicId = (topic: Topic) =>
    this.setState({ topicId: [topic.group, topic.namespace, topic.name].join('/') })

  componentWillReceiveProps(nextProps: TopicDetailOverviewProps) {
    const { topic } = nextProps
    if (topic && !this.props.topic) {
      this.setTopicId(topic)
    }
  }

  componentDidMount() {
    if (this.props.topic) this.setTopicId(this.props.topic)
  }

  graphPanelHeader = (showByteRate: boolean) => (<div className={Classes.BUTTON_GROUP}>
    <Button className={classnames(!showByteRate && Classes.ACTIVE, 'button-tab')}
      text="Rate"
      onClick={this.showRate} />
    <Button className={classnames(showByteRate && Classes.ACTIVE, 'button-tab')}
      text="Byte Rate"
      onClick={this.showByteRate} />
  </div>)

  render() {
    const { topic } = this.props
    const { showByteRate } = this.state

    if (!topic) return null

    const producers = normalizeProducers(topic)
    const subscriptions = normalizeSubscriptions(topic)

    return (
      <section className="topic-detail-overview">
        <Panel header="Producers">
          <ul className="pt-list pt-list-unstyled">
          {producers && producers.map((p, i) => (<li key={i}><TopicSource {...p} name={p.producerName} id={p.producerName} /></li>))}
          </ul>
        </Panel>
        <Panel header={this.graphPanelHeader(showByteRate)} className="topic-detail-overview-graphs">
          <div className="topic-graph">
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
        </Panel>
        <Panel header="Consumers">
          <ul className="pt-list pt-list-unstyled">
          {subscriptions && subscriptions.map((s, i) => (<li key={i}><TopicSource {...s} id={s.id!} /></li>))}
          </ul>
        </Panel>
      </section>
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
}, metricsActions)(TopicDetailOverview)

export default withGraphFilters(() => 'topic-metrics')(connected)
