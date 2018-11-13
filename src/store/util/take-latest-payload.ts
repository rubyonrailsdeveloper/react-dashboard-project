import { call, takeLatest } from 'redux-saga/effects'
import { Action } from 'src/store/constants'
import { ActionCreator } from 'typescript-fsa'

export const takeLatestPayload = <A extends ActionCreator<P>, P>(
  pattern: A,
  saga: (p: P) => void
) =>
  takeLatest(pattern, function*(action: Action<P>) {
    yield call(saga, action.payload)
  })
