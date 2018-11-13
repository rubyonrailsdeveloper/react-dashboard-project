import * as React from 'react'
import { connect } from 'react-redux'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import ComingSoon from 'src/components/ComingSoon/ComingSoon'
import ListSceneTpl, { listUrlNamespace } from 'src/components/ListSceneTpl/ListSceneTpl'
import ClusterNavTree from 'src/components/NavTree/ClusterNavTree'
// import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
// import NodesTable from 'src/components/Tables/Nodes/NodeTable'
import * as nodeActions from 'src/store/node/node-actions'
import { Node } from 'src/store/node/node-model'
import { getNodeList, getNodeListIsLoading } from 'src/store/node/node-reducers'
import { makeNodesPager, NodeFields } from 'src/store/node/node-views'
import { State } from 'src/store/root-reducer'

type Actions = typeof nodeActions

interface ConnectProps extends Actions {
  nodes: Node[] | null
  totalNodes: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps

interface NodeListProps extends ConnectProps, OwnProps {}

class NodeList extends React.Component<NodeListProps> {
  componentDidMount() {
    this.props.triggerRequestNodeList()
  }

  render() {
    // const {
    //   perPage,
    //   page,
    //   pagerHrefBuilder,
    //   onPageJump,
    //   onSortChange,
    //   sortField,
    //   sortOrder,
    //   isLoading,
    //   totalNodes,
    //   nodes,
    // } = this.props

    return (
      <ListSceneTpl menu={<ClusterNavTree />} breadcrumbs={<BreadcrumbsPageItem name="Nodes" />} >
        <ComingSoon pageName="nodes" />
      </ListSceneTpl>
      // <ListSceneTpl menu={<ClusterNavTree />} breadcrumbs={<BreadcrumbsPageItem name="Nodes" />} >
      //   <NodesTable
      //     data={nodes}
      //     onSortChange={onSortChange}
      //     sortField={sortField}
      //     sortOrder={sortOrder}
      //     isLoading={isLoading}
      //   />
      //   <Pager
      //     currentPage={page}
      //     perPage={perPage}
      //     totalSize={totalNodes}
      //     hrefBuilder={pagerHrefBuilder}
      //     onPageJump={onPageJump}
      //   />
      // </ListSceneTpl>
    )
  }
}

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: NodeFields.name.id,
})(
  connect(() => {
    const paginate = makeNodesPager()

    return (state: State, ownProps: OwnProps) => {
      const allNodes = getNodeList(state)

      return {
        nodes: paginate(allNodes, ownProps),
        totalNodes: allNodes.length,
        isLoading: getNodeListIsLoading(state),
      }
    }
  }, nodeActions)(NodeList)
)
