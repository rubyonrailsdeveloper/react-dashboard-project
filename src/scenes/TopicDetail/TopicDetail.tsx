import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import {
  EntityParams,
  topicConsumersUrl,
  topicGraphsUrl,
  topicProducersUrl,
  topicUrl,
} from 'src/routes'
import EntityNav from 'src/scenes/EntityNav/EntityNav'
import EntityNavLink from 'src/scenes/EntityNav/EntityNavLink'
import TopicConsumers from 'src/scenes/TopicDetail/TopicConsumers'
import TopicDashboard from 'src/scenes/TopicDetail/TopicDashboard'
import TopicGraphs from 'src/scenes/TopicDetail/TopicGraphs'
import TopicProducers from 'src/scenes/TopicDetail/TopicProducers'
import * as pipelineActions from 'src/store/pipeline/pipeline-actions'
import * as topicActions from 'src/store/topic/topic-actions'

type Actions = typeof topicActions & typeof pipelineActions

interface TopicDetailProps extends RouteComponentProps<EntityParams>, Actions {}

class TopicDetail extends React.Component<TopicDetailProps> {
  static requestDetail(props: TopicDetailProps) {
    const { triggerRequestTopic, match: { params } } = props
    triggerRequestTopic(params)
  }

  componentDidMount() {
    TopicDetail.requestDetail(this.props)
    this.props.triggerRequestPipelineList()
    this.props.triggerRequestTopicList()
  }

  componentWillReceiveProps(nextProps: TopicDetailProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      TopicDetail.requestDetail(nextProps)
    }
  }

  render() {
    const { match: { params } } = this.props

    return (
      <div className="entity-detail topic-detail">
        <EntityNav>
          <EntityNavLink exact to={topicUrl(params)}>
            Topic Dashboard
          </EntityNavLink>
          <EntityNavLink to={topicProducersUrl(params)}>Producers</EntityNavLink>
          <EntityNavLink to={topicConsumersUrl(params)}>Consumers</EntityNavLink>
          <EntityNavLink to={topicGraphsUrl(params)}>Graphs</EntityNavLink>
        </EntityNav>
        <div className="entity-detail-content">
          <Switch>
            <Route exact path={topicUrl.route} component={TopicDashboard} />
            <Route exact path={topicProducersUrl.route} component={TopicProducers} />
            <Route exact path={topicConsumersUrl.route} component={TopicConsumers} />
            <Route exact path={topicGraphsUrl.route} component={TopicGraphs} />
            <Redirect to={topicUrl(params)} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default connect(null, { ...pipelineActions, ...topicActions })(TopicDetail)
