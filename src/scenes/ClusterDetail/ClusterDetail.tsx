import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { ClusterTagPanel } from 'src/components/TagPanel/TagPanel'
import { clusterNodesUrl, clusterUrl, EntityParams } from 'src/routes'
import ClusterDashboard from 'src/scenes/ClusterDetail/ClusterDashboard'
import ClusterNodes from 'src/scenes/ClusterDetail/ClusterNodes'
import EntityNav from 'src/scenes/EntityNav/EntityNav'
import EntityNavLink from 'src/scenes/EntityNav/EntityNavLink'
import * as clusterActions from 'src/store/cluster/cluster-actions'

type ClusterDetailProps = RouteComponentProps<EntityParams> & typeof clusterActions

class ClusterDetail extends React.Component<ClusterDetailProps> {
  static requestDetail(props: ClusterDetailProps) {
    const { triggerRequestCluster, match: { params } } = props
    triggerRequestCluster(params)
  }

  componentDidMount() {
    ClusterDetail.requestDetail(this.props)
    this.props.triggerRequestClusterList()
  }

  componentWillReceiveProps(nextProps: ClusterDetailProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      ClusterDetail.requestDetail(nextProps)
    }
  }

  render() {
    const { match: { params } } = this.props

    return (
      <div className="cluster-detail">
        <EntityNav>
          <EntityNavLink exact to={clusterUrl(params)}>
            Cluster Dashboard
          </EntityNavLink>
          <EntityNavLink to={clusterNodesUrl(params)}>Nodes</EntityNavLink>
          {/*<EntityNavLink to={clusterGraphsUrl(params)}>Graphs</EntityNavLink>*/}
        </EntityNav>
        <div className="entity-detail-content">
          <Switch>
            <Route exact path={clusterUrl.route} component={ClusterDashboard} />
            <Route exact path={clusterNodesUrl.route} component={ClusterNodes} />
            {/*<Route exact path={clusterGraphsUrl.route} component={ClusterGraphs} />*/}
          </Switch>
          <aside className="entity-detail-aside">
            <ClusterTagPanel id={params.id} />
          </aside>
        </div>
      </div>
    )
  }
}

export default connect(null, clusterActions)(ClusterDetail)
