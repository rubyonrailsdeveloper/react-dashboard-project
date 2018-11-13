import * as React from 'react'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import InputsOutputsCell from 'src/components/Tables/InputsOutputsCell'
import MultiLineGeneralCell from 'src/components/Tables/MultiLineGeneralCell'
import NameCell from 'src/components/Tables/NameCell'
// import ResourcesUsageCell from 'src/components/Tables/ResourcesUsageCell'
import Table, { ColumnsDef, ExternalTableProps } from 'src/components/Tables/Table'
import TopicOperationCell from 'src/components/Tables/Topics/TopicOperationCell'
import { topicUrl } from 'src/routes'
import { Topic } from 'src/store/topic/topic-model'
import { topicPipelines } from 'src/store/topic/topic-views'
import { TopicFields } from 'src/store/topic/topic-views'
import { fieldColumn } from 'src/util/fields-descriptor'
import { formatFixedDecimal, formatInteger } from 'src/util/formating'

interface TopicsTableProps extends ExternalTableProps {
  data: Topic[] | null
}

export default class TopicsTable extends React.Component<TopicsTableProps> {
  static columns: ColumnsDef<Topic> = [
    fieldColumn(TopicFields.health, {
      Cell: ({ original }) => <HealthIndicator health={original.health} />,
      maxWidth: 95,
      minWidth: 85,
    }),
    fieldColumn(TopicFields.name, {
      Cell: ({ original }) => (
        <NameCell prefix1={original.group} prefix2={original.namespace} name={original.name} />
      ),
      minWidth: 45,
    }),
    fieldColumn(TopicFields.clusters, {
      Cell: ({ original }) => <MultiLineGeneralCell children={original.clusters} />,
      minWidth: 15,
    }),
    fieldColumn(TopicFields.pipelines, {
      Cell: ({ original }) => {
        const pipelines = topicPipelines(original)
        return (
          <InputsOutputsCell inputs={pipelines.inputs.length} outputs={pipelines.outputs.length} />
        )
      },
      minWidth: 20,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    // fieldColumn(TopicFields.storage, {
    //   Cell: ({ original }) => (
    //     <ResourcesUsageCell
    //       metrics={[{ label: '', value: original.storageUsed / original.storageSize || 0 }]}
    //     />
    //   ),
    //   minWidth: 20,
    //   className: 'cell-align-right',
    //   headerClassName: 'cell-align-right',
    // }),
    fieldColumn(TopicFields.averageMsgSize, {
      Cell: ({ original }) => formatFixedDecimal(original.averageMsgSize),
      Header: (
        <div>
          Average event size <span className="header-unit">(KB)</span>
        </div>
      ),
      minWidth: 20,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(TopicFields.backlog, {
      Cell: ({ original }) => formatInteger(original.msgBacklog),
      Header: (
        <div>
          Backlog <br />
          <span className="header-unit">(events)</span>
        </div>
      ),
      minWidth: 15,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(TopicFields.eventsRate, {
      Cell: ({ original }) => (
        <InputsOutputsCell
          inputs={formatFixedDecimal(original.msgRateIn)}
          outputs={formatFixedDecimal(original.msgRateOut)}
        />
      ),
      Header: (
        <div>
          Rate <br />
          <span className="header-unit">(events/sec)</span>
        </div>
      ),
      minWidth: 20,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    fieldColumn(TopicFields.byteRate, {
      Cell: ({ original }) => (
        <InputsOutputsCell
          inputs={formatFixedDecimal(original.msgThroughputIn)}
          outputs={formatFixedDecimal(original.msgThroughputOut)}
        />
      ),
      Header: (
        <div>
          Byte rate<br />
          <span className="header-unit">(bytes/sec)</span>
        </div>
      ),
      minWidth: 20,
      className: 'cell-align-right',
      headerClassName: 'cell-align-right',
    }),
    {
      id: 'operations',
      Header: '',
      Cell: ({ original }) => <TopicOperationCell id={original.id} />,
      width: 50,
    },
  ]

  render() {
    return <Table hrefBuilder={topicUrl} columns={TopicsTable.columns} {...this.props} />
  }
}
