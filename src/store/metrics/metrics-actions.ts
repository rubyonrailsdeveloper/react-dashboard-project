import { MetricsQueryResult, RangeVector } from 'src/api/metrics'
import {
  MetricsRangeQuery,
  NamespaceMetricsGroup,
  PipelineMetricsGroup,
  RangeQueryMetricGroup,
  StackQueryMetricGroup,
  TopicMetricsGroup,
} from 'src/store/metrics/metrics-model'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('METRICS')

// Pipeline
export type RequestPipelineMetricsPayload = MetricsRangeQuery<PipelineMetricsGroup>
export const triggerRequestPipelineMetrics = actionCreator<RequestPipelineMetricsPayload>(
  'TRIGGER_REQUEST_PIPELINE'
)
export const requestPipelineMetrics = actionCreator.async<
  RequestPipelineMetricsPayload,
  RangeVector
>('REQUEST_PIPELINE')

// Namespace
export type RequestNamespaceMetricsPayload = MetricsRangeQuery<NamespaceMetricsGroup>
export const triggerRequestNamespaceMetrics = actionCreator<RequestNamespaceMetricsPayload>(
  'TRIGGER_REQUEST_NAMESPACE'
)
export const requestNamespaceMetrics = actionCreator.async<
  RequestNamespaceMetricsPayload,
  RangeVector
>('REQUEST_NAMESPACE')

// Topic
export type RequestTopicMetricsPayload = MetricsRangeQuery<TopicMetricsGroup>
export const triggerRequestTopicMetrics = actionCreator<RequestTopicMetricsPayload>(
  'TRIGGER_REQUEST_TOPIC'
)
export const requestTopicMetrics = actionCreator.async<
  RequestTopicMetricsPayload,
  RangeVector
>('REQUEST_TOPIC')

// Adhoc queries
export interface QueryMetricsPayload {
  query: string
}
export const triggerQueryMetrics = actionCreator<QueryMetricsPayload>('TRIGGER_QUERY')
export const queryMetrics = actionCreator.async<QueryMetricsPayload, MetricsQueryResult>('QUERY')

// Range Queries
export type RangeQueryMetricsPayload = MetricsRangeQuery<RangeQueryMetricGroup>
export const triggerRangeQueryMetrics = actionCreator<RangeQueryMetricsPayload>(
  'TRIGGER_RANGE_QUERY'
)
export const rangeQueryMetrics = actionCreator.async<RangeQueryMetricsPayload, RangeVector>(
  'RANGE_QUERY'
)

// Stack Queries
export type StackQueryMetricsPayload = MetricsRangeQuery<StackQueryMetricGroup>
export const triggerStackQueryMetrics = actionCreator<StackQueryMetricsPayload>(
  'TRIGGER_STACK_QUERY'
)
export const stackQueryMetrics = actionCreator.async<StackQueryMetricsPayload, RangeVector>(
  'STACK_QUERY'
)

// Cancel an auto-refreshing query
interface CancelQueryAutoRefreshPayload {
  encodedValue: string
}
export const cancelQueryAutoRefresh = actionCreator<CancelQueryAutoRefreshPayload>('CANCEL_AUTO_REFRESH')
