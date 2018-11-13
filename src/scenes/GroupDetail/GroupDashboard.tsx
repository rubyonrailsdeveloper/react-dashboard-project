import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { GroupClusterPanel } from 'src/components/ClusterPanel/ClusterPanel'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
// import DashboardByteUsage from 'src/components/DashboardStatUsage/DashboardByteUsage'
// import DashboardStatUsage from 'src/components/DashboardStatUsage/DashboardStatUsage'
import SummaryPanel from 'src/components/SummaryPanel/SummaryPanel'
import { EntityParams, namespaceListUrl, pipelineListUrl, topicListUrl } from 'src/routes'
import GroupDashboardMetrics from 'src/scenes/GroupDetail/GroupDashboardMetrics'
import { Group } from 'src/store/group/group-model'
import { getGroupIsLoading, makeGetGroup } from 'src/store/group/group-reducers'
import * as Actions from 'src/store/metrics/metrics-actions'
import { State } from 'src/store/root-reducer'
// import { unfilterableClass } from 'src/util/classes'

type OwnProps = RouteComponentProps<EntityParams> & ClusterFiltersInjectedProps

interface ConnectProps extends ClusterFiltersInjectedProps {
  group: Group | null
  groupIsLoading: boolean
}

type metricActions = typeof Actions

type GroupDashboardProps = OwnProps & ConnectProps & metricActions

class GroupDashboard extends React.Component<GroupDashboardProps> {
  render() {
    const { group, cluster } = this.props
    // const { group, cluster, groupIsLoading } = this.props
    const namespaces =
      group &&
      (cluster ? group.namespaces.filter(n => n.clusters.includes(cluster)) : group.namespaces)
    const pipelines =
      group &&
      (cluster ? group.pipelines.filter(p => p.clusters.includes(cluster)) : group.pipelines)
    const topics =
      group && (cluster ? group.topics.filter(t => t.clusters.includes(cluster)) : group.topics)
    return (
      <div className="entity-dashboard group-dashboard">
        <div className="entity-dashboard-content">
          <div className={`dashboard-summary`}>
            <SummaryPanel header="Namespaces" healthSummary={namespaces} to={namespaceListUrl()} />
            <SummaryPanel header="Pipelines" healthSummary={pipelines} to={pipelineListUrl()} />
            <SummaryPanel header="Topics" healthSummary={topics} to={topicListUrl()} />
            {group && <GroupClusterPanel id={group.id} />}
          </div>
          {/* <div className={`dashboard-stats ${unfilterableClass(cluster)}`}>
            <DashboardStatUsage
              title="CPU Usage"
              used={group && group.resources.used.cpu}
              quota={group && group.resources.limits.cpu}
              unit="Cores"
              isLoading={!group && groupIsLoading}
            />
            <DashboardByteUsage
              title="Memory Usage"
              used={group && group.resources.used.memory}
              quota={group && group.resources.limits.memory}
              isLoading={!group && groupIsLoading}
            />
            <DashboardByteUsage
              title="Storage Usage"
              used={group && group.resources.used.storage}
              quota={group && group.resources.limits.storage}
              isLoading={!group && groupIsLoading}
            />
          </div> */}
          {group && <GroupDashboardMetrics id={group.id} {...this.props} />}
        </div>
      </div>
    )
  }
}

const connected = connect(() => {
  const getGroup = makeGetGroup()

  return (state: State, props: OwnProps) => {
    const params = props.match.params

    return {
      group: getGroup(state, params),
      groupIsLoading: getGroupIsLoading(state, params),
    }
  }
}, Actions)(GroupDashboard)

export default withClusterFilters()(connected)
