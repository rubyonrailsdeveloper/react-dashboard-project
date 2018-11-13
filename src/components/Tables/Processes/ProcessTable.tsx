import * as React from 'react'
import { createSelector } from 'reselect'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import NameCell from 'src/components/Tables/NameCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import { Process } from 'src/store/container/container-model'
import { ProcessFields } from 'src/store/container/container-views'
import { fieldColumn } from 'src/util/fields-descriptor'

interface ProcessesTableProps extends ExternalTableProps {
  data: Process[] | null
}

interface ProcessView extends Process {
  resourcesPercentages: [{ label: string; value: number }]
}

export default class ProcessesTable extends React.Component<ProcessesTableProps> {
  static columns: ColumnsDef<ProcessView> = [
    fieldColumn(ProcessFields.health, {
      Cell: ({ original: { health } }) => <HealthIndicator health={health} />,
      maxWidth: 45,
    }),
    fieldColumn(ProcessFields.name, {
      Cell: ({ original: { name, id } }) => <NameCell name={name || id} />,
      minWidth: 60,
    }),
    fieldColumn(ProcessFields.id, {
      Cell: ({ original: { id } }) => id,
      minWidth: 60,
    }),
    // Removed because the API can't return this field
    /*fieldColumn(ProcessFields.resources, {
      Cell: ({ original: { resourcesPercentages } }) => (
        <ResourcesUsageCell metrics={resourcesPercentages} />
      ),
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),*/
  ]

  formatData = createSelector(
    ({ data }: ProcessesTableProps) => data,
    processes =>
      processes &&
      processes.map(process => ({
        ...process,
        resourcesPercentages: process.resources
          ? [
              { label: 'CPU', value: process.resources.used.cpu / process.resources.limits.cpu },
              {
                label: 'Storage',
                value: process.resources.used.storage / process.resources.limits.storage,
              },
              {
                label: 'Memory',
                value: process.resources.used.memory / process.resources.limits.memory,
              },
            ]
          : [],
      }))
  )

  render() {
    return (
      <Table columns={ProcessesTable.columns} {...this.props} data={this.formatData(this.props)} />
    )
  }
}
