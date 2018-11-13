import { IconName } from '@blueprintjs/core'
import * as React from 'react'
import { createSelector } from 'reselect'
import DashboardSummary from 'src/components/DashboardSummary/DashboardSummary'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import MultiLineGeneralCell from 'src/components/Tables/MultiLineGeneralCell'
import NameCell from 'src/components/Tables/NameCell'
import NamespaceOperationCell from 'src/components/Tables/Namespaces/NamespaceOperationCell'
import RatesCell from 'src/components/Tables/RatesCell'
// import ResourcesUsageCell from 'src/components/Tables/ResourcesUsageCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import { Icons } from 'src/constants'
import { namespaceUrl } from 'src/routes'
import { Namespace } from 'src/store/namespace/namespace-model'
import { NamespaceFields } from 'src/store/namespace/namespace-views'
import { fieldColumn } from 'src/util/fields-descriptor'
import { formatDecimal, formatFixedDecimal } from 'src/util/formating'

interface NamespacesTableProps extends ExternalTableProps {
  data: Namespace[] | null
}

interface NamespaceView extends Namespace {
  resourcesPercentages: [{ label: string; value: number }]
  rates: [{ icon: IconName; value: string; secondary?: boolean; title: string }]
  throughput: [{ icon: IconName; value: string; secondary?: boolean; title: string }]
}

export default class NamespacesTable extends React.Component<NamespacesTableProps> {
  static columns: ColumnsDef<NamespaceView> = [
    fieldColumn(NamespaceFields.health, {
      Cell: ({ original: { health } }) => <HealthIndicator health={health} />,
      maxWidth: 95,
      minWidth: 85,
    }),
    fieldColumn(NamespaceFields.name, {
      Cell: ({ original: { name, group } }) => <NameCell prefix1={group} name={name} />,
      minWidth: 60,
    }),
    fieldColumn(NamespaceFields.clusters, {
      Cell: ({ original: { clusters } }) => <MultiLineGeneralCell>{clusters}</MultiLineGeneralCell>,
      minWidth: 30,
    }),
    fieldColumn(NamespaceFields.pipelines, {
      Cell: ({ original: { pipelines } }) => <DashboardSummary healthSummary={pipelines} />,
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(NamespaceFields.topics, {
      Cell: ({ original: { topics } }) => <DashboardSummary healthSummary={topics} />,
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    // TODO: [ofer: 21-Feb-2018] We might bring this when we can compute quotas/limits for Namespaces
    // fieldColumn(NamespaceFields.resources, {
    //   Cell: ({ original: { resourcesPercentages } }) => (
    //     <ResourcesUsageCell metrics={resourcesPercentages} />
    //   ),
    //   minWidth: 50,
    //   className: 'cell-align-right',
    //   headerClassName: 'cell-align-right',
    // }),
    fieldColumn(NamespaceFields.msgBacklog, {
      Cell: ({ original: { msgBacklog } }) => formatDecimal(msgBacklog),
      Header: (
        <div>
          Backlog <br />
          <span className="header-unit">(events)</span>
        </div>
      ),
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(NamespaceFields.rates, {
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
    fieldColumn(NamespaceFields.throughput, {
      Cell: ({ original: { throughput } }) => <RatesCell rates={throughput} />,
      Header: (
        <div>
          Byte rate<br />
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
        <NamespaceOperationCell id={original.id} canDelete={original.pipelines.length === 0} />
      ),
      width: 50,
    },
  ]

  formatData = createSelector(
    ({ data }: NamespacesTableProps) => data,
    namespaces =>
      namespaces &&
      namespaces.map(namespace => ({
        ...namespace,
        resourcesPercentages: [
          { label: 'CPU', value: namespace.resources.used.cpu / namespace.resources.limits.cpu },
          {
            label: 'Storage',
            value: namespace.resources.used.storage / namespace.resources.limits.storage,
          },
          {
            label: 'Memory',
            value: namespace.resources.used.memory / namespace.resources.limits.memory,
          },
        ],
        rates: [
          { icon: Icons.INPUT, value: formatFixedDecimal(namespace.msgRateIn), title: 'In' },
          {
            icon: Icons.OUTPUT,
            value: formatFixedDecimal(namespace.msgRateOut),
            title: 'Out',
          },
          {
            icon: Icons.PROCESSING,
            value: formatFixedDecimal(namespace.msgRateProcessing),
            title: 'Processing',
            secondary: true,
          },
        ],
        throughput: [
          {
            icon: Icons.INPUT,
            value: formatFixedDecimal(namespace.msgThroughputIn),
            title: 'In',
          },
          {
            icon: Icons.OUTPUT,
            value: formatFixedDecimal(namespace.msgThroughputOut),
            title: 'Out',
          },
          {
            icon: Icons.PROCESSING,
            value: formatFixedDecimal(namespace.msgThroughputProcessing),
            title: 'Processing',
            secondary: true,
          },
        ],
      }))
  )

  render() {
    return (
      <Table
        hrefBuilder={namespaceUrl}
        columns={NamespacesTable.columns}
        {...this.props}
        data={this.formatData(this.props)}
      />
    )
  }
}
