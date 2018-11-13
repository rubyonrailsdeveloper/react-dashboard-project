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
import NodeDashboardMetrics from 'src/scenes/NodeDetail/NodeDashboardMetrics'
import { PhysicalEntityTag } from 'src/store/constants'
import { Container } from 'src/store/container/container-model'
import { makeGetContainersByNode } from 'src/store/container/container-reducers'
import * as Actions from 'src/store/metrics/metrics-actions'
import { Node } from 'src/store/node/node-model'
import { getNodeIsLoading, makeGetNode } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'
import { unfilterableClass } from 'src/util/classes'

type OwnProps = RouteComponentProps<EntityParams> & TagFilterInjectedProps

interface ConnectProps {
  node: Node | null
  NodeIsLoading: boolean
  containers: Container[]
}

type metricActions = typeof Actions

type NodeDashboardProps = OwnProps & ConnectProps & metricActions

class NodeDashboard extends React.Component<NodeDashboardProps> {
  render() {
    const { node, NodeIsLoading, containers, tag } = this.props

    return (
      <div className="entity-dashboard node-dashboard">
        <div className="entity-dashboard-content">
          <div className="dashboard-summary">
            {containers && <SummaryCard header="All Nodes" healthSummary={containers} />}
            {containers && (
              <SummaryCard
                className={unfilterableClass(tag && tag !== PhysicalEntityTag.STORAGE)}
                header={
                  <Tag className={Classes.MINIMAL}>
                    <Icon iconName={Icons.STORAGE} /> Storage
                  </Tag>
                }
                healthSummary={containers.filter(
                  c => c.tags && c.tags.includes(PhysicalEntityTag.STORAGE)
                )}
              />
            )}
            {containers && (
              <SummaryCard
                className={unfilterableClass(tag && tag !== PhysicalEntityTag.COMPUTE)}
                header={
                  <Tag className={Classes.MINIMAL}>
                    <Icon iconName={Icons.COMPUTE} /> Compute
                  </Tag>
                }
                healthSummary={containers.filter(
                  c => c.tags && c.tags.includes(PhysicalEntityTag.COMPUTE)
                )}
              />
            )}
            {containers && (
              <SummaryCard
                className={unfilterableClass(tag && tag !== PhysicalEntityTag.MESSAGING)}
                header={
                  <Tag className={Classes.MINIMAL}>
                    <Icon iconName={Icons.MESSAGING} /> Messaging
                  </Tag>
                }
                healthSummary={containers.filter(
                  c => c.tags && c.tags.includes(PhysicalEntityTag.MESSAGING)
                )}
              />
            )}
          </div>
          <div className="dashboard-stats">
            <DashboardStatUsage
              title="CPU Usage"
              used={node && node.resources.used.cpu}
              quota={node && node.resources.limits.cpu}
              unit="Cores"
              isLoading={!node && NodeIsLoading}
            />
            <DashboardByteUsage
              title="Memory Usage"
              used={node && node.resources.used.memory}
              quota={node && node.resources.limits.memory}
              isLoading={!node && NodeIsLoading}
            />
            <DashboardByteUsage
              title="Storage Usage"
              used={node && node.resources.used.storage}
              quota={node && node.resources.limits.storage}
              isLoading={!node && NodeIsLoading}
            />
          </div>
          {node && <NodeDashboardMetrics id={node.id} limits={node.resources.limits} />}
        </div>
      </div>
    )
  }
}

const connected = connect(() => {
  const getNode = makeGetNode()
  const getContainers = makeGetContainersByNode()

  return (state: State, { tag, ...props }: OwnProps) => {
    const params = props.match.params
    const filterParams = { node: params.id, tag, ...props }

    return {
      node: getNode(state, params),
      NodeIsLoading: getNodeIsLoading(state, params),
      containers: getContainers(state, filterParams),
    }
  }
}, Actions)(NodeDashboard)

export default withTagFilters()(connected)
