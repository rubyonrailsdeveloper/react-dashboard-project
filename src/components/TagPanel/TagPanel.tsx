import { connect } from 'react-redux'
import CommonTagPanel, { NestedTags } from 'src/components/TagPanel/internal/CommonTagPanel'
import withTagFilters, { TagFilterInjectedProps } from 'src/components/TagPanel/withTagFilters'
import { makeGetNode, makeGetNodesByCluster } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'

interface OwnProps {
  id: string
}

type NodeProps = OwnProps & TagFilterInjectedProps

const nodeConnected = connect(() => {
  const getNode = makeGetNode()

  return (state: State, props: NodeProps) => {
    const node = getNode(state, props)

    return {
      title: 'Filter by Container Type',
      nonFilterableTitle: 'Containers Type',
      allLabel: 'All container types',
      nestedTags: node && (node.containers as NestedTags),
    }
  }
})(CommonTagPanel)

export const NodeTagPanel = withTagFilters()(nodeConnected)

type ClusterProps = OwnProps & TagFilterInjectedProps

const clusterConnected = connect(() => {
  const getNodesByCluster = makeGetNodesByCluster()

  return (state: State, props: ClusterProps) => {
    const params = { cluster: props.id, ...props}
    const nodes = getNodesByCluster(state, params)

    return {
      title: 'Filter by Node Tag',
      nonFilterableTitle: 'Nodes Tag',
      allLabel: 'All tags',
      nestedTags: nodes && (nodes as NestedTags),
    }
  }
})(CommonTagPanel)

export const ClusterTagPanel = withTagFilters()(clusterConnected)
