import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import DashboardByteUsage from 'src/components/DashboardStatUsage/DashboardByteUsage'
import DashboardStatUsage from 'src/components/DashboardStatUsage/DashboardStatUsage'
import SummaryCard from 'src/components/SummaryCard/SummaryCard'
import { EntityParams } from 'src/routes'
import ContainerDashboardMetrics from 'src/scenes/ContainerDetail/ContainerDashboardMetrics'
import { Container } from 'src/store/container/container-model'
import { getContainerIsLoading, makeGetContainer } from 'src/store/container/container-reducers'
import * as Actions from 'src/store/metrics/metrics-actions'
import { State } from 'src/store/root-reducer'

type OwnProps = RouteComponentProps<EntityParams>

interface ConnectProps {
  container: Container | null
  ContainerIsLoading: boolean
}

type metricActions = typeof Actions

type ContainerDashboardProps = OwnProps & ConnectProps & metricActions

class ContainerDashboard extends React.Component<ContainerDashboardProps> {
  render() {
    const { container, ContainerIsLoading } = this.props

    return (
      <div className="entity-dashboard container-dashboard">
        <div className="entity-dashboard-content">
          <div className={`dashboard-summary`}>
            {container &&
              container.processes && (
                <SummaryCard header="All Processes" healthSummary={container.processes} />
              )}
          </div>
          <div className="dashboard-stats">
            <DashboardStatUsage
              title="CPU Usage"
              used={(container && container.resources && container.resources.used.cpu) || null}
              quota={(container && container.resources && container.resources.limits.cpu) || null}
              unit="Cores"
              isLoading={!container || (!container.resources && ContainerIsLoading)}
            />
            <DashboardByteUsage
              title="Memory Usage"
              used={(container && container.resources && container.resources.used.memory) || null}
              quota={
                (container && container.resources && container.resources.limits.memory) || null
              }
              isLoading={!container && ContainerIsLoading}
            />
            <DashboardByteUsage
              title="Storage Usage"
              used={(container && container.resources && container.resources.used.storage) || null}
              quota={
                (container && container.resources && container.resources.limits.storage) || null
              }
              isLoading={!container && ContainerIsLoading}
            />
          </div>
          {container &&
            container.resources && (
              <ContainerDashboardMetrics id={container.name} limits={container.resources.limits} />
            )}
        </div>
      </div>
    )
  }
}

export default connect(() => {
  const getContainer = makeGetContainer()

  return (state: State, props: OwnProps) => {
    const params = props.match.params

    return {
      container: getContainer(state, params),
      ContainerIsLoading: getContainerIsLoading(state, params),
    }
  }
}, Actions)(ContainerDashboard)
