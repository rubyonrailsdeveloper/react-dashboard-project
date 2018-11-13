import { combineReducers } from 'redux'
import { MetricsQueryResult, RangeVector } from 'src/api/metrics'
import { MetricTransform } from 'src/components/Graph/internal/transforms'
import { OriginalTimeSeries } from 'src/components/Graph/internal/types'
import {
  AsyncErrorState,
  asyncFailure,
  isLoading,
  IsLoadingState,
  makeAsyncErrorReducer,
  makeIsLoadingReducer,
} from 'src/store/internal/async'
import {
  queryMetrics,
  rangeQueryMetrics,
  requestNamespaceMetrics,
  requestPipelineMetrics,
  requestTopicMetrics,
  stackQueryMetrics,
} from 'src/store/metrics/metrics-actions'
import { MetricQuery, MetricsRangeQuery } from 'src/store/metrics/metrics-model'
import {
  namespaceQueryEncoder,
  pipelineQueryEncoder,
  QueryEncoder,
  rangeQueryEncoder,
  stackQueryEncoder,
  topicQueryEncoder,
} from 'src/store/metrics/query-encoders'
import { State } from 'src/store/root-reducer'
import { AsyncAction, asyncParams, isAsyncSuccess } from 'src/store/util/reducer'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

const epochToMilli = (timeSeries: OriginalTimeSeries) => {
  timeSeries[0] *= 1000
  return timeSeries
}

export interface RangeState {
  isLoading: boolean
  error: object | null
  result: RangeVector | null
  successfullyUpdatedOn: number | null
}

const rangeInitState: RangeState = {
  isLoading: false,
  error: null,
  result: null,
  successfullyUpdatedOn: null,
}

const rangeReducer = (
  state = rangeInitState,
  action: AsyncAction<MetricsRangeQuery<any>, RangeVector>,
  transform?: MetricTransform
): RangeState => {
  return {
    isLoading: isLoading(action),
    error: asyncFailure(action),
    result: isAsyncSuccess(action)
      ? transform
        ? transform(action.payload.result.map(epochToMilli))
        : action.payload.result.map(epochToMilli)
      : state.result,
    successfullyUpdatedOn: isAsyncSuccess(action) ? Date.now() : state.successfullyUpdatedOn,
  }
}

interface RangesState {
  [exp: string]: RangeState
}

const rangesInitState: RangesState = {}

const expId = <Q extends MetricsRangeQuery<G>, G>(
  encoder: QueryEncoder<MetricQuery<G>>,
  query: Q
) => `${encoder(query)}::${query.timeRange}:${query.step}`

const rangesReducerWithEncoder = <P extends MetricsRangeQuery<G>, G>(
  encoder: QueryEncoder<MetricQuery<G>>
) => (state: RangesState, action: AsyncAction<P, RangeVector>) => {
  const payload = asyncParams(action)
  const exp = expId(encoder, payload)
  return {
    ...state,
    [exp]: rangeReducer(state[exp], action, payload.transform),
  }
}

const rangesReducer = reducerWithInitialState(rangesInitState)
  .casesWithAction(
    [requestPipelineMetrics.started, requestPipelineMetrics.done, requestPipelineMetrics.failed],
    rangesReducerWithEncoder(pipelineQueryEncoder)
  )
  .casesWithAction(
    [requestNamespaceMetrics.started, requestNamespaceMetrics.done, requestNamespaceMetrics.failed],
    rangesReducerWithEncoder(namespaceQueryEncoder)
  )
  .casesWithAction(
    [rangeQueryMetrics.started, rangeQueryMetrics.done, rangeQueryMetrics.failed],
    rangesReducerWithEncoder(rangeQueryEncoder)
  )
  .casesWithAction(
    [stackQueryMetrics.started, stackQueryMetrics.done, stackQueryMetrics.failed],
    rangesReducerWithEncoder(stackQueryEncoder)
  ).casesWithAction(
    [requestTopicMetrics.started, requestTopicMetrics.done, requestTopicMetrics.failed],
    rangesReducerWithEncoder(topicQueryEncoder)
  )

type QueryResultsState = MetricsQueryResult | null

const queryResultsInitState: QueryResultsState = null

const queryResultReducer = reducerWithInitialState<QueryResultsState>(queryResultsInitState).case(
  queryMetrics.done,
  (state, payload) => payload.result || null
)

interface QueryState {
  isLoading: IsLoadingState
  error: AsyncErrorState
  result: QueryResultsState
}

const queryReducer = combineReducers<QueryState>({
  isLoading: makeIsLoadingReducer(queryMetrics),
  error: makeAsyncErrorReducer(queryMetrics),
  result: queryResultReducer,
})

interface QueriesReducer {
  [queryExp: string]: QueryState
}

const queriesInitState: QueriesReducer = {}

const queriesReducer = reducerWithInitialState(queriesInitState).casesWithAction(
  [queryMetrics.started, queryMetrics.done, queryMetrics.failed],
  (state, action) => {
    const queryExp = asyncParams(action).query
    return { ...state, [queryExp]: queryReducer(state[queryExp], action) }
  }
)

export interface MetricsState {
  ranges: RangesState
  queries: QueriesReducer
}

export const metricsReducer = combineReducers<MetricsState>({
  ranges: rangesReducer,
  queries: queriesReducer,
})

// Selectors
const ranges = (state: State) => state.metrics.ranges
const queries = (state: State) => state.metrics.queries

const getWithRange = <T>(getter: (range: RangeState | null) => T) => <
  Q extends MetricsRangeQuery<G>,
  G
>(
  encoder: QueryEncoder<MetricQuery<G>>
) => (state: State, query: Q) => {
  const range = ranges(state)[expId(encoder, query)] || null
  return getter(range)
}

const makeGetMetrics = getWithRange(range => range && range.result)

const makeGetMetricsIsLoading = getWithRange(range => !!range && range.isLoading)

const makeGetMetricsError = getWithRange(range => range && range.error)

export const makeGetQuery = <T>(getter: (query: QueryState) => T) => (
  state: State,
  queryExp: string
): T | null => {
  const query = queries(state)[queryExp]
  return query ? getter(query) : null
}

// Internal
export const makeGetMetricsRangeState = getWithRange(range => range)

// Pipelines
export const getPipelineMetrics = makeGetMetrics(pipelineQueryEncoder)

export const getPipelineMetricsIsLoading = makeGetMetricsIsLoading(pipelineQueryEncoder)

export const getPipelineMetricsLoadingError = makeGetMetricsError(pipelineQueryEncoder)

// Namespaces
export const getNamespaceMetrics = makeGetMetrics(namespaceQueryEncoder)

export const getNamespaceMetricsIsLoading = makeGetMetricsIsLoading(namespaceQueryEncoder)

export const getNamespaceMetricsLoadingError = makeGetMetricsError(namespaceQueryEncoder)

// Topics
export const getTopicMetrics = makeGetMetrics(topicQueryEncoder)

export const getTopicMetricsIsLoading = makeGetMetricsIsLoading(topicQueryEncoder)

export const getTopicMetricsLoadingError = makeGetMetricsError(topicQueryEncoder)

// Range Queries
export const getRangeMetrics = makeGetMetrics(rangeQueryEncoder)

export const getRangeMetricsIsLoading = makeGetMetricsIsLoading(rangeQueryEncoder)

export const getRangeMetricsLoadingError = makeGetMetricsError(rangeQueryEncoder)

// Stack Queries
export const getStackQueryMetrics = makeGetMetrics(stackQueryEncoder)

export const getStackMetricsIsLoading = makeGetMetricsIsLoading(stackQueryEncoder)

export const getStackMetricsLoadingError = makeGetMetricsError(stackQueryEncoder)

// Queries
const defaultResultState = { result: null, isLoading: false, error: null }
export const getQueryResultState = (state: State, queryExp: string): QueryState =>
  queries(state)[queryExp] || defaultResultState

export const getQueryResult = makeGetQuery(({ result }) => result)

export const getQueryError = makeGetQuery(({ error }) => error)

export const getQueryIsLoading = makeGetQuery(({ isLoading: loading }) => loading)
