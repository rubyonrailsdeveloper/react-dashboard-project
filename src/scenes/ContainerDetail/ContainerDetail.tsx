import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { containerProcessesUrl, containerUrl, EntityParams } from 'src/routes'
import ContainerDashboard from 'src/scenes/ContainerDetail/ContainerDashboard'
import ContainerProcesses from 'src/scenes/ContainerDetail/ContainerProcesses'
import EntityNav from 'src/scenes/EntityNav/EntityNav'
import EntityNavLink from 'src/scenes/EntityNav/EntityNavLink'
import * as containerActions from 'src/store/container/container-actions'
import * as nodeActions from 'src/store/node/node-actions'

type ContainerDetailProps = RouteComponentProps<EntityParams> &
  typeof containerActions &
  typeof nodeActions

class ContainerDetail extends React.Component<ContainerDetailProps> {
  static requestDetail(props: ContainerDetailProps) {
    const { triggerRequestContainer, match: { params } } = props
    triggerRequestContainer(params)
  }

  componentDidMount() {
    ContainerDetail.requestDetail(this.props)
    this.props.triggerRequestNodeList()
  }

  componentWillReceiveProps(nextProps: ContainerDetailProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      ContainerDetail.requestDetail(nextProps)
    }
  }

  render() {
    const { match: { params } } = this.props

    return (
      <div className="container-detail">
        <EntityNav>
          <EntityNavLink exact to={containerUrl(params)}>
            Container Dashboard
          </EntityNavLink>
          <EntityNavLink to={containerProcessesUrl(params)}>Processes</EntityNavLink>
        </EntityNav>
        <div className="entity-detail-content">
          <Switch>
            <Route exact path={containerUrl.route} component={ContainerDashboard} />
            <Route exact path={containerProcessesUrl.route} component={ContainerProcesses} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default connect(null, { ...containerActions, ...nodeActions })(ContainerDetail)
