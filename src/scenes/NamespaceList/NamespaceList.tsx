import { IconClasses } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import ListSceneTpl, { listUrlNamespace } from 'src/components/ListSceneTpl/ListSceneTpl'
import ListPrimaryAction from 'src/components/ListToolbar/ListPrimaryAction'
import NavTree from 'src/components/NavTree/NavTree'
import { NamespaceCreate } from 'src/components/Operations/NamespaceModify'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import NamespacesTable from 'src/components/Tables/Namespaces/NamespaceTable'
import { SortOrder } from 'src/constants'
import * as namespaceActions from 'src/store/namespace/namespace-actions'
import { Namespace } from 'src/store/namespace/namespace-model'
import { getNamespaceList, getNamespaceListIsLoading } from 'src/store/namespace/namespace-reducers'
import { makeNamespacesPager, NamespaceFields } from 'src/store/namespace/namespace-views'
import { State } from 'src/store/root-reducer'

type Actions = typeof namespaceActions

interface ConnectProps extends Actions {
  namespaces: Namespace[] | null
  totalNamespaces: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps

interface NamespaceListProps extends ConnectProps, OwnProps {}

interface NamespaceListState {
  dialogIsOpen: boolean
}

class NamespaceList extends React.Component<NamespaceListProps, NamespaceListState> {
  componentDidMount() {
    this.props.triggerRequestNamespaceList()
  }

  render() {
    const {
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      namespaces,
      onSortChange,
      sortField,
      sortOrder,
      isLoading,
      totalNamespaces,
    } = this.props

    return (
      <ListSceneTpl
        menu={<NavTree />}
        breadcrumbs={<BreadcrumbsPageItem name="Namespaces" />}
        actions={
          <NamespaceCreate>
            {({ onClick }) => (
              <ListPrimaryAction onClick={onClick} iconName={IconClasses.PLUS} />
            )}
          </NamespaceCreate>
        }>
        <NamespacesTable
          data={namespaces}
          onSortChange={onSortChange}
          sortField={sortField}
          sortOrder={sortOrder}
          isLoading={isLoading}
        />
        <Pager
          currentPage={page}
          perPage={perPage}
          totalSize={totalNamespaces}
          hrefBuilder={pagerHrefBuilder}
          onPageJump={onPageJump}
        />
      </ListSceneTpl>
    )
  }
}

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: NamespaceFields.health.id,
  sortOrder: SortOrder.DESC,
})(
  connect(() => {
    const paginate = makeNamespacesPager()

    return (state: State, ownProps: OwnProps) => {
      const allNamespaces = getNamespaceList(state)

      return {
        namespaces: paginate(allNamespaces, ownProps),
        totalNamespaces: allNamespaces.length,
        isLoading: getNamespaceListIsLoading(state),
      }
    }
  }, namespaceActions)(NamespaceList)
)
