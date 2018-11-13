import { normalize } from 'normalizr'
import { SagaIterator } from 'redux-saga'
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import * as auth from 'src/api/auth'
import { loggedIn, loggedOut, triggerLogin, triggerLogout } from 'src/store/auth/auth-actions'
import { State } from 'src/store/root-reducer'
import { requestUser } from 'src/store/user/user-actions'
import { userSchema } from 'src/store/user/user-model'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'
import storage from 'src/util/storage'

const loginWorker = bindAsyncAction(loggedIn)(function*(props): SagaIterator {
  const tokenResp = yield call(auth.login, props)
  const userResp = yield call(auth.currentUser, tokenResp.token)
  const authData = { ...tokenResp, id: userResp.id }
  const normalizedUser = normalize(userResp, userSchema)

  const currentUser = requestUser.done({
    params: userResp.id,
    result: normalizedUser,
  })
  yield put(currentUser)

  const users = yield select((state: State) => state.users)

  storage.save({ auth: authData, users })

  return authData
})

const logoutWorker = bindAsyncAction(loggedOut)(function*(): SagaIterator {
  const resp = yield call(auth.logout)
  storage.clear()
  return resp
})

function* watchLogin(): SagaIterator {
  yield takeLatestPayload(triggerLogin, loginWorker)
}

function* watchLogout(): SagaIterator {
  yield takeLatest(triggerLogout, logoutWorker)
}

export default function* authSaga(): SagaIterator {
  yield all([fork(watchLogin), fork(watchLogout)])
}
