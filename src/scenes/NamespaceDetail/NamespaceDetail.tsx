import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import {
  EntityParams,
  namespaceGraphsUrl,
  namespacePipelinesUrl,
  namespaceTopicsUrl,
  namespaceUrl,
} from 'src/routes'
import EntityNav from 'src/scenes/EntityNav/EntityNav'
import EntityNavLink from 'src/scenes/EntityNav/EntityNavLink'
import NamespaceDashboard from 'src/scenes/NamespaceDetail/NamespaceDashboard'
import NamespaceGraphs from 'src/scenes/NamespaceDetail/NamespaceGraphs'
import NamespacePipelines from 'src/scenes/NamespaceDetail/NamespacePipelines'
import NamespaceTopics from 'src/scenes/NamespaceDetail/NamespaceTopics'
import * as namespaceActions from 'src/store/namespace/namespace-actions'

type NamespaceDetailProps = RouteComponentProps<EntityParams> & typeof namespaceActions

class NamespaceDetail extends React.Component<NamespaceDetailProps> {
  static requestDetail(props: NamespaceDetailProps) {
    const { triggerRequestNamespace, match: { params } } = props
    triggerRequestNamespace(params)
  }

  componentDidMount() {
    NamespaceDetail.requestDetail(this.props)
    this.props.triggerRequestNamespaceList()
  }

  componentWillReceiveProps(nextProps: NamespaceDetailProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      NamespaceDetail.requestDetail(nextProps)
    }
  }

  render() {
    const { match: { params } } = this.props

    return (
      <div className="namespace-detail">
        <EntityNav>
          <EntityNavLink exact to={namespaceUrl(params)}>
            Namespace Dashboard
          </EntityNavLink>
          <EntityNavLink to={namespacePipelinesUrl(params)}>Pipelines</EntityNavLink>
          <EntityNavLink to={namespaceTopicsUrl(params)}>Topics</EntityNavLink>
          <EntityNavLink to={namespaceGraphsUrl(params)}>Graphs</EntityNavLink>
        </EntityNav>
        <div className="entity-detail-content">
          <Switch>
            <Route exact path={namespaceUrl.route} component={NamespaceDashboard} />
            <Route exact path={namespacePipelinesUrl.route} component={NamespacePipelines} />
            <Route exact path={namespaceTopicsUrl.route} component={NamespaceTopics} />
            <Route exact path={namespaceGraphsUrl.route} component={NamespaceGraphs} />
            <Redirect to={namespaceUrl(params)} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default connect(null, { ...namespaceActions })(NamespaceDetail)
