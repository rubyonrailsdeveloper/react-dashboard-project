import { SagaIterator } from 'redux-saga'
import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import * as users from 'src/api/users'
import {
  createUser,
  deleteUser,
  requestUser,
  requestUserList,
  triggerCreateUser,
  triggerDeleteUser,
  triggerRequestUser,
  triggerRequestUserList,
  triggerUpdateUser,
  updateUser,
} from 'src/store/user/user-actions'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestUserListWorker = bindAsyncAction(requestUserList)(function*(): SagaIterator {
  return yield call(users.findAll)
})

const requestUserWorker = bindAsyncAction(requestUser)(function*({ id }): SagaIterator {
  return yield call(users.find, id)
})

const createUserWorker = bindAsyncAction(createUser)(function*(payload): SagaIterator {
  const res = yield call(users.create, payload)
  yield put(triggerRequestUser({ id: res.id }))
  return res
})

const updateUserWorker = bindAsyncAction(updateUser)(function*({
  id,
  requester,
  ...payload
}): SagaIterator {
  const res = yield call(users.update, id, payload)
  yield put(triggerRequestUser({ id }))
  return res
})

const deleteUserWorker = bindAsyncAction(deleteUser)(function*({ id }): SagaIterator {
  const res = yield call(users.remove, id)
  yield put(triggerRequestUserList())
  return res
})

function* watchRequestUserList(): SagaIterator {
  yield takeLatest(triggerRequestUserList, requestUserListWorker)
}

function* watchRequestUser(): SagaIterator {
  yield takeLatestPayload(triggerRequestUser, requestUserWorker)
}

function* watchCreateUser(): SagaIterator {
  yield takeLatestPayload(triggerCreateUser, createUserWorker)
}

function* watchUpdateUser(): SagaIterator {
  yield takeLatestPayload(triggerUpdateUser, updateUserWorker)
}

function* watchDeleteUser(): SagaIterator {
  yield takeLatestPayload(triggerDeleteUser, deleteUserWorker)
}

export default function* userSaga(): SagaIterator {
  yield all([
    fork(watchCreateUser),
    fork(watchUpdateUser),
    fork(watchDeleteUser),
    fork(watchRequestUserList),
    fork(watchRequestUser),
  ])
}
