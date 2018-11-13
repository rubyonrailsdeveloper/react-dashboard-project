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
// import ContainersTable from 'src/components/Tables/Containers/ContainerTable'
import { Container } from 'src/store/container/container-model'
import { getContainerList } from 'src/store/container/container-reducers'
import { ContainerFields, makeContainersPager } from 'src/store/container/container-views'
import * as nodeActions from 'src/store/node/node-actions'
import { getNodeListIsLoading } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'

type Actions = typeof nodeActions

interface ConnectProps extends Actions {
  containers: Container[] | null
  totalContainers: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps

interface ContainerListProps extends ConnectProps, OwnProps {}

class ContainerList extends React.Component<ContainerListProps> {
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
    //   totalContainers,
    //   containers,
    // } = this.props

    return (
      <ListSceneTpl menu={<ClusterNavTree />} breadcrumbs={<BreadcrumbsPageItem name="Containers" />} >
        <ComingSoon pageName="containers" />
      </ListSceneTpl>
      // <ListSceneTpl menu={<ClusterNavTree />} breadcrumbs={<BreadcrumbsPageItem name="Containers" />} >
      //   <ContainersTable
      //     data={containers}
      //     onSortChange={onSortChange}
      //     sortField={sortField}
      //     sortOrder={sortOrder}
      //     isLoading={isLoading}
      //   />
      //   <Pager
      //     currentPage={page}
      //     perPage={perPage}
      //     totalSize={totalContainers}
      //     hrefBuilder={pagerHrefBuilder}
      //     onPageJump={onPageJump}
      //   />
      // </ListSceneTpl>
    )
  }
}

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: ContainerFields.name.id,
})(
  connect(() => {
    const paginate = makeContainersPager()

    return (state: State, ownProps: OwnProps) => {
      const allContainers = getContainerList(state)

      return {
        containers: paginate(allContainers, ownProps),
        totalContainers: allContainers.length,
        isLoading: getNodeListIsLoading(state),
      }
    }
  }, nodeActions)(ContainerList)
)
