import { connect } from 'react-redux'
import {
  ClusterHolder,
  default as CommonClusterPanel,
} from 'src/components/ClusterPanel/internal/CommonClusterPanel'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
import withTopicFilters, { TopicFiltersInjectedProps } from 'src/components/Topic/withTopicFilters'
import { makeGetGroup } from 'src/store/group/group-reducers'
import { makeGetNamespace } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'
import { makeGetTopic } from 'src/store/topic/topic-reducers'

interface OwnProps {
  id: string
}

type TopicProps = OwnProps & TopicFiltersInjectedProps

const topicConnected = connect(() => {
  const getTopic = makeGetTopic()

  return (state: State, props: TopicProps) => ({
    clusterHolder: getTopic(state, props) as ClusterHolder,
  })
})(CommonClusterPanel)

export const TopicClusterPanel = withTopicFilters()(topicConnected)

type NamespaceProps = OwnProps & ClusterFiltersInjectedProps

const namespaceConnected = connect(() => {
  const getNamespace = makeGetNamespace()

  return (state: State, props: NamespaceProps) => ({
    clusterHolder: getNamespace(state, props) as ClusterHolder,
  })
})(CommonClusterPanel)

export const NamespaceClusterPanel = withClusterFilters()(namespaceConnected)

type GroupProps = OwnProps & ClusterFiltersInjectedProps

const groupConnected = connect(() => {
  const getGroup = makeGetGroup()

  return (state: State, props: GroupProps) => ({
    clusterHolder: getGroup(state, props) as ClusterHolder,
  })
})(CommonClusterPanel)

export const GroupClusterPanel = withClusterFilters()(groupConnected)
