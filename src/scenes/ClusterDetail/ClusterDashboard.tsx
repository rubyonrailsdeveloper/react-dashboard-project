import { Classes, Icon, Tag } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import DashboardByteUsage from 'src/components/DashboardStatUsage/DashboardByteUsage'
import DashboardStatUsage from 'src/components/DashboardStatUsage/DashboardStatUsage'
import SummaryCard from 'src/components/SummaryCard/SummaryCard'
import withTagFilters, { TagFilterInjectedProps } from 'src/components/TagPanel/withTagFilters'
import { Icons } from 'src/constants'
import { EntityParams } from 'src/routes'
import ClusterDashboardMetrics from 'src/scenes/ClusterDetail/ClusterDashboardMetrics'
import { Cluster } from 'src/store/cluster/cluster-model'
import { getClusterIsLoading, makeGetCluster } from 'src/store/cluster/cluster-reducers'
import { NestedId, PhysicalEntityTag } from 'src/store/constants'
import * as Actions from 'src/store/metrics/metrics-actions'
import { Node } from 'src/store/node/node-model'
import { getNodesByClusterIsLoading, makeGetNodesByCluster } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'
import { unfilterableClass } from 'src/util/classes'

type OwnProps = RouteComponentProps<EntityParams> & TagFilterInjectedProps & NestedId

interface ConnectProps {
  cluster: Cluster | null
  ClusterIsLoading: boolean
  nodes: Node[] | null
  nodeListIsLoading: boolean
}

type metricActions = typeof Actions

type ClusterDashboardProps = OwnProps & ConnectProps & metricActions

class ClusterDashboard extends React.Component<ClusterDashboardProps> {
  render() {
    const { cluster, ClusterIsLoading, nodes, tag } = this.props

    return (
      <div className="entity-dashboard cluster-dashboard">
        <div className="entity-dashboard-content">
          <div className={`dashboard-summary`}>
            {nodes && <SummaryCard header="All Nodes" healthSummary={nodes} />}
            {nodes && (
              <SummaryCard
                className={unfilterableClass(tag && tag !== PhysicalEntityTag.STORAGE)}
                header={
                  <Tag className={Classes.MINIMAL}>
                    <Icon iconName={Icons.STORAGE} /> Storage
                  </Tag>
                }
                healthSummary={nodes.filter(
                  n => n.tags && n.tags.includes(PhysicalEntityTag.STORAGE)
                )}
              />
            )}
            {nodes && (
              <SummaryCard
                className={unfilterableClass(tag && tag !== PhysicalEntityTag.COMPUTE)}
                header={
                  <Tag className={Classes.MINIMAL}>
                    <Icon iconName={Icons.COMPUTE} /> Compute
                  </Tag>
                }
                healthSummary={nodes.filter(
                  n => n.tags && n.tags.includes(PhysicalEntityTag.COMPUTE)
                )}
              />
            )}
            {nodes && (
              <SummaryCard
                className={unfilterableClass(tag && tag !== PhysicalEntityTag.MESSAGING)}
                header={
                  <Tag className={Classes.MINIMAL}>
                    <Icon iconName={Icons.MESSAGING} /> Messaging
                  </Tag>
                }
                healthSummary={nodes.filter(
                  n => n.tags && n.tags.includes(PhysicalEntityTag.MESSAGING)
                )}
              />
            )}
          </div>
          <div className={`dashboard-stats ${unfilterableClass(tag)}`}>
            <DashboardStatUsage
              title="CPU Usage"
              used={cluster && cluster.resources.used.cpu}
              quota={cluster && cluster.resources.limits.cpu}
              unit="Cores"
              isLoading={!cluster && ClusterIsLoading}
            />
            <DashboardByteUsage
              title="Memory Usage"
              used={cluster && cluster.resources.used.memory}
              quota={cluster && cluster.resources.limits.memory}
              isLoading={!cluster && ClusterIsLoading}
            />
            <DashboardByteUsage
              title="Storage Usage"
              used={cluster && cluster.resources.used.storage}
              quota={cluster && cluster.resources.limits.storage}
              isLoading={!cluster && ClusterIsLoading}
            />
          </div>
          {cluster && <ClusterDashboardMetrics id={cluster.id} />}
        </div>
      </div>
    )
  }
}

const connected = connect(() => {
  const getCluster = makeGetCluster()
  const getNodes = makeGetNodesByCluster()

  return (state: State, { tag, ...props }: OwnProps) => {
    const params = props.match.params
    const filterParams = { cluster: params.id, tag, ...props }

    return {
      cluster: getCluster(state, params),
      ClusterIsLoading: getClusterIsLoading(state, params),
      nodes: getNodes(state, filterParams),
      nodeListIsLoading: getNodesByClusterIsLoading(state, filterParams),
    }
  }
}, Actions)(ClusterDashboard)

export default withTagFilters()(connected)
