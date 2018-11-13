import * as React from 'react'
import { createSelector } from 'reselect'
import MultiLineGeneralCell from 'src/components/Tables/MultiLineGeneralCell'
import NameCell from 'src/components/Tables/NameCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
// import { Icons } from 'src/constants'
// import { streamFunctionUrl } from 'src/routes'
import { StreamFunction } from 'src/store/streamfunction/streamfunction-model'
import { StreamFunctionFields } from 'src/store/streamfunction/streamfunction-views'
import { fieldColumn } from 'src/util/fields-descriptor'

interface StreamFunctionsTableProps extends ExternalTableProps {
  data: StreamFunction[] | null
}

export default class StreamFunctionsTable extends React.Component<StreamFunctionsTableProps> {
  static columns: ColumnsDef<StreamFunction> = [
    fieldColumn(StreamFunctionFields.name, {
      Cell: ({ original: { name } }) => <NameCell name={name} />,
      minWidth: 55,
    }),
    fieldColumn(StreamFunctionFields.latency, {
      Cell: ({ original: { clusters } }) => <MultiLineGeneralCell>{clusters}</MultiLineGeneralCell>,
      minWidth: 30,
    }),
    fieldColumn(StreamFunctionFields.executeCount, {
      Cell: ({ original: { name } }) => <div>{name}[should be count]</div>,
      minWidth: 30,
    }),
    fieldColumn(StreamFunctionFields.createdOn, {
      Cell: ({ original: { name } }) => <div>[some date]</div>,
      minWidth: 30,
    }),
    fieldColumn(StreamFunctionFields.createdBy, {
      Cell: ({ original: { name } }) => <div>[user]</div>,
      minWidth: 30,
    })
  ]

  formatData = createSelector(
    ({ data }: StreamFunctionsTableProps) => data,
    groups =>
      groups &&
      groups.map(group => ({
        ...group,
      }))
  )

  render() {
    return (
      // TODO: uncomment 'hrefBuilder' when streamFunction details page is built out
      <Table
        // hrefBuilder={streamFunctionUrl}
        columns={StreamFunctionsTable.columns}
        {...this.props}
        data={this.formatData(this.props)}
      />
    )
  }
}
