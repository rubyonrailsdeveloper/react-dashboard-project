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
// import ClustersTable from 'src/components/Tables/Clusters/ClusterTable'
import * as clusterActions from 'src/store/cluster/cluster-actions'
import { Cluster } from 'src/store/cluster/cluster-model'
import { getClusterList, getClusterListIsLoading } from 'src/store/cluster/cluster-reducers'
import { ClusterFields, makeClusterPager } from 'src/store/cluster/cluster-views'
import { State } from 'src/store/root-reducer'

type Actions = typeof clusterActions

interface ConnectProps extends Actions {
  clusters: Cluster[] | null
  totalClusters: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps

interface ClusterListProps extends ConnectProps, OwnProps {}

class ClusterList extends React.Component<ClusterListProps> {
  componentDidMount() {
    this.props.triggerRequestClusterList()
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
    //   totalClusters,
    //   clusters,
    // } = this.props

    return (
      <ListSceneTpl menu={<ClusterNavTree />} breadcrumbs={<BreadcrumbsPageItem name="Clusters" />} >
        <ComingSoon pageName="clusters" />
      </ListSceneTpl>
      // <ListSceneTpl menu={<ClusterNavTree />} breadcrumbs={<BreadcrumbsPageItem name="Clusters" />} >
      //   <ClustersTable
      //     data={clusters}
      //     onSortChange={onSortChange}
      //     sortField={sortField}
      //     sortOrder={sortOrder}
      //     isLoading={isLoading}
      //   />
      //   <Pager
      //     currentPage={page}
      //     perPage={perPage}
      //     totalSize={totalClusters}
      //     hrefBuilder={pagerHrefBuilder}
      //     onPageJump={onPageJump}
      //   />
      // </ListSceneTpl>
    )
  }
}

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: ClusterFields.name.id,
})(
  connect(() => {
    const paginate = makeClusterPager()

    return (state: State, ownProps: OwnProps) => {
      const allClusters: Cluster[] = getClusterList(state)

      return {
        clusters: paginate(allClusters, ownProps),
        totalClusters: allClusters.length,
        isLoading: getClusterListIsLoading(state),
      }
    }
  }, clusterActions)(ClusterList)
)
