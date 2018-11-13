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
import { containerUrl } from 'src/routes'
import { Container } from 'src/store/container/container-model'
import { ContainerFields } from 'src/store/container/container-views'
import { fieldColumn } from 'src/util/fields-descriptor'

interface ContainersTableProps extends ExternalTableProps {
  data: Container[] | null
}

interface ContainerView extends Container {
  resourcesPercentages: [{ label: string; value: number }]
}

export default class ContainersTable extends React.Component<ContainersTableProps> {
  static columns: ColumnsDef<ContainerView> = [
    fieldColumn(ContainerFields.health, {
      Cell: ({ original: { health } }) => <HealthIndicator health={health} />,
      maxWidth: 45,
    }),
    fieldColumn(ContainerFields.name, {
      Cell: ({ original: { cluster, node, name } }) => <NameCell name={name} prefix1={cluster} prefix2={node}/>,
      minWidth: 60,
    }),
    fieldColumn(ContainerFields.tags, {
      Cell: ({ original: { tags } }) => (
        <MultiLineGeneralCell>
          {tags.map(tag => (
            <Tag key={tag} className={Classes.MINIMAL}>
              <Icon iconName={tagIcon(tag)} /> {capitalize(tag)}
            </Tag>
          ))}
        </MultiLineGeneralCell>
      ),
      minWidth: 20,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(ContainerFields.processes, {
      Cell: ({ original: { processes } }) =>
        processes && <DashboardSummary healthSummary={processes} />,
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    // fieldColumn(ContainerFields.resources, {
    //   Cell: ({ original: { resourcesPercentages } }) => (
    //     <ResourcesUsageCell metrics={resourcesPercentages} />
    //   ),
    //   minWidth: 40,
    //   className: 'cell-align-right',
    //   headerClassName: 'cell-align-right',
    // }),
    // Removed because the API can't return this field
    /*fieldColumn(ContainerFields.mountedVolumes, {
      Cell: ({ original: { mountedVolumes } }) => (
        <MultiLineGeneralCell children={mountedVolumes} />
      ),
      minWidth: 40,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),*/
  ]

  formatData = createSelector(
    ({ data }: ContainersTableProps) => data,
    containers =>
      containers &&
      containers.map(container => ({
        ...container,
        resourcesPercentages: container.resources
          ? [
              {
                label: 'CPU',
                value: container.resources.used.cpu / container.resources.limits.cpu,
              },
              {
                label: 'Storage',
                value: container.resources.used.storage / container.resources.limits.storage,
              },
              {
                label: 'Memory',
                value: container.resources.used.memory / container.resources.limits.memory,
              },
            ]
          : [],
      }))
  )

  render() {
    return (
      <Table
        hrefBuilder={containerUrl}
        columns={ContainersTable.columns}
        {...this.props}
        data={this.formatData(this.props)}
      />
    )
  }
}
