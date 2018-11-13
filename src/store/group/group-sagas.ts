import { SagaIterator } from 'redux-saga'
import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import * as groups from 'src/api/groups'
import {
  createGroup,
  deleteGroup,
  requestGroup,
  requestGroupList,
  triggerCreateGroup,
  triggerDeleteGroup,
  triggerRequestGroup,
  triggerRequestGroupList,
  triggerUpdateGroup,
  updateGroup,
} from 'src/store/group/group-actions'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestGroupListWorker = bindAsyncAction(requestGroupList)(function*(): SagaIterator {
  return yield call(groups.findAll)
})

const requestGroupWorker = bindAsyncAction(requestGroup)(function*({ id }): SagaIterator {
  return yield call(groups.find, id)
})

const createGroupWorker = bindAsyncAction(createGroup)(function*(payload): SagaIterator {
  const res = yield call(groups.create, payload.name, payload)
  yield put(triggerRequestGroup({ id: payload.name }))
  return res
})

const updateGroupWorker = bindAsyncAction(updateGroup)(function*({
  id,
  requester,
  ...payload
}): SagaIterator {
  const res = yield call(groups.update, id, payload)
  yield put(triggerRequestGroup({ id }))
  return res
})

const deleteGroupWorker = bindAsyncAction(deleteGroup)(function*({ id }): SagaIterator {
  const res = yield call(groups.remove, id)
  yield put(triggerRequestGroupList())
  return res
})

function* watchRequestGroupList(): SagaIterator {
  yield takeLatest(triggerRequestGroupList, requestGroupListWorker)
}

function* watchRequestGroup(): SagaIterator {
  yield takeLatestPayload(triggerRequestGroup, requestGroupWorker)
}

function* watchCreateGroup(): SagaIterator {
  yield takeLatestPayload(triggerCreateGroup, createGroupWorker)
}

function* watchUpdateGroup(): SagaIterator {
  yield takeLatestPayload(triggerUpdateGroup, updateGroupWorker)
}

function* watchDeleteGroup(): SagaIterator {
  yield takeLatestPayload(triggerDeleteGroup, deleteGroupWorker)
}

export default function* groupSaga(): SagaIterator {
  yield all([
    fork(watchRequestGroupList),
    fork(watchRequestGroup),
    fork(watchCreateGroup),
    fork(watchUpdateGroup),
    fork(watchDeleteGroup),
  ])
}
