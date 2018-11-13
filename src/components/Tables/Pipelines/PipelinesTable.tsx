import { Icon, Tooltip } from '@blueprintjs/core'
import classes from 'classnames'
import capitalize from 'lodash-es/capitalize'
import * as React from 'react'
import { RowInfo } from 'react-table'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import DateCell from 'src/components/Tables/DateCell'
import InputsOutputsCell from 'src/components/Tables/InputsOutputsCell'
import MultiLineGeneralCell from 'src/components/Tables/MultiLineGeneralCell'
import NameCell from 'src/components/Tables/NameCell'
import PipelineOperationCell from 'src/components/Tables/Pipelines/PipelineOperationCell'
// import ResourcesUsageCell from 'src/components/Tables/ResourcesUsageCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import { pipelineStatusIcon } from 'src/constants'
import { pipelineUrl } from 'src/routes'
import { MetricName } from 'src/store/metrics/metrics-model'
import { Pipeline, PipelineStatus } from 'src/store/pipeline/pipeline-model'
import { PipelineFields, PipelineWithResources } from 'src/store/pipeline/pipeline-views'
import { fieldColumn } from 'src/util/fields-descriptor'

interface PipelinesTableProps extends ExternalTableProps {
  data: PipelineWithResources[] | null
}

export default class PipelinesTable extends React.Component<PipelinesTableProps> {
  static columns: ColumnsDef<PipelineWithResources> = [
    fieldColumn(PipelineFields.health, {
      Cell: ({ original }) => {
        return original.status === PipelineStatus.RUNNING ? (
          <HealthIndicator health={original.health} />
        ) : (
          <Tooltip content={capitalize(original.status)}>
            <div
              className={classes('status-indicator-icon', `is-${original.status.toLowerCase()}`)}
            >
              <Icon iconName={pipelineStatusIcon(original.status)} />
            </div>
          </Tooltip>
        )
      },
      maxWidth: 95,
      minWidth: 85,
    }),
    fieldColumn(PipelineFields.name, {
      Cell: ({ original }) => (
        <NameCell prefix1={original.group} prefix2={original.namespace} name={original.name} />
      ),
      minWidth: 60,
    }),
    fieldColumn(PipelineFields.cluster, {
      Cell: ({ original }) => <MultiLineGeneralCell children={original.clusters} />,
      minWidth: 15,
      Header: <div>Clusters</div>,
    }),
    fieldColumn(PipelineFields.topics, {
      Cell: ({ original }) => (
        <InputsOutputsCell inputs={original.sources.length} outputs={original.sinks.length} />
      ),
      Header: <div>Topics</div>,
      minWidth: 15,
    }),
    // fieldColumn(PipelineFields.usage, {
    //   Cell: ({ original: { resourceUsage } }) => {
    //     const metrics = PipelinesTable.resourceColumnDef.map(([label, metric]) => {
    //       const usage = resourceUsage[metric]

    //       return { label, value: usage && usage.used && usage.used / usage.limit }
    //     })

    //     return <ResourcesUsageCell metrics={metrics} />
    //   },
    //   minWidth: 30,
    // }),
    fieldColumn(PipelineFields.launched, {
      Cell: ({ original }) => <DateCell date={original.submissionTime} />,
      minWidth: 20,
    }),
    fieldColumn(PipelineFields.author, {
      Cell: ({ original }) => original.submissionUser,
      minWidth: 20,
    }),
    {
      id: 'operations',
      Header: '',
      Cell: ({ original }) => <PipelineOperationCell id={original.id} />,
      width: 50,
    },
  ]

  static readonly resourceColumnDef = [
    ['CPU', MetricName.CPU_USED],
    ['Memory', MetricName.RAM_USED],
  ]

  rowProps = (_: any, rowInfo?: RowInfo & { original?: Pipeline }) => ({
    className: rowInfo && rowInfo.original ? `is-${rowInfo.original.status.toLowerCase()}` : '',
  })

  render() {
    return (
      <Table
        manual
        hrefBuilder={pipelineUrl}
        columns={PipelinesTable.columns}
        getTrProps={this.rowProps}
        {...this.props}
      />
    )
  }
}
