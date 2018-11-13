import { SagaIterator } from 'redux-saga'
import { all, call, fork } from 'redux-saga/effects'
import * as containers from 'src/api/containers'
import { requestContainer, triggerRequestContainer } from 'src/store/container/container-actions'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestContainerWorker = bindAsyncAction(requestContainer)(function*({ id }): SagaIterator {
  return yield call(containers.find, id)
})

function* watchRequestContainer(): SagaIterator {
  yield takeLatestPayload(triggerRequestContainer, requestContainerWorker)
}

export default function* containerSaga(): SagaIterator {
  yield all([fork(watchRequestContainer)])
}
