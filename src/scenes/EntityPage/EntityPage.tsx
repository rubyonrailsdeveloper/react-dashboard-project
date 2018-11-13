import * as React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router'
import ActionBar from 'src/components/ActionBar/ActionBar'
import ClusterActions from 'src/components/ActionBar/ClusterActions'
import ContainerActions from 'src/components/ActionBar/ContainerActions'
import GroupActions from 'src/components/ActionBar/GroupActions'
import NamespaceActions from 'src/components/ActionBar/NamespaceActions'
import NodeActions from 'src/components/ActionBar/NodeActions'
import PipelineActions from 'src/components/ActionBar/PipelineActions'
import TopicActions from 'src/components/ActionBar/TopicActions'
import ClusterDetailTable from 'src/components/EntityExplorer/ClusterDetailTable'
import ContainerDetailTable from 'src/components/EntityExplorer/ContainerDetailTable'
import GroupDetailTable from 'src/components/EntityExplorer/GroupDetailTable'
import NamespaceDetailTable from 'src/components/EntityExplorer/NamespaceDetailTable'
import NodeDetailTable from 'src/components/EntityExplorer/NodeDetailTable'
import PipelineEntityExplorer from 'src/components/EntityExplorer/PipelineEntityExplorer'
// import TopicDetailMap from 'src/components/EntityExplorer/TopicDetailMap'
import TopicDetailOverview from 'src/components/EntityExplorer/TopicDetailOverview'
import {
  clusterUrl,
  containerUrl,
  EntityParams,
  groupUrl,
  namespaceUrl,
  nodeUrl,
  pipelineUrl,
  topicUrl,
} from 'src/routes'
import ClusterDetail from 'src/scenes/ClusterDetail/ClusterDetail'
import ContainerDetail from 'src/scenes/ContainerDetail/ContainerDetail'
import GroupDetail from 'src/scenes/GroupDetail/GroupDetail'
import NamespaceDetail from 'src/scenes/NamespaceDetail/NamespaceDetail'
import NodeDetail from 'src/scenes/NodeDetail/NodeDetail'
import PipelineDetail from 'src/scenes/PipelineDetail/PipelineDetail'
import TopicDetail from 'src/scenes/TopicDetail/TopicDetail'
import { NestedId } from 'src/store/constants'

interface EntityPageProps extends RouteComponentProps<EntityParams> {}

class EntityPage extends React.Component<EntityPageProps> {
  topicDetail = this.detailFor(TopicDetailOverview, TopicActions, TopicDetail)
  pipelineDetail = this.detailFor(PipelineEntityExplorer, PipelineActions, PipelineDetail)
  namespaceDetail = this.detailFor(NamespaceDetailTable, NamespaceActions, NamespaceDetail)
  groupDetail = this.detailFor(GroupDetailTable, GroupActions, GroupDetail)
  clusterDetail = this.detailFor(ClusterDetailTable, ClusterActions, ClusterDetail)
  nodeDetail = this.detailFor(NodeDetailTable, NodeActions, NodeDetail)
  containerDetail = this.detailFor(ContainerDetailTable, ContainerActions, ContainerDetail)

  detailFor(
    DetailMap: React.ComponentType<NestedId>,
    Actions: React.ComponentType<NestedId> | string,
    Detail: React.ComponentType<RouteComponentProps<EntityParams>>
  ) {
    return (props: RouteComponentProps<EntityParams>): React.ReactNode => {
      const { id } = props.match.params

      return [
        <ActionBar key={0}>
          <Actions id={id} />
        </ActionBar>,
        <div key={1} className="entity-explorer">
          <DetailMap id={id} />
        </div>,
        <Detail key={2} {...props} />,
      ]
    }
  }

  render() {
    return (
      <div className="entity-page">
        <Switch>
          <Route path={topicUrl.route} render={this.topicDetail} />
          <Route path={pipelineUrl.route} render={this.pipelineDetail} />
          <Route path={namespaceUrl.route} render={this.namespaceDetail} />
          <Route path={groupUrl.route} render={this.groupDetail} />
          <Route path={clusterUrl.route} render={this.clusterDetail} />
          <Route path={nodeUrl.route} render={this.nodeDetail} />
          <Route path={containerUrl.route} render={this.containerDetail} />
        </Switch>
      </div>
    )
  }
}

export default EntityPage
