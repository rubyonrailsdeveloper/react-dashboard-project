import maxBy from 'lodash-es/maxBy'
import * as React from 'react'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import DateCell from 'src/components/Tables/DateCell'
import InputsOutputsCell from 'src/components/Tables/InputsOutputsCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import ConsumerOperationCell from 'src/components/Tables/Topics/ConsumerOperationCell'
import TopicInsOutsNameCell from 'src/components/Tables/Topics/TopicInsOutsNameCell'
import { Health, healthSortWeight } from 'src/store/constants'
import { Consumer, ConsumerWithSubsData, TopicIOType } from 'src/store/topic/topic-model'
import { ConsumerFields } from 'src/store/topic/topic-views'
import { fieldColumn } from 'src/util/fields-descriptor'
import { formatFixedDecimal, formatInteger } from 'src/util/formating'

interface ConsumersTableProps extends ExternalTableProps {
  data: ConsumerWithSubsData[]
}

export default class ConsumersTable extends React.Component<ConsumersTableProps> {
  static columns: ColumnsDef<Consumer> = [
    {
      id: 'pivot',
      Header: '',
      className: 'pivot-cell',
      accessor: (c: ConsumerWithSubsData) => c.subscriptionId,
      PivotValue: () => ' ',
      width: 50,
    },
    fieldColumn(ConsumerFields.health, {
      Cell: ({ value }) => <HealthIndicator health={value} />,
      accessor: (c: ConsumerWithSubsData) => c.health,
      aggregate: (healths: Health[]) => maxBy(healths, h => healthSortWeight(h)),
      width: 25,
    }),
    fieldColumn(ConsumerFields.consumerName, {
      accessor: (c: ConsumerWithSubsData) => c.consumerName,
      aggregate: (names: [string], rows) => rows[0].pivot,
      Cell: ({ original, aggregated, value }) =>
        aggregated ? (
          value
        ) : (
          <TopicInsOutsNameCell name={original.consumerName} client={original.clientVersion} />
        ),
      sortable: true,
      minWidth: 40,
    }),
    fieldColumn(ConsumerFields.msgRateExpired, {
      accessor: (c: ConsumerWithSubsData) => c.subscription.msgRateExpired,
      aggregate: values => values[0],
      Cell: ({ value, aggregated }) =>
        aggregated && <InputsOutputsCell outputs={formatFixedDecimal(value)} />,
      Header: (
        <div>
          Expired rate <span className="header-unit">(events/sec)</span>
        </div>
      ),
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(ConsumerFields.msgBacklog, {
      accessor: (c: ConsumerWithSubsData) => c.subscription.msgBacklog,
      aggregate: values => values[0],
      Cell: ({ value, aggregated }) => aggregated && formatInteger(value),
      Header: (
        <div>
          Backlog <span className="header-unit">(events)</span>
        </div>
      ),
      minWidth: 20,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(ConsumerFields.msgRateOut, {
      accessor: (c: ConsumerWithSubsData) => c.msgRateOut,
      aggregate: (_, rows) => rows[0]._original.subscription.msgRateOut,
      Cell: ({ value }) => <InputsOutputsCell outputs={formatFixedDecimal(value)} />,
      Header: (
        <div>
          Rate <span className="header-unit">(events/sec)</span>
        </div>
      ),
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(ConsumerFields.msgThroughputOut, {
      accessor: (c: ConsumerWithSubsData) => c.msgThroughputOut,
      aggregate: (_, rows) => rows[0]._original.subscription.msgThroughputOut,
      Cell: ({ value }) => <InputsOutputsCell outputs={formatFixedDecimal(value)} />,
      Header: (
        <div>
          Byte rate <span className="header-unit">(bytes/sec)</span>
        </div>
      ),
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(ConsumerFields.msgRateRedeliver, {
      accessor: (c: ConsumerWithSubsData) => c.msgRateRedeliver,
      aggregate: (_, rows) => rows[0]._original.subscription.msgRateRedeliver,
      Cell: ({ value }) => <InputsOutputsCell outputs={formatFixedDecimal(value)} />,
      Header: (
        <div>
          Redelivery rate <span className="header-unit">(events/sec)</span>
        </div>
      ),
      minWidth: 30,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(ConsumerFields.unackedMessages, {
      accessor: (c: ConsumerWithSubsData) => c.unackedMessages,
      aggregate: (_, rows) => rows[0]._original.subscription.unackedMessages,
      Cell: ({ value }) => formatInteger(value),
      Header: (
        <div>
          Unacked msgs. <span className="header-unit">(events)</span>
        </div>
      ),
      minWidth: 20,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(ConsumerFields.connectedSince, {
      Cell: ({ original, aggregated }) =>
        !aggregated && <DateCell date={original.connectedSince} addSuffix={false} />,
      minWidth: 20,
    }),
    fieldColumn(ConsumerFields.address, {
      Cell: ({ original, aggregated }) => !aggregated && original.address,
      minWidth: 40,
    }),
    {
      id: 'operations',
      Header: '',
      Cell: ({ original, aggregated }: { original: ConsumerWithSubsData; aggregated: boolean }) =>
        !aggregated &&
        original.type === TopicIOType.PIPELINE && (
          <ConsumerOperationCell id={original.topicId} subscription={original.subscriptionId} />
        ),
      width: 50,
    },
  ]

  static pivot = ['pivot']

  render() {
    return <Table pivotBy={ConsumersTable.pivot} columns={ConsumersTable.columns} {...this.props} />
  }
}
