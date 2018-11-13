import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { NamespaceClusterPanel } from 'src/components/ClusterPanel/ClusterPanel'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
// import DashboardByteUsage from 'src/components/DashboardStatUsage/DashboardByteUsage'
// import DashboardStatUsage from 'src/components/DashboardStatUsage/DashboardStatUsage'
import SummaryPanel from 'src/components/SummaryPanel/SummaryPanel'
import { EntityParams, pipelineListUrl, topicListUrl } from 'src/routes'
import NamespaceDashboardMetrics from 'src/scenes/NamespaceDetail/NamespaceDashboardMetrics'
import * as Actions from 'src/store/metrics/metrics-actions'
import { Namespace } from 'src/store/namespace/namespace-model'
import { getNamespaceIsLoading, makeGetNamespace } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'
import { unfilterableClass } from 'src/util/classes'

type OwnProps = RouteComponentProps<EntityParams> & ClusterFiltersInjectedProps

interface ConnectProps extends ClusterFiltersInjectedProps {
  namespace: Namespace | null
  namespaceIsLoading: boolean
}

type metricActions = typeof Actions

type NamespaceDashboardProps = OwnProps & ConnectProps & metricActions

class NamespaceDashboard extends React.Component<NamespaceDashboardProps> {
  render() {
    const { namespace, cluster } = this.props
    // const { namespace, cluster, namespaceIsLoading } = this.props
    const pipelines =
      namespace &&
      (cluster
        ? namespace.pipelines.filter(p => p.clusters.includes(cluster))
        : namespace.pipelines)
    const topics =
      namespace &&
      (cluster ? namespace.topics.filter(t => t.clusters.includes(cluster)) : namespace.topics)

    return (
      <div className="entity-dashboard namespace-dashboard">
        <div className="entity-dashboard-content">
          <div className={`dashboard-summary ${unfilterableClass(cluster)}`}>
            <SummaryPanel header="Pipelines" healthSummary={pipelines} to={pipelineListUrl()} />
            <SummaryPanel header="Topics" healthSummary={topics} to={topicListUrl()} />
            {namespace && <NamespaceClusterPanel id={namespace.id} />}
          </div>
          {/* <div className={`dashboard-stats ${unfilterableClass(cluster)}`}>
            <DashboardStatUsage
              title="CPU Usage"
              used={namespace && namespace.resources.used.cpu}
              quota={namespace && namespace.resources.limits.cpu}
              unit="Cores"
              isLoading={!namespace && namespaceIsLoading}
            />
            <DashboardByteUsage
              title="Memory Usage"
              used={namespace && namespace.resources.used.memory}
              quota={namespace && namespace.resources.limits.memory}
              isLoading={!namespace && namespaceIsLoading}
            />
            <DashboardByteUsage
              title="Storage Usage"
              used={namespace && namespace.resources.used.storage}
              quota={namespace && namespace.resources.limits.storage}
              isLoading={!namespace && namespaceIsLoading}
            />
          </div> */}
          {/*todo: remove this hack*/}
          {namespace && (
            <NamespaceDashboardMetrics
              id={[namespace.group, namespace.name].join('/')}
              {...this.props}
            />
          )}
        </div>
      </div>
    )
  }
}

const connected = connect(() => {
  const getNamespace = makeGetNamespace()

  return (state: State, props: OwnProps) => {
    const params = props.match.params

    return {
      namespace: getNamespace(state, params),
      namespaceIsLoading: getNamespaceIsLoading(state, params),
    }
  }
}, Actions)(NamespaceDashboard)

export default withClusterFilters()(connected)
