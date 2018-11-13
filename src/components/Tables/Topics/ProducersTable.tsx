import maxBy from 'lodash-es/maxBy'
import * as React from 'react'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import DateCell from 'src/components/Tables/DateCell'
import InputsOutputsCell from 'src/components/Tables/InputsOutputsCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import TopicInsOutsNameCell from 'src/components/Tables/Topics/TopicInsOutsNameCell'
import { Health, healthSortWeight } from 'src/store/constants'
import { Producer } from 'src/store/topic/topic-model'
import { ProducerFields } from 'src/store/topic/topic-views'
import { fieldColumn } from 'src/util/fields-descriptor'
import { formatFixedDecimal } from 'src/util/formating'

interface ProducersTableProps extends ExternalTableProps {
  data: Producer[]
}

export default class ProducersTable extends React.Component<ProducersTableProps> {
  static pivot: [string] = ['pivot']

  static columns: ColumnsDef<Producer> = [
    {
      id: 'pivot',
      Header: '',
      className: 'pivot-cell',
      accessor: (p: Producer) => p.producerName,
      PivotValue: () => ' ',
      width: 50,
    },
    fieldColumn(ProducerFields.health, {
      Cell: ({ value }) => <HealthIndicator health={value} />,
      accessor: (p: Producer) => p.health,
      aggregate: (healths: Health[]) => maxBy(healths, h => healthSortWeight(h)),
      maxWidth: 45,
    }),
    fieldColumn(ProducerFields.producerName, {
      accessor: (p: Producer) => p.producerName,
      Cell: ({ original, aggregated, value }) =>
        aggregated ? (
          value
        ) : (
          <TopicInsOutsNameCell name={original.producerName} client={original.clientVersion} />
        ),
      aggregate: (names: [string]) => names[0],
      sortable: true,
      minWidth: 40,
    }),
    fieldColumn(ProducerFields.msgRateIn, {
      Cell: ({ original, aggregated }) =>
        !aggregated && <InputsOutputsCell inputs={formatFixedDecimal(original.msgRateIn)} />,
      Header: (
        <div>
          Rate<br />
          <span className="header-unit">(events/sec)</span>
        </div>
      ),
      minWidth: 30,
      className: 'cell-align-center',
      headerClassName: 'cell-align-center',
    }),
    fieldColumn(ProducerFields.msgThroughputIn, {
      Cell: ({ original, aggregated }) =>
        !aggregated && <InputsOutputsCell inputs={formatFixedDecimal(original.msgThroughputIn)} />,
      Header: (
        <div>
          Byte rate<br />
          <span className="header-unit">(bytes/sec)</span>
        </div>
      ),
      minWidth: 30,
      className: 'cell-align-center',
      headerClassName: 'cell-align-center',
    }),
    /* Removed column since data is not available on API
    fieldColumn(ProducerFields.latency, {
      Cell: ({ original, aggregated }) => !aggregated && `${original.latency / 1000}s`,
      Header: <div>Publish latency (ms)</div>,
      minWidth: 30,
    }),*/
    fieldColumn(ProducerFields.connectedSince, {
      Cell: ({ original, aggregated }) =>
        !aggregated && <DateCell date={original.connectedSince} addSuffix={false} />,
      minWidth: 20,
    }),
    fieldColumn(ProducerFields.address, {
      Cell: ({ original, aggregated }) => !aggregated && original.address,
      minWidth: 20,
    }),
  ]

  render() {
    return <Table pivotBy={ProducersTable.pivot} columns={ProducersTable.columns} {...this.props} />
  }
}
