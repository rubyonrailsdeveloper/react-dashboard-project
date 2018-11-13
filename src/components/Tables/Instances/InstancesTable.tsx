import * as React from 'react'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import AsyncDataWrapper from 'src/components/Tables/AsyncDataWrapper'
import DurationCell from 'src/components/Tables/DurationCell'
import NameCell from 'src/components/Tables/NameCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import { Instance } from 'src/store/physical-plan/physical-plan-model'
import { InstanceWithMetricsFields } from 'src/store/physical-plan/physical-plan-views'
import { fieldColumn } from 'src/util/fields-descriptor'
import { formatFixedDecimal, formatInteger } from 'src/util/formating'

interface InstancesTableProps extends ExternalTableProps {
  data: Instance[]
}

export default class InstancesTable extends React.Component<InstancesTableProps> {
  static columns: ColumnsDef<Instance> = [
    fieldColumn(InstanceWithMetricsFields.health, {
      Cell: ({ original }) => <HealthIndicator health={original.health} />,
      maxWidth: 45,
    }),
    fieldColumn(InstanceWithMetricsFields.name, {
      Cell: ({ original }) => <NameCell name={original.id} />,
      minWidth: 40,
    }),
    fieldColumn(InstanceWithMetricsFields.emissions, {
      Header: (
        <div>
          Emit count <span className="header-unit">(events)</span>
        </div>
      ),
      Cell: ({ original: { emitCount } }) => (
        <AsyncDataWrapper {...emitCount}>{({ result }) => formatInteger(result)}</AsyncDataWrapper>
      ),
      minWidth: 15,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(InstanceWithMetricsFields.latency, {
      Header: (
        <div>
          Latency <span className="header-unit">(ms)</span>
        </div>
      ),
      Cell: ({ original: { latency } }) => (
        <AsyncDataWrapper {...latency}>
          {({ result }) => `${formatFixedDecimal(result)}`}
        </AsyncDataWrapper>
      ),
      minWidth: 15,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(InstanceWithMetricsFields.ackCount, {
      Header: (
        <div>
          Ack. count <span className="header-unit">(events)</span>
        </div>
      ),
      Cell: ({ original: { ackCount } }) => (
        <AsyncDataWrapper {...ackCount}>{({ result }) => formatInteger(result)}</AsyncDataWrapper>
      ),
      minWidth: 20,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(InstanceWithMetricsFields.uptime, {
      Cell: ({ original: { uptime } }) => (
        <AsyncDataWrapper {...uptime}>
          {({ result }) => <DurationCell duration={result} />}
        </AsyncDataWrapper>
      ),
      minWidth: 20,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    /*fieldColumn(InstanceWithMetricsFields.logfile, {
      Cell: ({ original }) => (
        <Tooltip content="Log File">
          <Button
            href={original.logfile}
            target="_blank"
            className={Classes.MINIMAL}
            iconName={IconClasses.ALIGN_LEFT}
          />
        </Tooltip>
      ),
      Header: '',
      width: 50,
    }),*/
    /*{
      id: 'operations',
      Header: '',
      Cell: ({ original }) => <ComponentOperationCell id={original.id} />,
      width: 50,
    },*/
  ]

  render() {
    return <Table columns={InstancesTable.columns} {...this.props} />
  }
}
