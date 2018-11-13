import * as React from 'react'
import IndexCell from 'src/components/Tables/IndexCell'
import NameCell from 'src/components/Tables/NameCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import UserOperationCell from 'src/components/Tables/Users/UserOperationCell'
import { User } from 'src/store/user/user-model'
import { UserFields } from 'src/store/user/user-views'
import { fieldColumn } from 'src/util/fields-descriptor'

interface UsersTableProps extends ExternalTableProps {
  data: User[] | null
}

export default class UsersTable extends React.Component<UsersTableProps> {
  static columns: ColumnsDef<User> = [
    fieldColumn(
      { id: 'index', label: '', sortIterator: null },
      {
        Cell: ({ original }) => <IndexCell name={original.name} />,
        minWidth: 4,
      }
    ),
    fieldColumn(UserFields.name, {
      Cell: ({ original }) => <NameCell name={original.name} />,
      minWidth: 40,
    }),
    fieldColumn(UserFields.email, {
      Cell: ({ original }) => original.email,
      minWidth: 20,
    }),
    {
      id: 'operations',
      Header: '',
      Cell: ({ original }) => <UserOperationCell id={original.id} />,
      width: 50,
    },
  ]

  render() {
    return <Table manual columns={UsersTable.columns} {...this.props} />
  }
}
