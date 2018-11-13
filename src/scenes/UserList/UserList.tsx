// import { IconClasses } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import ComingSoon from 'src/components/ComingSoon/ComingSoon'
import ListSceneTpl, { listUrlNamespace } from 'src/components/ListSceneTpl/ListSceneTpl'
// import CommonListToolbar from 'src/components/ListToolbar/CommonListToolbar'
// import ListPrimaryAction from 'src/components/ListToolbar/ListPrimaryAction'
// import { UserCreate } from 'src/components/Operations/UserModify'
// import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
// import UsersTable from 'src/components/Tables/Users/UsersTable'
import { State } from 'src/store/root-reducer'
import * as userActions from 'src/store/user/user-actions'
import { User } from 'src/store/user/user-model'
import { getUserList, getUserListIsLoading } from 'src/store/user/user-reducers'
import { makeUserPager, UserFields } from 'src/store/user/user-views'

type Actions = typeof userActions

interface ConnectProps extends Actions {
  users: User[] | null
  totalUsers: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps

type UserListProps = ConnectProps & OwnProps

class UserList extends React.Component<UserListProps> {
  componentDidMount() {
    this.props.triggerRequestUserList()
  }

  render() {
    // const {
    //   isLoading,
    //   onPageJump,
    //   onSortChange,
    //   page,
    //   pagerHrefBuilder,
    //   perPage,
    //   sortField,
    //   sortOrder,
    //   totalUsers,
    //   users,
    // } = this.props

    return (
      <ListSceneTpl menu={null} breadcrumbs={<BreadcrumbsPageItem name="Users" />} >
        <ComingSoon pageName="users" />
      </ListSceneTpl>
      // <ListSceneTpl menu={null} breadcrumbs={<BreadcrumbsPageItem name="Users" />} >
      //   <CommonListToolbar
      //     actions={
      //       <UserCreate>
      //         {({ onClick }) => (
      //           <ListPrimaryAction onClick={onClick} iconName={IconClasses.PLUS}>
      //             Create user
      //           </ListPrimaryAction>
      //         )}
      //       </UserCreate>
      //     }
      //   />
      //   <UsersTable
      //     data={users}
      //     onSortChange={onSortChange}
      //     sortField={sortField}
      //     sortOrder={sortOrder}
      //     isLoading={isLoading}
      //   />
      //   <Pager
      //     currentPage={page}
      //     perPage={perPage}
      //     totalSize={totalUsers}
      //     hrefBuilder={pagerHrefBuilder}
      //     onPageJump={onPageJump}
      //   />
      // </ListSceneTpl>
    )
  }
}

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: UserFields.name.id,
})(
  connect(() => {
    const paginate = makeUserPager()

    return (state: State, ownProps: OwnProps) => {
      const allUsers = getUserList(state)

      return {
        users: paginate(allUsers, ownProps),
        totalUsers: allUsers.length,
        isLoading: getUserListIsLoading(state),
      }
    }
  }, userActions)(UserList)
)
