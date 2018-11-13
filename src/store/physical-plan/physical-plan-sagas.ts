import { SagaIterator } from 'redux-saga'
import { all, call, fork } from 'redux-saga/effects'
import * as pipelines from 'src/api/pipelines'
import {
  requestPhysicalPlan,
  triggerRequestPhysicalPlan,
} from 'src/store/physical-plan/physical-plan-actions'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestPhysicalPlanWorker = bindAsyncAction(requestPhysicalPlan)(function*({
  id,
}): SagaIterator {
  return yield call(pipelines.findPhysicalPlan, id)
})

function* watchRequestPhysicalPlan(): SagaIterator {
  yield takeLatestPayload(triggerRequestPhysicalPlan, requestPhysicalPlanWorker)
}

export default function* physicalPlanSaga(): SagaIterator {
  yield all([fork(watchRequestPhysicalPlan)])
}
