import { IconName } from '@blueprintjs/core'
import * as React from 'react'
import { createSelector } from 'reselect'
import StatusSummary from "src/components/DashboardSummary/StatusSummary"
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import NameCell from 'src/components/Tables/NameCell'
import RatesCell from 'src/components/Tables/RatesCell'
// import ResourcesUsageCell from 'src/components/Tables/ResourcesUsageCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import { Icons } from 'src/constants'
import { clusterUrl } from 'src/routes'
import { Cluster } from 'src/store/cluster/cluster-model'
import { ClusterFields } from 'src/store/cluster/cluster-views'
import { fieldColumn } from 'src/util/fields-descriptor'
import { formatDecimal, formatFixedDecimal } from 'src/util/formating'

interface ClustersTableProps extends ExternalTableProps {
  data: Cluster[] | null
}

interface ClusterView extends Cluster {
  resourcesPercentages: [{ label: string; value: number }]
  localRates: [{ icon: IconName; value: string; secondary?: boolean; title: string }]
  remoteRates: [{ icon: IconName; value: string; secondary?: boolean; title: string }]
}

export default class ClustersTable extends React.Component<ClustersTableProps> {
  static columns: ColumnsDef<ClusterView> = [
    fieldColumn(ClusterFields.health, {
      Cell: ({ original: { health } }) => <HealthIndicator health={health} />,
      maxWidth: 45,
    }),
    fieldColumn(ClusterFields.name, {
      Cell: ({ original: { name } }) => <NameCell name={name} />,
      minWidth: 50,
    }),
    fieldColumn(ClusterFields.nodesStatus, {
      Cell: ({ original: { nodesStatus } }) => <StatusSummary count={nodesStatus} />,
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(ClusterFields.containerStatus, {
      Cell: ({ original: { containerStatus } }) => <StatusSummary count={containerStatus} />,
      minWidth: 35,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    // fieldColumn(ClusterFields.resources, {
    //   Cell: ({ original: { resourcesPercentages } }) => (
    //     <ResourcesUsageCell metrics={resourcesPercentages} />
    //   ),
    //   minWidth: 45,
    // }),
    fieldColumn(ClusterFields.localMsgBacklog, {
      Cell: ({ original: { localMsgBacklog } }) => formatDecimal(localMsgBacklog),
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
      Header: (
        <div>
          Local backlog <br />
          <span className="header-unit">(events)</span>
        </div>
      ),
    }),
    fieldColumn(ClusterFields.remoteMsgBacklog, {
      Cell: ({ original: { remoteMsgBacklog } }) => formatDecimal(remoteMsgBacklog),
      minWidth: 55,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
      Header: (
        <div>
          Replication backlog<br />
          <span className="header-unit">(events)</span>
        </div>
      ),
    }),
    fieldColumn(ClusterFields.localRates, {
      Cell: ({ original: { localRates } }) => <RatesCell rates={localRates} />,
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
      Header: (
        <div>
          Local rate <br />
          <span className="header-unit">(events/sec)</span>
        </div>
      ),
    }),
    fieldColumn(ClusterFields.remoteRates, {
      Cell: ({ original: { remoteRates } }) => <RatesCell rates={remoteRates} />,
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
      Header: (
        <div>
          Replication rate <br />
          <span className="header-unit">(events/sec)</span>
        </div>
      ),
    }),
  ]

  formatData = createSelector(
    ({ data }: ClustersTableProps) => data,
    clusters =>
      clusters &&
      clusters.map(cluster => ({
        ...cluster,
        resourcesPercentages: [
          { label: 'CPU', value: cluster.resources.used.cpu / cluster.resources.limits.cpu },
          {
            label: 'Storage',
            value: cluster.resources.used.storage / cluster.resources.limits.storage,
          },
          {
            label: 'Memory',
            value: cluster.resources.used.memory / cluster.resources.limits.memory,
          },
        ],
        localRates: [
          {
            icon: Icons.INPUT,
            value: formatFixedDecimal(cluster.localRateIn),
            title: 'In',
          },
          {
            icon: Icons.OUTPUT,
            value: formatFixedDecimal(cluster.localRateOut),
            title: 'Out',
          },
          {
            icon: Icons.PROCESSING,
            value: formatFixedDecimal(cluster.localRateProcessing),
            title: 'Processing',
            secondary: true,
          },
        ],
        remoteRates: [
          { icon: Icons.INPUT, value: formatFixedDecimal(cluster.remoteRateIn), title: 'In' },
          {
            icon: Icons.OUTPUT,
            value: formatFixedDecimal(cluster.remoteRateOut),
            title: 'Out',
          },
          {
            icon: Icons.PROCESSING,
            value: formatFixedDecimal(cluster.remoteRateProcessing),
            title: 'Processing',
            secondary: true,
          },
        ],
      }))
  )

  render() {
    return (
      <Table
        hrefBuilder={clusterUrl}
        columns={ClustersTable.columns}
        {...this.props}
        data={this.formatData(this.props)}
      />
    )
  }
}
