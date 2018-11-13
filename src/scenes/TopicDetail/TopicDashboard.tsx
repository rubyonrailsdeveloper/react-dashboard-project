import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { TopicClusterPanel } from 'src/components/ClusterPanel/ClusterPanel'
import { ClusterFiltersInjectedProps } from 'src/components/ClusterPanel/withClusterFilters'
import { getTopicId } from 'src/components/Graph/internal/utils'
import StatUsagePanel from 'src/components/StatUsagePanel/StatUsagePanel'
import SummaryPanel from 'src/components/SummaryPanel/SummaryPanel'
import {
  default as withTopicFilters,
  TopicFiltersInjectedProps,
} from 'src/components/Topic/withTopicFilters'
import { EntityParams, pipelineListUrl } from 'src/routes'
import TopicDashboardMetrics from 'src/scenes/TopicDetail/TopicDashboardMetrics'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { MetricName, metricsQueryResultVal } from 'src/store/metrics/metrics-model'
import { getQueryIsLoading, getQueryResult } from 'src/store/metrics/metrics-reducer'
import { topicQueryEncoder } from 'src/store/metrics/query-encoders'
import { State } from 'src/store/root-reducer'
import { ConsumerWithSubsData, Topic, TopicIOType } from 'src/store/topic/topic-model'
import { customGetConsumers, getTopicIsLoading, makeGetTopic } from 'src/store/topic/topic-reducers'
import { unfilterableClass } from 'src/util/classes'

type Actions = typeof metricsActions

type OwnProps = RouteComponentProps<EntityParams> & TopicFiltersInjectedProps

type TopicDashboardProps = OwnProps & ConnectProps & Actions & ClusterFiltersInjectedProps

interface ConnectProps {
  topic: Topic | null
  loadingTopic: boolean
  storageUsage: number | null
  storageIsLoading: boolean
  consumers: ConsumerWithSubsData[]
}

class TopicDashboard extends React.Component<TopicDashboardProps> {
  static requestResourceUsageMetrics(props: TopicDashboardProps) {
    props.triggerQueryMetrics({ query: buildResourceUsageQuery(props) })
  }

  componentDidMount() {
    TopicDashboard.requestResourceUsageMetrics(this.props)
  }

  componentWillReceiveProps(nextProps: TopicDashboardProps) {
    const { match: { params: { id } } } = this.props

    if (nextProps.match.params.id !== id) {
      TopicDashboard.requestResourceUsageMetrics(nextProps)
    }
  }

  render() {
    const { topic, consumers, cluster } = this.props
    const id = getTopicId(this.props.topic) || ''
    const metrics = {
      storage: {
        limit: topic && topic.storageSize || 0,
        used: topic && topic.storageUsed || 0,
        type: 'storage'
      }
    }
    return (
      <div className="entity-dashboard topic-dashboard">
        <div className="entity-dashboard-content">
          <div className={`dashboard-summary dashboard-stats ${unfilterableClass(cluster)}`}>
            <SummaryPanel header="Input Pipelines" healthSummary={topic && topic.producers.filter(p => p.type === TopicIOType.PIPELINE)} to={pipelineListUrl()} />
            {/* <SummaryCard header="Partitions" healthSummary={topic && Object.values(topic.partitions)} /> */}
            {/* <SummaryCard header="Brokers" healthSummary={topic && topic.brokers} /> */}
            <SummaryPanel header="Output Pipelines" healthSummary={consumers && consumers.filter(c => c.type === TopicIOType.PIPELINE)} to={pipelineListUrl()} />
            <StatUsagePanel header="Storage" metric={metrics.storage} className="dashboard-metrics-panel" />
            <TopicClusterPanel id={id} />
          </div>
          {topic && (
            <TopicDashboardMetrics
              id={id}
              {...this.props}
            />
          )}
        </div>
      </div>
    )
  }
}
// TODO: chage for topic query encoder and add filters and hardcoded id
const buildResourceUsageQuery = ({ match: { params: { id } } }: OwnProps) =>
  topicQueryEncoder({ id: 'ads/us-central/default', metric: MetricName.STORAGE_SIZE })

const connected = connect(() => {
  const getTopic = makeGetTopic()
  const getConsumers = customGetConsumers(makeGetTopic())

  return (state: State, props: OwnProps) => {
    const params = props.match.params
    const memUsage = getQueryResult(state, buildResourceUsageQuery(props))

    return {
      topic: getTopic(state, params),
      // todo: add filters
      consumers: getConsumers(state, params),
      loadingTopic: getTopicIsLoading(state, params),
      storageUsage: memUsage && memUsage.length > 0 ? metricsQueryResultVal(memUsage[0]) : null,
      storageIsLoading: getQueryIsLoading(state, buildResourceUsageQuery(props)),
    }
  }
}, metricsActions)(TopicDashboard)

export default withTopicFilters()(connected)
