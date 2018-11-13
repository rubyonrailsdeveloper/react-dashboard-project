import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { NodeTagPanel } from 'src/components/TagPanel/TagPanel'
import { EntityParams, nodeContainersUrl, nodeUrl } from 'src/routes'
import EntityNav from 'src/scenes/EntityNav/EntityNav'
import EntityNavLink from 'src/scenes/EntityNav/EntityNavLink'
import NodeContainers from 'src/scenes/NodeDetail/NodeContainers'
import NodeDashboard from 'src/scenes/NodeDetail/NodeDashboard'
import * as nodeActions from 'src/store/node/node-actions'

type NodeDetailProps = RouteComponentProps<EntityParams> & typeof nodeActions

class NodeDetail extends React.Component<NodeDetailProps> {
  static requestDetail(props: NodeDetailProps) {
    const { triggerRequestNode, match: { params } } = props
    triggerRequestNode(params)
  }

  componentDidMount() {
    NodeDetail.requestDetail(this.props)
    this.props.triggerRequestNodeList()
  }

  componentWillReceiveProps(nextProps: NodeDetailProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      NodeDetail.requestDetail(nextProps)
    }
  }

  render() {
    const { match: { params } } = this.props

    return (
      <div className="node-detail">
        <EntityNav>
          <EntityNavLink exact to={nodeUrl(params)}>
            Node Dashboard
          </EntityNavLink>
          <EntityNavLink to={nodeContainersUrl(params)}>Containers</EntityNavLink>
          {/*<EntityNavLink to={nodeGraphsUrl(params)}>Graphs</EntityNavLink>*/}
        </EntityNav>
        <div className="entity-detail-content">
          <Switch>
            <Route exact path={nodeUrl.route} component={NodeDashboard} />
            <Route exact path={nodeContainersUrl.route} component={NodeContainers} />
            {/*<Route exact path={nodeGraphsUrl.route} component={NodeGraphs} />*/}
          </Switch>
          <aside className="entity-detail-aside">
            <NodeTagPanel id={params.id} />
          </aside>
        </div>
      </div>
    )
  }
}

export default connect(null, nodeActions)(NodeDetail)
