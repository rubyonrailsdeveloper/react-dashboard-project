import { IconClasses } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import withClusterFilters from 'src/components/ClusterPanel/withClusterFilters'
import { ClusterFiltersInjectedProps } from 'src/components/ClusterPanel/withClusterFilters'
import { listUrlNamespace } from 'src/components/ListSceneTpl/ListSceneTpl'
import CommonListToolbar from 'src/components/ListToolbar/CommonListToolbar'
import ListPrimaryAction from 'src/components/ListToolbar/ListPrimaryAction'
import { NamespaceCreate } from 'src/components/Operations/NamespaceModify'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import NamespacesTable from 'src/components/Tables/Namespaces/NamespaceTable'
import { EntityParams } from 'src/routes'
import { makeGetGroupNamespaces } from 'src/store/group/group-reducers'
import * as namespaceActions from 'src/store/namespace/namespace-actions'
import { triggerRequestNamespaceList } from 'src/store/namespace/namespace-actions'
import { Namespace } from 'src/store/namespace/namespace-model'
import { getNamespaceListIsLoading } from 'src/store/namespace/namespace-reducers'
import { makeNamespacesPager, NamespaceFields } from 'src/store/namespace/namespace-views'
import { State } from 'src/store/root-reducer'

type Actions = typeof namespaceActions

interface ConnectProps extends Actions {
  namespaces: Namespace[]
  totalNamespaces: number
  isLoading: boolean
  triggerRequestNamespaces: typeof triggerRequestNamespaceList
}

type OwnProps = PaginationInjectedProps &
  RouteComponentProps<EntityParams> &
  ClusterFiltersInjectedProps

interface GroupNamespacesProps extends ConnectProps, OwnProps {}

class GroupNamespaces extends React.Component<GroupNamespacesProps> {
  triggerCreateNamespace = () => {
    // TODO
  }

  componentDidMount() {
    this.props.triggerRequestNamespaces()
  }

  render() {
    const {
      isLoading,
      match: { params: { id } },
      namespaces,
      onPageJump,
      onSortChange,
      page,
      pagerHrefBuilder,
      perPage,
      sortField,
      sortOrder,
      totalNamespaces,
    } = this.props

    return (
      <div>
        <CommonListToolbar
          actions={
            <NamespaceCreate parentId={id}>
              {({ onClick }) => (
                <ListPrimaryAction onClick={onClick} iconName={IconClasses.PLUS}>
                  Create namespace
                </ListPrimaryAction>
              )}
            </NamespaceCreate>
          }
        />
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
      </div>
    )
  }
}

const connected = connect(
  () => {
    const paginate = makeNamespacesPager()
    const getNamespaces = makeGetGroupNamespaces()

    return (state: State, { match: { params }, ...props }: OwnProps) => {
      const filterParams = { id: params.id, ...props }
      const allNamespaces = getNamespaces(state, filterParams)

      return {
        namespaces: paginate(allNamespaces, props),
        totalNamespaces: allNamespaces.length,
        isLoading: getNamespaceListIsLoading(state),
      }
    }
  },
  {
    triggerRequestNamespaces: triggerRequestNamespaceList,
  }
)(GroupNamespaces)

const filtered = withClusterFilters()(connected)

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: NamespaceFields.name.id,
})(filtered)
