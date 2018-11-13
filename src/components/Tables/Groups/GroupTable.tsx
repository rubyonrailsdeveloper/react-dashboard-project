import { IconName } from '@blueprintjs/core'
import * as React from 'react'
import { createSelector } from 'reselect'
import DashboardSummary from 'src/components/DashboardSummary/DashboardSummary'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import GroupOperationCell from 'src/components/Tables/Groups/GroupOperationCell'
import MultiLineGeneralCell from 'src/components/Tables/MultiLineGeneralCell'
import NameCell from 'src/components/Tables/NameCell'
import RatesCell from 'src/components/Tables/RatesCell'
// import ResourcesUsageCell from 'src/components/Tables/ResourcesUsageCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import { Icons } from 'src/constants'
import { groupUrl } from 'src/routes'
import { Group } from 'src/store/group/group-model'
import { GroupFields } from 'src/store/group/group-views'
import { fieldColumn } from 'src/util/fields-descriptor'
import { formatFixedDecimal } from 'src/util/formating'

interface GroupsTableProps extends ExternalTableProps {
  data: Group[] | null
}

interface GroupView extends Group {
  resourcesPercentages: [{ label: string; value: number }]
  rates: [{ icon: IconName; value: string; secondary?: boolean; title: string }]
  throughput: [{ icon: IconName; value: string; secondary?: boolean; title: string }]
}

export default class GroupsTable extends React.Component<GroupsTableProps> {
  static columns: ColumnsDef<GroupView> = [
    fieldColumn(GroupFields.health, {
      Cell: ({ original: { health } }) => <HealthIndicator health={health} />,
      maxWidth: 95,
      minWidth: 85,
    }),
    fieldColumn(GroupFields.name, {
      Cell: ({ original: { name } }) => <NameCell name={name} />,
      minWidth: 55,
    }),
    fieldColumn(GroupFields.clusters, {
      Cell: ({ original: { clusters } }) => <MultiLineGeneralCell>{clusters}</MultiLineGeneralCell>,
      minWidth: 30,
    }),
    fieldColumn(GroupFields.namespaces, {
      Cell: ({ original: { namespaces } }) => <DashboardSummary healthSummary={namespaces} />,
      minWidth: 35,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(GroupFields.pipelines, {
      Cell: ({ original: { pipelines } }) => <DashboardSummary healthSummary={pipelines} />,
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(GroupFields.topics, {
      Cell: ({ original: { topics } }) => <DashboardSummary healthSummary={topics} />,
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    // TODO: [ofer: 21-Feb-2018] We might bring this when we can compute quotas/limits for Teams
    // fieldColumn(GroupFields.resources, {
    //   Cell: ({ original: { resourcesPercentages } }) => (
    //     <ResourcesUsageCell metrics={resourcesPercentages} />
    //   ),
    //   minWidth: 50,
    //   className: 'cell-align-right',
    //   headerClassName: 'cell-align-right',
    // }),
    fieldColumn(GroupFields.rates, {
      Cell: ({ original: { rates } }) => <RatesCell rates={rates} />,
      Header: (
        <div>
          Rate <br />
          <span className="header-unit">(events/sec)</span>
        </div>
      ),
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(GroupFields.throughput, {
      Cell: ({ original: { throughput } }) => <RatesCell rates={throughput} />,
      Header: (
        <div>
          Byte rate <br />
          <span className="header-unit">(bytes/sec)</span>
        </div>
      ),
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    {
      id: 'operations',
      Header: '',
      Cell: ({ original }) => (
        <GroupOperationCell id={original.id} canDelete={original.namespaces.length === 0} />
      ),
      width: 50,
    },
  ]

  formatData = createSelector(
    ({ data }: GroupsTableProps) => data,
    groups =>
      groups &&
      groups.map(group => ({
        ...group,
        resourcesPercentages: [
          { label: 'CPU', value: group.resources.used.cpu / group.resources.limits.cpu },
          {
            label: 'Storage',
            value: group.resources.used.storage / group.resources.limits.storage,
          },
          {
            label: 'Memory',
            value: group.resources.used.memory / group.resources.limits.memory,
          },
        ],
        rates: [
          { icon: Icons.INPUT, value: formatFixedDecimal(group.msgRateIn), title: 'In' },
          {
            icon: Icons.OUTPUT,
            value: formatFixedDecimal(group.msgRateOut),
            title: 'Out',
          },
          {
            icon: Icons.PROCESSING,
            value: formatFixedDecimal(group.msgRateProcessing),
            title: 'Processing',
            secondary: true,
          },
        ],
        throughput: [
          {
            icon: Icons.INPUT,
            value: formatFixedDecimal(group.msgThroughputIn),
            title: 'In',
          },
          {
            icon: Icons.OUTPUT,
            value: formatFixedDecimal(group.msgThroughputOut),
            title: 'Out',
          },
          {
            icon: Icons.PROCESSING,
            value: formatFixedDecimal(group.msgThroughputProcessing),
            title: 'Processing',
            secondary: true,
          },
        ],
      }))
  )

  render() {
    return (
      <Table
        hrefBuilder={groupUrl}
        columns={GroupsTable.columns}
        {...this.props}
        data={this.formatData(this.props)}
      />
    )
  }
}
