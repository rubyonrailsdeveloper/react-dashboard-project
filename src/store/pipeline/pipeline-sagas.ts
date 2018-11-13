import { SagaIterator } from 'redux-saga'
import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import * as pipelines from 'src/api/pipelines'
import { triggerQueryMetrics } from 'src/store/metrics/metrics-actions'
import { MetricsQueries } from 'src/store/metrics/metrics-model'
import {
  activatePipeline,
  deactivatePipeline,
  deletePipeline,
  requestPipeline,
  requestPipelineList,
  triggerActivatePipeline,
  triggerDeactivatePipeline,
  triggerDeletePipeline,
  triggerRequestPipeline,
  triggerRequestPipelineList,
} from 'src/store/pipeline/pipeline-actions'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestPipelineListWorker = bindAsyncAction(requestPipelineList)(function*(): SagaIterator {
  return yield call(pipelines.findAll)
})

const requestPipelineResources = function*() {
  yield all([
    put(triggerQueryMetrics({ query: MetricsQueries.RAM_USED_BY_TOPOLOGY() })),
    put(triggerQueryMetrics({ query: MetricsQueries.CPU_USED_BY_TOPOLOGY() })),
  ])
}

const requestPipelineWorker = bindAsyncAction(requestPipeline)(function*({ id }): SagaIterator {
  return yield call(pipelines.find, id)
})

const activatePipelineWorker = bindAsyncAction(activatePipeline)(function*({ id }) {
  const res = yield call(pipelines.activate, id)
  yield put(triggerRequestPipeline({ id }))
  return res
})

const deactivatePipelineWorker = bindAsyncAction(deactivatePipeline)(function*({ id }) {
  const res = yield call(pipelines.deactivate, id)
  yield put(triggerRequestPipeline({ id }))
  return res
})

const deletePipelineWorker = bindAsyncAction(deletePipeline)(function*({ id }) {
  const res = yield call(pipelines.terminate, id)
  yield put(triggerRequestPipelineList())
  return res
})

function* watchRequestPipelineList(): SagaIterator {
  yield takeLatest(triggerRequestPipelineList, function*() {
    yield all([call(requestPipelineListWorker), call(requestPipelineResources)])
  })
}

function* watchRequestPipeline(): SagaIterator {
  yield takeLatestPayload(triggerRequestPipeline, requestPipelineWorker)
}

function* watchActivatePipeline(): SagaIterator {
  yield takeLatestPayload(triggerActivatePipeline, activatePipelineWorker)
}

function* watchDeactivatePipeline(): SagaIterator {
  yield takeLatestPayload(triggerDeactivatePipeline, deactivatePipelineWorker)
}

function* watchDeletePipeline(): SagaIterator {
  yield takeLatestPayload(triggerDeletePipeline, deletePipelineWorker)
}

export default function* pipelineSaga(): SagaIterator {
  yield all([
    fork(watchRequestPipelineList),
    fork(watchRequestPipeline),
    fork(watchActivatePipeline),
    fork(watchDeactivatePipeline),
    fork(watchDeletePipeline),
  ])
}
