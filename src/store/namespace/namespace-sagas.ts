import { SagaIterator } from 'redux-saga'
import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import * as namespaces from 'src/api/namespaces'
import {
  clearNamespaceBacklog,
  createNamespace,
  deleteNamespace,
  requestNamespace,
  requestNamespaceList,
  triggerClearNamespaceBacklog,
  triggerCreateNamespace,
  triggerDeleteNamespace,
  triggerRequestNamespace,
  triggerRequestNamespaceList,
  triggerUnloadNamespace,
  triggerUpdateNamespace,
  unloadNamespace,
  updateNamespace,
} from 'src/store/namespace/namespace-actions'
import { makeNamespaceId } from 'src/store/namespace/namespace-model'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestNamespaceListWorker = bindAsyncAction(requestNamespaceList)(function*(): SagaIterator {
  return yield call(namespaces.findAll)
})

const requestNamespaceWorker = bindAsyncAction(requestNamespace)(function*({ id }): SagaIterator {
  return yield call(namespaces.find, id)
})

const createNamespaceWorker = bindAsyncAction(createNamespace)(function*({
  group,
  name,
  ...payload
}): SagaIterator {
  const id = makeNamespaceId(group, name)
  const res = yield call(namespaces.create, id, payload)
  yield put(triggerRequestNamespace({ id }))
  return res
})

const updateNamespaceWorker = bindAsyncAction(updateNamespace)(function*({
  id,
  requester,
  ...payload
}): SagaIterator {
  const res = yield call(namespaces.update, id, payload)
  yield put(triggerRequestNamespace({ id }))
  return res
})

const deleteNamespaceWorker = bindAsyncAction(deleteNamespace)(function*({ id }): SagaIterator {
  const res = yield call(namespaces.remove, id)
  yield put(triggerRequestNamespaceList())
  return res
})

const unloadNamespaceWorker = bindAsyncAction(unloadNamespace)(function*({ id }): SagaIterator {
  const res = yield call(namespaces.unload, id)
  yield put(triggerRequestNamespaceList())
  return res
})

const clearNamespaceBacklogWorker = bindAsyncAction(clearNamespaceBacklog)(function*({
  id,
}): SagaIterator {
  return yield call(namespaces.clearBacklog, id)
})

function* watchRequestNamespaceList(): SagaIterator {
  yield takeLatest(triggerRequestNamespaceList, requestNamespaceListWorker)
}

function* watchRequestNamespace(): SagaIterator {
  yield takeLatestPayload(triggerRequestNamespace, requestNamespaceWorker)
}

function* watchCreateNamespace(): SagaIterator {
  yield takeLatestPayload(triggerCreateNamespace, createNamespaceWorker)
}

function* watchUpdateNamespace(): SagaIterator {
  yield takeLatestPayload(triggerUpdateNamespace, updateNamespaceWorker)
}

function* watchDeleteNamespace(): SagaIterator {
  yield takeLatestPayload(triggerDeleteNamespace, deleteNamespaceWorker)
}

function* watchUnloadNamespace(): SagaIterator {
  yield takeLatestPayload(triggerUnloadNamespace, unloadNamespaceWorker)
}

function* watchClearNamespaceBacklog(): SagaIterator {
  yield takeLatestPayload(triggerClearNamespaceBacklog, clearNamespaceBacklogWorker)
}

export default function* namespaceSaga(): SagaIterator {
  yield all([
    fork(watchRequestNamespaceList),
    fork(watchRequestNamespace),
    fork(watchCreateNamespace),
    fork(watchUpdateNamespace),
    fork(watchDeleteNamespace),
    fork(watchUnloadNamespace),
    fork(watchClearNamespaceBacklog),
  ])
}
