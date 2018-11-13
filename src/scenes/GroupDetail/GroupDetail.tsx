import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import { EntityParams, groupGraphsUrl, groupNamespacesUrl, groupUrl } from 'src/routes'
import EntityNav from 'src/scenes/EntityNav/EntityNav'
import EntityNavLink from 'src/scenes/EntityNav/EntityNavLink'
import GroupDashboard from 'src/scenes/GroupDetail/GroupDashboard'
import GroupGraphs from 'src/scenes/GroupDetail/GroupGraphs'
import GroupNamespaces from 'src/scenes/GroupDetail/GroupNamespaces'
import * as groupActions from 'src/store/group/group-actions'

type GroupDetailProps = RouteComponentProps<EntityParams> & typeof groupActions

class GroupDetail extends React.Component<GroupDetailProps> {
  static requestDetail(props: GroupDetailProps) {
    const { triggerRequestGroup, match: { params } } = props
    triggerRequestGroup(params)
  }

  componentDidMount() {
    GroupDetail.requestDetail(this.props)
    this.props.triggerRequestGroupList()
  }

  componentWillReceiveProps(nextProps: GroupDetailProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      GroupDetail.requestDetail(nextProps)
    }
  }

  render() {
    const { match: { params } } = this.props

    return (
      <div className="group-detail">
        <EntityNav>
          <EntityNavLink exact to={groupUrl(params)}>Team Dashboard</EntityNavLink>
          <EntityNavLink to={groupNamespacesUrl(params)}>Namespaces</EntityNavLink>
          <EntityNavLink to={groupGraphsUrl(params)}>Graphs</EntityNavLink>
        </EntityNav>
        <div className="entity-detail-content">
          <Switch>
            <Route exact path={groupUrl.route} component={GroupDashboard} />
            <Route exact path={groupNamespacesUrl.route} component={GroupNamespaces} />
            <Route exact path={groupGraphsUrl.route} component={GroupGraphs} />
            <Redirect to={groupUrl(params)} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default connect(null, groupActions)(GroupDetail)
