import * as React from 'react'
import { connect } from 'react-redux'
import DashboardClusterCard from 'src/components/DashboardClusterCard/DashboardClusterCard'
import DashboardTopTeams from 'src/components/DashboardTopTeams/DashboardTopTeams'
// import { dashboardMetrics } from 'src/components/Graph/metrics'
import Panel from 'src/components/Panel/Panel'
import StatUsagePanel from 'src/components/StatUsagePanel/StatUsagePanel'
import StIcon from 'src/components/StIcon/StIcon'
import SummaryPanel from 'src/components/SummaryPanel/SummaryPanel'
// import TopByPanel from 'src/components/TopByPanel/TopByPanel'
import {
  groupListUrl as teamListUrl,
  pipelineListUrl,
  topicListUrl,
} from 'src/routes'
import DashboardActionBar from 'src/scenes/Dashboard/DashboardActionBar'
import DashboardMetrics from 'src/scenes/Dashboard/DashboardMetrics'
import { getCurrentUser } from 'src/store/auth/auth-reducers'
import { Cluster } from 'src/store/cluster/cluster-model'
import { getClusterList, getClusterListIsLoading } from 'src/store/cluster/cluster-reducers'
import { dashboardRefreshRate } from 'src/store/constants'
import { Container } from 'src/store/container/container-model'
import { getContainerList } from 'src/store/container/container-reducers'
import { Group } from 'src/store/group/group-model'
import { getGroupList, getGroupListIsLoading } from 'src/store/group/group-reducers'
// import { StackQueryMetricGroup, TimeRange } from 'src/store/metrics/metrics-model'
import { Node } from 'src/store/node/node-model'
import { getNodeList, getNodeListIsLoading } from 'src/store/node/node-reducers'
import { Pipeline } from 'src/store/pipeline/pipeline-model'
import { getPipelineList, getPipelineListIsLoading } from 'src/store/pipeline/pipeline-reducers'
import { State } from 'src/store/root-reducer'
import { Topic } from 'src/store/topic/topic-model'
import { getTopicList, getTopicListIsLoading } from 'src/store/topic/topic-reducers'
import * as uiActions from 'src/store/ui/ui-actions'
import { User } from 'src/store/user/user-model'

// import PipelineDashboardMetrics from 'src/scenes/PipelineDetail/PipelineDashboardMetrics'

type Actions = typeof uiActions

interface ConnectProps extends Actions {
  clusters: Cluster[]
  clustersIsLoading: boolean
  groups: Group[]
  groupsIsLoading: boolean
  nodes: Node[]
  nodesIsLoading: boolean
  containers: Container[]
  pipelines: Pipeline[]
  pipelinesIsLoading: boolean
  topics: Topic[]
  topicsIsLoading: boolean
  user: User | null
}

class Dashboard extends React.Component<ConnectProps> {
  componentDidMount() {
    this.props.dashboardMounted()
  }

  componentWillUnmount() {
    this.props.dashboardUnmounted()
  }

  render() {
    const { clusters, clustersIsLoading, groups, pipelines, topics } = this.props

    const resources = clusters.reduce(
      (res, { resources: { limits, used } }) => {
        res.limits.cpu += limits.cpu
        res.limits.storage += limits.storage
        res.limits.memory += limits.memory
        res.used.cpu = used.cpu
        res.used.storage = used.storage
        res.used.memory = used.memory
        return res
      },
      {
        limits: {
          cpu: 0,
          storage: 0,
          memory: 0,
        },
        used: {
          cpu: 0,
          storage: 0,
          memory: 0,
        },
      }
    )

    const metrics = {
      cpu: {
        limit: resources.limits.cpu,
        used: resources.used.cpu,
        type: 'cpu'
      },
      memory: {
        limit: resources.limits.memory,
        used: resources.used.memory,
        type: 'memory'
      },
      storage: {
        limit: resources.limits.storage,
        used: resources.used.storage,
        type: 'storage'
      }
    }

    const timeRangeItems = [
      {text: 'Past 30 minutes', selected: true},
      {text: 'Past 1 hour', selected: false},
      {text: 'Past 3 hours', selected: false}
    ]

    return (
      <div className="dashboard">
        <DashboardActionBar refreshRate={dashboardRefreshRate} isLoading={clustersIsLoading}
          timeRangeItems={timeRangeItems} />
        <div className="dashboard-wrap">
          <section className="dashboard-section">
            <Panel header="Clusters" className="dashboard-clusters dashboard-section-item">
              {clusters.map((cluster) => {
                return (
                  <DashboardClusterCard key={cluster.id} cluster={cluster} />
                )
              })}
            </Panel>
            <SummaryPanel
              className="dashboard-teams dashboard-section-item"
              header="Teams"
              to={teamListUrl()}
              healthSummary={groups} />
            <div className="dashboard-metrics dashboard-section-item">
              <StatUsagePanel header="CPU" metric={metrics.cpu} className="dashboard-metrics-panel" />
              <StatUsagePanel header="Memory" metric={metrics.memory} className="dashboard-metrics-panel" />
              <StatUsagePanel header="Storage" metric={metrics.storage} className="dashboard-metrics-panel" />
            </div>
          </section>
          <section className="dashboard-section dashboard-topteams">
            <Panel header="Top teams by CPU usage" className="dashboard-topteams-panel">
              <DashboardTopTeams prop="cpu" groups={groups} />
            </Panel>
            <Panel header="Top teams by memory usage" className="dashboard-topteams-panel">
              <DashboardTopTeams prop="memory" groups={groups} />
            </Panel>
            <Panel header="Top teams by storage usage" className="dashboard-topteams-panel">
              <DashboardTopTeams prop="storage" groups={groups} />
            </Panel>
          </section>
          <section className="dashboard-section dashboard-section-streams">
            <Panel
              header={<div><StIcon className="st-icon-pipeline" />Pipelines</div>}
              className="dashboard-section-item dashboard-pipelines"
            >
              <SummaryPanel
                // className="dashboard-pipelines dashboard-section-item"
                header={null}
                to={pipelineListUrl()}
                healthSummary={pipelines} />
              <Panel header={null}>
                {/* TODO: Add graphs here */}
                {/* {pipelines[0] &&<PipelineDashboardMetrics pipeline={pipelines[0]} />} */}
              </Panel>
            </Panel>
            <Panel
              header={<div><StIcon className="st-icon-topic" />Topics</div>}
              className="dashboard-section-item dashboard-topics"
            >
              <SummaryPanel
                // className="dashboard-pipelines dashboard-section-item"
                header={null}
                to={topicListUrl()}
                healthSummary={topics} />
              <Panel header={null}>
                {/* TODO: Add graphs here */}
              </Panel>
            </Panel>
          </section>
          <DashboardMetrics />
            {/* <div className="dashboard-section-item dashboard-toppipelines">
              <TopByPanel limit={3}
                showLoadingIndicator={false}
                metric={dashboardMetrics.DASHBOARD_CPU_USED}
                groupBy={StackQueryMetricGroup.PIPELINE}
                timeRange={TimeRange.HOUR}
                refreshInterval={dashboardRefreshRate} />
            </div>
            <div className="dashboard-section-item dashboard-toptopics">
              <Panel header="Top Topics" />
            </div> */}
        </div>
        {/* <hr />
        <div className="dashboard-wrap">
          <DashboardMetrics />
        </div> */}
      </div>
    )
  }
}

export default connect(() => {
  return (state: State) => {
    return {
      clusters: getClusterList(state),
      clustersIsLoading: getClusterListIsLoading(state),
      groups: getGroupList(state),
      groupsIsLoading: getGroupListIsLoading(state),
      nodes: getNodeList(state),
      nodesIsLoading: getNodeListIsLoading(state),
      containers: getContainerList(state),
      pipelines: getPipelineList(state),
      pipelinesIsLoading: getPipelineListIsLoading(state),
      topics: getTopicList(state),
      topicsIsLoading: getTopicListIsLoading(state),
      user: getCurrentUser(state),
    }
  }
}, uiActions)(Dashboard)
