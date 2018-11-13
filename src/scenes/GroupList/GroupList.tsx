import { IconClasses } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import ListSceneTpl, { listUrlNamespace } from 'src/components/ListSceneTpl/ListSceneTpl'
import ListPrimaryAction from 'src/components/ListToolbar/ListPrimaryAction'
import NavTree from 'src/components/NavTree/NavTree'
import { GroupCreate } from 'src/components/Operations/GroupModify'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import GroupsTable from 'src/components/Tables/Groups/GroupTable'
import { SortOrder } from 'src/constants'
import * as groupActions from 'src/store/group/group-actions'
import { Group } from 'src/store/group/group-model'
import { getGroupList, getGroupListIsLoading } from 'src/store/group/group-reducers'
import { GroupFields, makeGroupPager } from 'src/store/group/group-views'
import { State } from 'src/store/root-reducer'

type Actions = typeof groupActions

interface ConnectProps extends Actions {
  groups: Group[] | null
  totalGroups: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps

interface GroupListProps extends ConnectProps, OwnProps {}

class GroupList extends React.Component<GroupListProps> {
  componentDidMount() {
    this.props.triggerRequestGroupList()
  }

  render() {
    const {
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      onSortChange,
      sortField,
      sortOrder,
      isLoading,
      totalGroups,
      groups,
    } = this.props
    return (
      <ListSceneTpl
        menu={<NavTree />}
        breadcrumbs={<BreadcrumbsPageItem name="Teams" />}
        actions={
          <GroupCreate>
            {({ onClick }) => (
              <ListPrimaryAction onClick={onClick} iconName={IconClasses.PLUS} />
            )}
          </GroupCreate>
        }>
        <GroupsTable
          data={groups}
          onSortChange={onSortChange}
          sortField={sortField}
          sortOrder={sortOrder}
          isLoading={isLoading}
        />
        <Pager
          currentPage={page}
          perPage={perPage}
          totalSize={totalGroups}
          hrefBuilder={pagerHrefBuilder}
          onPageJump={onPageJump}
        />
      </ListSceneTpl>
    )
  }
}

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: GroupFields.health.id,
  sortOrder: SortOrder.DESC,
})(
  connect(() => {
    const paginate = makeGroupPager()

    return (state: State, ownProps: OwnProps) => {
      const allGroups: Group[] = getGroupList(state)

      return {
        groups: paginate(allGroups, ownProps),
        totalGroups: allGroups.length,
        isLoading: getGroupListIsLoading(state),
      }
    }
  }, groupActions)(GroupList)
)
