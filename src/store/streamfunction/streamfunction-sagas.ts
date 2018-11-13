import { SagaIterator } from 'redux-saga'
import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import * as streamFunctions from 'src/api/streamfunctions'
import {
  createStreamFunction,
  deleteStreamFunction,
  requestStreamFunction,
  requestStreamFunctionList,
  triggerCreateStreamFunction,
  triggerDeleteStreamFunction,
  triggerRequestStreamFunction,
  triggerRequestStreamFunctionList,
  triggerUpdateStreamFunction,
  updateStreamFunction
} from 'src/store/streamfunction/streamfunction-actions'
// import { makeStreamFunctionId } from 'src/store/streamfunction/streamfunction-model'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestStreamFunctionListWorker = bindAsyncAction(requestStreamFunctionList)(function*(): SagaIterator {
  return yield call(streamFunctions.findAll)
})

const requestStreamFunctionWorker = bindAsyncAction(requestStreamFunction)(function*({ id }): SagaIterator {
  return yield call(streamFunctions.find, id)
})

const createStreamFunctionWorker = bindAsyncAction(createStreamFunction)(function*(payload): SagaIterator {
  const res = yield call(streamFunctions.create, payload.name, payload)
  yield put(triggerRequestStreamFunction({ id: payload.name }))
  return res
})
// const createStreamFunctionWorker = bindAsyncAction(createStreamFunction)(function*({
//   group,
//   name,
//   ...payload
// }): SagaIterator {
//   const id = makeStreamFunctionId(group, name)
//   const res = yield call(streamFunctions.create, id, payload)
//   yield put(triggerRequestStreamFunction({ id }))
//   return res
// })

const updateStreamFunctionWorker = bindAsyncAction(updateStreamFunction)(function*({
  id,
  requester,
  ...payload
}): SagaIterator {
  const res = yield call(streamFunctions.update, id, payload)
  yield put(triggerRequestStreamFunction({ id }))
  return res
})

const deleteStreamFunctionWorker = bindAsyncAction(deleteStreamFunction)(function*({ id }): SagaIterator {
  const res = yield call(streamFunctions.remove, id)
  yield put(triggerRequestStreamFunctionList())
  return res
})

function* watchRequestStreamFunctionList(): SagaIterator {
  yield takeLatest(triggerRequestStreamFunctionList, requestStreamFunctionListWorker)
}

function* watchRequestStreamFunction(): SagaIterator {
  yield takeLatestPayload(triggerRequestStreamFunction, requestStreamFunctionWorker)
}

function* watchCreateStreamFunction(): SagaIterator {
  yield takeLatestPayload(triggerCreateStreamFunction, createStreamFunctionWorker)
}

function* watchUpdateStreamFunction(): SagaIterator {
  yield takeLatestPayload(triggerUpdateStreamFunction, updateStreamFunctionWorker)
}

function* watchDeleteStreamFunction(): SagaIterator {
  yield takeLatestPayload(triggerDeleteStreamFunction, deleteStreamFunctionWorker)
}

export default function* streamFunctionSaga(): SagaIterator {
  yield all([
    fork(watchRequestStreamFunctionList),
    fork(watchRequestStreamFunction),
    fork(watchCreateStreamFunction),
    fork(watchUpdateStreamFunction),
    fork(watchDeleteStreamFunction),
  ])
}
