import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import { EntityParams, pipelineContainersUrl, pipelineGraphsUrl, pipelineUrl } from 'src/routes'
import EntityNav from 'src/scenes/EntityNav/EntityNav'
import EntityNavLink from 'src/scenes/EntityNav/EntityNavLink'
import PipelineContainers from 'src/scenes/PipelineDetail/PipelineContainers'
import PipelineDashboard from 'src/scenes/PipelineDetail/PipelineDashboard'
import PipelineGraphs from 'src/scenes/PipelineDetail/PipelineGraphs'
import * as physicalPlanActions from 'src/store/physical-plan/physical-plan-actions'
import * as pipelineActions from 'src/store/pipeline/pipeline-actions'
import * as topicActions from 'src/store/topic/topic-actions'

type Actions = typeof pipelineActions & typeof physicalPlanActions & typeof topicActions

interface PipelineDetailProps extends RouteComponentProps<EntityParams>, Actions {}

class PipelineDetail extends React.Component<PipelineDetailProps> {
  static requestDetail(props: PipelineDetailProps) {
    const { triggerRequestPipeline, triggerRequestPhysicalPlan, match: { params } } = props
    triggerRequestPipeline(params)
    triggerRequestPhysicalPlan(params)
  }

  componentDidMount() {
    PipelineDetail.requestDetail(this.props)
    this.props.triggerRequestPipelineList()
    this.props.triggerRequestTopicList()
  }

  componentWillReceiveProps(nextProps: PipelineDetailProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      PipelineDetail.requestDetail(nextProps)
    }
  }

  render() {
    const { match: { params } } = this.props

    return (
      <div className="entity-detail pipeline-detail">
        <EntityNav>
          <EntityNavLink exact to={pipelineUrl(params)}>
            Pipeline Dashboard
          </EntityNavLink>
          <EntityNavLink to={pipelineContainersUrl(params)}>Instances</EntityNavLink>
          <EntityNavLink to={pipelineGraphsUrl(params)}>Graphs</EntityNavLink>
        </EntityNav>

        <div className="entity-detail-content">
          <Switch>
            <Route exact path={pipelineUrl.route} component={PipelineDashboard} />
            <Route exact path={pipelineContainersUrl.route} component={PipelineContainers} />
            <Route exact path={pipelineGraphsUrl.route} component={PipelineGraphs} />
            <Redirect to={pipelineUrl(params)} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default connect(null, { ...pipelineActions, ...physicalPlanActions, ...topicActions })(
  PipelineDetail
)
