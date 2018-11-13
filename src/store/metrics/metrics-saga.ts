import differenceInSeconds from 'date-fns/difference_in_seconds'
import subDays from 'date-fns/sub_days'
import subHours from 'date-fns/sub_hours'
import subMinutes from 'date-fns/sub_minutes'
import subMonths from 'date-fns/sub_months'
import subWeeks from 'date-fns/sub_weeks'
import floor from 'lodash-es/floor'
import { AnyAction } from 'redux'
import { delay, SagaIterator } from 'redux-saga'
import { all, call, fork, race, select, take, takeEvery } from 'redux-saga/effects'
import * as metrics from 'src/api/metrics'
import { Action } from 'src/store/constants'
import {
  cancelQueryAutoRefresh,
  queryMetrics,
  QueryMetricsPayload,
  rangeQueryMetrics,
  RangeQueryMetricsPayload,
  requestNamespaceMetrics,
  RequestNamespaceMetricsPayload,
  requestPipelineMetrics,
  RequestPipelineMetricsPayload,
  requestTopicMetrics,
  RequestTopicMetricsPayload,
  stackQueryMetrics,
  StackQueryMetricsPayload,
  triggerQueryMetrics,
  triggerRangeQueryMetrics,
  triggerRequestNamespaceMetrics,
  triggerRequestPipelineMetrics,
  triggerRequestTopicMetrics,
  triggerStackQueryMetrics,
} from 'src/store/metrics/metrics-actions'
import { MetricsRangeQuery, TimeRange } from 'src/store/metrics/metrics-model'
import { makeGetMetricsRangeState, RangeState } from 'src/store/metrics/metrics-reducer'
import {
  MetricsQueryEncoder,
  namespaceQueryEncoder,
  pipelineQueryEncoder,
  rangeQueryEncoder,
  stackQueryEncoder,
  topicQueryEncoder,
} from 'src/store/metrics/query-encoders'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { assertUnreachable } from 'src/util/misc'
import { isType } from 'typescript-fsa'

const ONE_HOUR = 60 * 60

const timeRangeFromNow = (timeRange: TimeRange): [number, number] => {
  const now = Date.now()

  switch (timeRange) {
    case TimeRange.THIRTY_MINUTES:
      return [subMinutes(now, 30).getTime(), now]
    case TimeRange.HOUR:
      return [subHours(now, 1).getTime(), now]
    case TimeRange.TWO_HOURS:
      return [subHours(now, 2).getTime(), now]
    case TimeRange.THREE_HOURS:
      return [subHours(now, 3).getTime(), now]
    case TimeRange.SIX_HOURS:
      return [subHours(now, 6).getTime(), now]
    case TimeRange.TWELVE_HOURS:
      return [subHours(now, 12).getTime(), now]
    case TimeRange.DAY:
      return [subDays(now, 1).getTime(), now]
    case TimeRange.WEEK:
      return [subWeeks(now, 1).getTime(), now]
    case TimeRange.MONTH:
      return [subMonths(now, 1).getTime(), now]
    default:
      return assertUnreachable(timeRange)
  }
}

const requestMetrics = function*<G>(
  query: MetricsRangeQuery<G>,
  encoder: MetricsQueryEncoder<G>
): SagaIterator {
  const [start, end] = timeRangeFromNow(query.timeRange)

  return yield call(
    metrics.queryRange,
    encoder(query),
    floor(start / 1000),
    floor(end / 1000),
    query.step,
    query.completePayload
  )
}

const requestPipelineMetricsWorker = bindAsyncAction(requestPipelineMetrics)(function*(
  query: RequestPipelineMetricsPayload,
  encoder: typeof pipelineQueryEncoder
): SagaIterator {
  return yield call(requestMetrics, query, encoder)
})

const requestNamespaceMetricsWorker = bindAsyncAction(requestNamespaceMetrics)(function*(
  query: RequestNamespaceMetricsPayload,
  encoder: typeof namespaceQueryEncoder
): SagaIterator {
  return yield call(requestMetrics, query, encoder)
})

const requestTopicMetricsWorker = bindAsyncAction(requestTopicMetrics)(function*(
  query: RequestTopicMetricsPayload,
  encoder: typeof topicQueryEncoder
): SagaIterator {
  return yield call(requestMetrics, query, encoder)
})

const requestRangeQueryMetricsWorker = bindAsyncAction(rangeQueryMetrics)(function*(
  query: RangeQueryMetricsPayload,
  encoder: typeof rangeQueryEncoder
): SagaIterator {
  return yield call(requestMetrics, query, encoder)
})

const requestStackQueryMetricsWorker = bindAsyncAction(stackQueryMetrics)(function*(
  query: StackQueryMetricsPayload,
  encoder: typeof stackQueryEncoder
): SagaIterator {
  return yield call(requestMetrics, query, encoder)
})

const requestMetricsWorker = function*(
  encoder: MetricsQueryEncoder,
  requestWorker: (query: MetricsRangeQuery<any>, encoder: MetricsQueryEncoder) => SagaIterator,
  { payload: query }: Action<MetricsRangeQuery<any>>
): SagaIterator {
  const range: RangeState | null = yield select(makeGetMetricsRangeState(encoder), query)

  if (query.autoRefresh) {
    const queryId = encoder(query)
    while (true) {
      yield call(requestWorker, query, encoder)

      const { cancelled } = yield race({
        cancelled: take(
          (action: AnyAction) =>
            isType(action, cancelQueryAutoRefresh) && action.payload.encodedValue === queryId
        ),
        timeout: call(delay, query.autoRefresh.interval),
      })

      if (cancelled) break
    }
  } else {
    // Cache metrics result for one hour, unless user wants a hard refresh
    if (
      range &&
      (range.isLoading ||
        (!query.forceReload &&
          range.successfullyUpdatedOn &&
          differenceInSeconds(Date.now(), range.successfullyUpdatedOn) < ONE_HOUR))
    ) {
      return
    }
    yield call(requestWorker, query, encoder)
  }
}

function* watchRequestPipelineMetrics(): SagaIterator {
  yield takeEvery(
    triggerRequestPipelineMetrics,
    requestMetricsWorker,
    pipelineQueryEncoder,
    requestPipelineMetricsWorker
  )
}

function* watchRequestNamespaceMetrics(): SagaIterator {
  yield takeEvery(
    triggerRequestNamespaceMetrics,
    requestMetricsWorker,
    namespaceQueryEncoder,
    requestNamespaceMetricsWorker
  )
}

function* watchRequestTopicMetrics(): SagaIterator {
  yield takeEvery(
    triggerRequestTopicMetrics,
    requestMetricsWorker,
    topicQueryEncoder,
    requestTopicMetricsWorker
  )
}

function* watchRangeQueryMetrics(): SagaIterator {
  yield takeEvery(
    triggerRangeQueryMetrics,
    requestMetricsWorker,
    rangeQueryEncoder,
    requestRangeQueryMetricsWorker
  )
}

function* watchStackQueryMetrics(): SagaIterator {
  yield takeEvery(
    triggerStackQueryMetrics,
    requestMetricsWorker,
    stackQueryEncoder,
    requestStackQueryMetricsWorker
  )
}

const queryMetricsWorker = bindAsyncAction(queryMetrics)(function*({ query }) {
  return yield call(metrics.query, query)
})

function* watchQueryMetrics(): SagaIterator {
  yield takeEvery(triggerQueryMetrics, function*(action: Action<QueryMetricsPayload>) {
    yield call(queryMetricsWorker, action.payload)
  })
}

export default function* metricsSaga(): SagaIterator {
  yield all([
    fork(watchRequestPipelineMetrics),
    fork(watchRequestNamespaceMetrics),
    fork(watchRequestTopicMetrics),
    fork(watchRangeQueryMetrics),
    fork(watchStackQueryMetrics),
    fork(watchQueryMetrics),
  ])
}
