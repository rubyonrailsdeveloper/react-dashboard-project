import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import NodesTable from 'src/components/Tables/Nodes/NodeTable'
import withTagFilters, { TagFilterInjectedProps } from 'src/components/TagPanel/withTagFilters'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { EntityParams } from 'src/routes'
import * as nodeActions from 'src/store/node/node-actions'
import { Node } from 'src/store/node/node-model'
import {
  getNodesByClusterIsLoading,
  makeGetNodesByCluster,
  makeGetNodesFiltered,
} from 'src/store/node/node-reducers'
import { makeNodesPager, NodeFields } from 'src/store/node/node-views'
import { State } from 'src/store/root-reducer'

type Actions = typeof nodeActions

interface ConnectProps extends Actions {
  nodes: Node[] | null
  totalNodes: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps & RouteComponentProps<EntityParams> & TagFilterInjectedProps

interface ClusterNodesProps extends ConnectProps, OwnProps {}

class ClusterNodes extends React.Component<ClusterNodesProps> {
  static fetchNodes({
    triggerRequestNodesByCluster,
    match: { params: { id } },
  }: ClusterNodesProps) {
    triggerRequestNodesByCluster({ cluster: id })
  }

  componentDidMount() {
    ClusterNodes.fetchNodes(this.props)
  }

  componentWillReceiveProps(nextProps: ClusterNodesProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      ClusterNodes.fetchNodes(nextProps)
    }
  }

  render() {
    const {
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      nodes,
      onSortChange,
      sortField,
      sortOrder,
      isLoading,
      totalNodes,
    } = this.props

    return (
      <div>
        <NodesTable
          data={nodes}
          onSortChange={onSortChange}
          sortField={sortField}
          sortOrder={sortOrder}
          isLoading={isLoading}
        />
        <Pager
          currentPage={page}
          perPage={perPage}
          totalSize={totalNodes}
          hrefBuilder={pagerHrefBuilder}
          onPageJump={onPageJump}
        />
      </div>
    )
  }
}

const connected = connect(() => {
  const paginate = makeNodesPager()
  const getNodes = makeGetNodesFiltered(makeGetNodesByCluster())

  return (state: State, { match: { params }, ...props }: OwnProps) => {
    const filterParams = { cluster: params.id, ...props }
    const allNodes = getNodes(state, filterParams)

    return {
      nodes: paginate(allNodes, props),
      totalNodes: allNodes ? allNodes.length : 0,
      isLoading: getNodesByClusterIsLoading(state, filterParams),
    }
  }
}, nodeActions)(ClusterNodes)

const filtered = withTagFilters()(connected)

export default withPagination(new UrlNamespace(''), {
  ...defaultPaginationParams,
  sortField: NodeFields.name.id,
})(filtered)
