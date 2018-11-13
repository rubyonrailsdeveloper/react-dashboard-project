import { MetricsQueryResult, MetricVector } from 'src/api/metrics'
import { MetricTransform } from 'src/components/Graph/internal/transforms'
import { NestedId } from 'src/store/constants'
import { encodeLabels, MetricFn, pipelineIdEncoder } from 'src/store/metrics/query-encoders'
import { Instance } from 'src/store/physical-plan/physical-plan-model'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'
import { Pipeline } from 'src/store/pipeline/pipeline-model'
import { assertUnreachable } from 'src/util/misc'

export enum MetricName {
  ACK_COUNT = 'heron_ack_count_default',
  BACKLOG = 'pulsar_msg_backlog',
  COMPLETE_LATENCY = 'heron_complete_latency_default',
  CPU_USED = 'heron_jvm_process_cpu_load',
  EMIT_COUNT = 'heron_emit_count_default',
  EXECUTE_COUNT = 'heron_execute_count_default',
  EXECUTE_LATENCY = 'heron_execute_latency_default',
  FAILURES_COUNT = 'heron_fail_count_default',
  FAILURE_LATENCY = 'heron_fail_latency_default',
  GC_PER_JVM_COUNT = 'heron_jvm_gc_collection_count',
  GC_TIME_PER_JVM = 'heron_jvm_gc_collection_time_ms',
  PROCESS_LATENCY = 'heron_process_latency_default',
  PENDING_ACKED_COUNT = 'heron_pending_acked_count',
  RAM_USED = 'heron_jvm_memory_heap_mb_used',
  UPTIME = 'heron_jvm_uptime_secs',
  RATE_IN = 'pulsar_rate_in',
  RATE_OUT = 'pulsar_rate_out',
  REPLICATION_RATE_IN = 'pulsar_replication_rate_in',
  REPLICATION_BACKLOG = 'pulsar_replication_backlog',
  REPLICATION_RATE_OUT = 'pulsar_replication_rate_out',
  STORAGE_SIZE = 'pulsar_storage_size',
  STORAGE_WRITE_RATE = 'pulsar_storage_write_rate',
  STORAGE_READ_RATE = 'pulsar_storage_read_rate',
  TIME_SPENT_UNDER_BACK_PRESSURE = 'heron_time_spent_back_pressure_by_compid',
  THROUGHPUT_IN = 'pulsar_throughput_in',
  THROUGHPUT_OUT = 'pulsar_throughput_out',
}

export interface MetricQuery<GroupType> extends NestedId {
  metric: MetricName
  fn?: MetricFn
  groupType?: GroupType
  groupValue?: string
  labels?: MetricLabel[]
  transform?: MetricTransform
}

export interface MetricsRangeQuery<GroupType> extends MetricQuery<GroupType> {
  step: Step
  timeRange: TimeRange
  completePayload?: boolean
  forceReload?: boolean
  transform?: MetricTransform
  autoRefresh?: {
    interval: number
  }
}

export enum Step {
  MIN = '1m',
  TWO_MINS = '2m',
  FOUR_MINS = '4m',
  EIGHT_MINS = '8m',
  SIXTEEN_MINS = '16m',
  TWO_HOURS = '2h',
  EIGHT_HOURS = '8h',
}

export enum TimeRange {
  THIRTY_MINUTES = '30 Mins',
  HOUR = '1 Hour',
  TWO_HOURS = '2 Hours',
  THREE_HOURS = '3 Hours',
  SIX_HOURS = '6 Hours',
  TWELVE_HOURS = '12 Hours',
  DAY = '1 Day',
  WEEK = '1 Week',
  MONTH = '1 Month',
}

export type MetricLabel = [string, string] | MetricLabelExpanded

export interface MetricLabelExpanded {
  name: string
  op: MetricOperator
  value: string
}

export enum MetricOperator {
  EQUALS = '=',
  NOT_EQUALS = '!=',
  REGEX_MATCH = '=~',
}

export enum PipelineMetricsGroup {
  COMPONENT = 'component',
  CONTAINER = 'container',
  INSTANCE = 'instance_id',
}

export enum NamespaceMetricsGroup {
  BROKER = 'component',
  CLUSTER = 'cluster',
}

export enum TopicMetricsGroup {
  BROKER = 'component',
  CLUSTER = 'cluster',
}

export enum RangeQueryMetricGroup {
  CONTAINER = 'kubernetes_pod_name',
  NAMESPACE = 'namespace',
  PIPELINE_NAMESPACE = 'kubernetes_namespace',
}

export enum StackQueryMetricGroup {
  // PIPELINE = 'cluster_role_env,topology',
  PIPELINE = 'topology',
  NAMESPACE = 'namespace',
  TOPIC = 'topic',
}

export const noMetricsMgrCompLabel: MetricLabel = {
  name: 'component',
  op: MetricOperator.NOT_EQUALS,
  value: '__metricsmgr__',
}

export const MetricsQueries = Object.freeze({
  CPU_USED_BY_TOPOLOGY: () =>
    `sum(${MetricName.CPU_USED}${encodeLabels(noMetricsMgrCompLabel)}) by (topology)`,
  RAM_USED_BY_TOPOLOGY: () =>
    `sum(${MetricName.RAM_USED}${encodeLabels(noMetricsMgrCompLabel)}) by (topology)`,
  EMIT_COUNT_BY_INSTANCE: ({ id }: NestedId) =>
    `${MetricName.EMIT_COUNT}${encodeLabels(['topology', pipelineIdEncoder(id)])}`,
  EXECUTE_LATENCY_BY_INSTANCE: ({ id }: NestedId) =>
    `${MetricName.EXECUTE_LATENCY}${encodeLabels(['topology', pipelineIdEncoder(id)])}`,
  ACK_COUNT_BY_INSTANCE: ({ id }: NestedId) =>
    `${MetricName.ACK_COUNT}${encodeLabels(['topology', pipelineIdEncoder(id)])}`,
  UPTIME_BY_INSTANCE: ({ id }: NestedId) =>
    `${MetricName.UPTIME}${encodeLabels(['topology', pipelineIdEncoder(id)])}`,
})

// Utility functions
export const metricsQueryResultVal = (vec: MetricVector): number => parseFloat(vec.value[1])

export const metricsQueryResultValBy = (
  metrics: MetricsQueryResult,
  predicate: (vec: MetricVector) => boolean
) => {
  const foundMetric = metrics.find(predicate)
  return foundMetric ? metricsQueryResultVal(foundMetric) : null
}

export const metricsQueryResultValByPipeline = (metrics: MetricsQueryResult, { name }: Pipeline) =>
  metricsQueryResultValBy(metrics, m => m.metric.topology === name)

export const metricsQueryResultValByInstance = (metrics: MetricsQueryResult, { id }: Instance) =>
  metricsQueryResultValBy(metrics, m => m.metric.instance_id === id)

export const physicalPlanFilterMetricsGroup = (filter: PhysicalPlanFilter) => {
  switch (filter) {
    case undefined:
    case null:
      return filter
    case PhysicalPlanFilter.CONTAINER:
      return PipelineMetricsGroup.CONTAINER
    case PhysicalPlanFilter.INSTANCE:
      return PipelineMetricsGroup.INSTANCE
    case PhysicalPlanFilter.COMPONENT:
      return PipelineMetricsGroup.COMPONENT
    default:
      return assertUnreachable(filter)
  }
}
