import { Classes, Icon, Tag } from '@blueprintjs/core'
import capitalize from 'lodash-es/capitalize'
import * as React from 'react'
import { createSelector } from 'reselect'
import DashboardSummary from 'src/components/DashboardSummary/DashboardSummary'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import MultiLineGeneralCell from 'src/components/Tables/MultiLineGeneralCell'
import NameCell from 'src/components/Tables/NameCell'
// import ResourcesUsageCell from 'src/components/Tables/ResourcesUsageCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import { tagIcon } from 'src/constants'
import { nodeUrl } from 'src/routes'
import { Node } from 'src/store/node/node-model'
import { NodeFields } from 'src/store/node/node-views'
import { fieldColumn } from 'src/util/fields-descriptor'

interface NodesTableProps extends ExternalTableProps {
  data: Node[] | null
}

interface NodeView extends Node {
  resourcesPercentages: [{ label: string; value: number }]
}

export default class NodesTable extends React.Component<NodesTableProps> {
  static columns: ColumnsDef<NodeView> = [
    fieldColumn(NodeFields.health, {
      Cell: ({ original: { health } }) => <HealthIndicator health={health} />,
      maxWidth: 45,
    }),
    fieldColumn(NodeFields.name, {
      Cell: ({ original: { name, cluster } }) => <NameCell name={name} prefix1={cluster} />,
      minWidth: 60,
    }),
    fieldColumn(NodeFields.tags, {
      Cell: ({ original: { tags } }) => (
        <MultiLineGeneralCell>
          {tags.map(tag => (
            <Tag key={tag} className={Classes.MINIMAL}>
              <Icon iconName={tagIcon(tag)} /> {capitalize(tag)}
            </Tag>
          ))}
        </MultiLineGeneralCell>
      ),
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(NodeFields.containers, {
      Cell: ({ original: { containers } }) => <DashboardSummary healthSummary={containers} />,
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    // Removed because the API can't return this field
    /*fieldColumn(NodeFields.storageDevices, {
      Cell: ({ original: { storageDevices } }) => formatDecimal(storageDevices),
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),*/
    // fieldColumn(NodeFields.resources, {
    //   Cell: ({ original: { resourcesPercentages } }) => (
    //     <ResourcesUsageCell metrics={resourcesPercentages} />
    //   ),
    //   minWidth: 40,
    //   className: 'cell-align-right',
    //   headerClassName: 'cell-align-right',
    // }),
    fieldColumn(NodeFields.address, {
      Cell: ({ original: { address } }) => address,
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
  ]

  formatData = createSelector(
    ({ data }: NodesTableProps) => data,
    nodes =>
      nodes &&
      nodes.map(node => ({
        ...node,
        resourcesPercentages: [
          { label: 'CPU', value: node.resources.used.cpu / node.resources.limits.cpu },
          {
            label: 'Storage',
            value: node.resources.used.storage / node.resources.limits.storage,
          },
          {
            label: 'Memory',
            value: node.resources.used.memory / node.resources.limits.memory,
          },
        ],
      }))
  )

  render() {
    return (
      <Table
        hrefBuilder={nodeUrl}
        columns={NodesTable.columns}
        {...this.props}
        data={this.formatData(this.props)}
      />
    )
  }
}
