import isArray from 'lodash-es/isArray'
import {
  MetricLabel,
  MetricLabelExpanded,
  MetricOperator,
  MetricQuery,
  NamespaceMetricsGroup,
  noMetricsMgrCompLabel,
  PipelineMetricsGroup,
  RangeQueryMetricGroup,
  StackQueryMetricGroup,
  TopicMetricsGroup,
} from 'src/store/metrics/metrics-model'
import { assertUnreachable } from 'src/util/misc'

export enum MetricFn {
  AVG = 'avg',
  SUM = 'sum',
}

export type QueryEncoder<Q> = (query: Q) => string

export type MetricsQueryEncoder<G = any> = QueryEncoder<MetricQuery<G>>

export const encodeLabels = (...labels: MetricLabel[]) => {
  const encodedLabels = labels
    .map(label =>
      encodeLabel(
        isArray(label)
          ? {
              name: label[0],
              op: MetricOperator.EQUALS,
              value: label[1],
            }
          : label
      )
    )
    .join(',')

  return encodedLabels.length > 1 ? `{${encodedLabels}}` : ''
}

const encodeLabel = ({ name, op, value }: MetricLabelExpanded) => `${name}${op}"${value}"`

export const pipelineIdEncoder = (id: string) => (id.includes('/') ? id.split('/')[2] : id)

export const pipelineQueryEncoder: MetricsQueryEncoder<PipelineMetricsGroup> = ({
  fn = MetricFn.SUM,
  id,
  groupType,
  groupValue,
  metric,
  labels = [],
}) => {
  // Prometheus expects only the name of the pipeline/topic, we expect this to change in the
  // future to receive full IDs, hence the split workaround
  id = pipelineIdEncoder(id)
  const topologyLabel: [string, string] = ['topology', id]

  switch (groupType) {
    case undefined:
    case null:
      return `${fn}(${metric}${encodeLabels(topologyLabel, noMetricsMgrCompLabel, ...labels)})`

    case PipelineMetricsGroup.COMPONENT:
      if (!groupValue) throw new Error('missing component value')

      return `${fn}(${metric}${encodeLabels(topologyLabel, [groupType, groupValue], ...labels)})`

    case PipelineMetricsGroup.CONTAINER:
      if (!groupValue) throw new Error('missing container value')

      return `${fn}(${metric}${encodeLabels(
        topologyLabel,
        {
          name: PipelineMetricsGroup.INSTANCE,
          op: MetricOperator.REGEX_MATCH,
          value: `${groupValue}.*`,
        },
        noMetricsMgrCompLabel,
        ...labels
      )})`

    case PipelineMetricsGroup.INSTANCE:
      if (!groupValue) throw new Error('missing instance value')

      return `${metric}${encodeLabels(topologyLabel, [groupType, groupValue], ...labels)}`

    default:
      return assertUnreachable(groupType)
  }
}

export const namespaceQueryEncoder: MetricsQueryEncoder<NamespaceMetricsGroup> = ({
  id,
  groupType,
  groupValue,
  metric,
  fn = MetricFn.SUM,
  labels = [],
}) => {
  const namespaceLabel: [string, string] = ['namespace', id]
  switch (groupType) {
    case undefined:
    case null:
      return `${fn}(${metric}${encodeLabels(namespaceLabel, ...labels)})`

    case NamespaceMetricsGroup.BROKER:
      if (!groupValue) throw new Error('missing broker value')

      return `${fn}(${metric}${encodeLabels(namespaceLabel, [groupType, groupValue], ...labels)})`

    case NamespaceMetricsGroup.CLUSTER:
      if (!groupValue) throw new Error('missing cluster value')

      return `${fn}(${metric}${encodeLabels(
        namespaceLabel,
        {
          name: NamespaceMetricsGroup.CLUSTER,
          op: MetricOperator.REGEX_MATCH,
          value: `${groupValue}.*`,
        },
        ...labels
      )})`

    default:
      return assertUnreachable(groupType)
  }
}

export const topicQueryEncoder: MetricsQueryEncoder<TopicMetricsGroup> = ({
  id,
  groupType,
  groupValue,
  metric,
  fn = MetricFn.SUM,
  labels = [],
}) => {
  const topicLabel: [string, string] = ['topic', 'persistent://' + id]
  switch (groupType) {
    case undefined:
    case null:
      return `${fn}(${metric}${encodeLabels(topicLabel, ...labels)})`

    case TopicMetricsGroup.BROKER:
      if (!groupValue) throw new Error('missing broker value')

      return `${fn}(${metric}${encodeLabels(topicLabel, [groupType, groupValue], ...labels)})`

    case TopicMetricsGroup.CLUSTER:
      if (!groupValue) throw new Error('missing cluster value')

      return `${fn}(${metric}${encodeLabels(
        topicLabel,
        {
          name: TopicMetricsGroup.CLUSTER,
          op: MetricOperator.REGEX_MATCH,
          value: `${groupValue}.*`,
        },
        ...labels
      )})`

    default:
      return assertUnreachable(groupType)
  }
}

export const rangeQueryEncoder: MetricsQueryEncoder<RangeQueryMetricGroup> = ({
  groupType,
  groupValue,
  metric,
  fn = MetricFn.SUM,
  labels = [],
}) => {
  switch (groupType) {
    case undefined:
    case null:
      throw new Error('missing group type value')

    default:
      if (!groupValue) throw new Error('missing groupValue value')

      return `${fn}(${metric}${encodeLabels(
        noMetricsMgrCompLabel,
        {
          name: groupType,
          op: MetricOperator.REGEX_MATCH,
          value: `${groupValue}`,
        },
        ...labels
      )})`
  }
}

export const stackQueryEncoder: MetricsQueryEncoder<StackQueryMetricGroup> = ({
  id,
  metric,
  fn = MetricFn.SUM,
  labels = [],
}) => {
  switch (id) {
    case '':
    case undefined:
    case null:
      throw new Error('missing id')

    default:
      return `topk(10,${fn}(${metric}${encodeLabels(noMetricsMgrCompLabel, ...labels)}) by (${id}))`
  }
}
