// import { IconClasses } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import ComingSoon from 'src/components/ComingSoon/ComingSoon'
import ListSceneTpl, { listUrlNamespace } from 'src/components/ListSceneTpl/ListSceneTpl'
// import ListPrimaryAction from 'src/components/ListToolbar/ListPrimaryAction'
// import NavTree from 'src/components/NavTree/NavTree'
// import { StreamFunctionCreate } from 'src/components/Operations/StreamFunctionModify/StreamFunctionModify'
// import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
// import StreamFunctionsTable from 'src/components/Tables/StreamFunctions/StreamFunctionTable'
import { State } from 'src/store/root-reducer'
import * as streamFunctionActions from 'src/store/streamfunction/streamfunction-actions'
import { StreamFunction } from 'src/store/streamfunction/streamfunction-model'
import { getStreamFunctionList, getStreamFunctionListIsLoading } from 'src/store/streamfunction/streamfunction-reducers'
import { makeStreamFunctionPager, StreamFunctionFields } from 'src/store/streamfunction/streamfunction-views'

type Actions = typeof streamFunctionActions

interface ConnectProps extends Actions {
  streamFunctions: StreamFunction[] | null
  totalStreamFunctions: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps

interface FunctionListProps extends ConnectProps, OwnProps {}

class FunctionList extends React.Component<FunctionListProps> {
  componentDidMount() {
    this.props.triggerRequestStreamFunctionList()
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
    //   totalStreamFunctions,
    //   streamFunctions,
    // } = this.props

    return (
      <ListSceneTpl menu={null} breadcrumbs={<BreadcrumbsPageItem name="Users" />} >
        <ComingSoon pageName="users" />
      </ListSceneTpl>
      // <ListSceneTpl
      //   menu={<NavTree />}
      //   breadcrumbs={<BreadcrumbsPageItem name="Functions" />}
      //   actions={
      //     <StreamFunctionCreate>
      //       {({ onClick }) => (
      //         <ListPrimaryAction onClick={onClick} iconName={IconClasses.PLUS} />
      //       )}
      //     </StreamFunctionCreate>
      //   }>
      //   <StreamFunctionsTable
      //     data={streamFunctions}
      //     onSortChange={onSortChange}
      //     sortField={sortField}
      //     sortOrder={sortOrder}
      //     isLoading={isLoading}
      //   />
      //   <Pager
      //     currentPage={page}
      //     perPage={perPage}
      //     totalSize={totalStreamFunctions}
      //     hrefBuilder={pagerHrefBuilder}
      //     onPageJump={onPageJump}
      //   />
      // </ListSceneTpl>
    )
  }
}

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: StreamFunctionFields.name.id,
})(
  connect(() => {
    const paginate = makeStreamFunctionPager()

    return (state: State, ownProps: OwnProps) => {
      const allStreamFunctions: StreamFunction[] = getStreamFunctionList(state)

      return {
        streamFunctions: paginate(allStreamFunctions, ownProps),
        totalStreamFunctions: allStreamFunctions.length,
        isLoading: getStreamFunctionListIsLoading(state),
      }
    }
  }, streamFunctionActions)(FunctionList)
)
