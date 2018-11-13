import { delay, SagaIterator } from 'redux-saga'
import { call, fork, put, race, take } from 'redux-saga/effects'
import { triggerRequestClusterList } from 'src/store/cluster/cluster-actions'
import { dashboardRefreshRate } from 'src/store/constants'
import { triggerRequestGroupList } from 'src/store/group/group-actions'
import { triggerRequestNodeList } from 'src/store/node/node-actions'
import { triggerRequestPipelineList } from 'src/store/pipeline/pipeline-actions'
import { triggerRequestTopicList } from 'src/store/topic/topic-actions'
import { dashboardMounted, dashboardUnmounted } from 'src/store/ui/ui-actions'

const requestDashboardDependencies = function*(): SagaIterator {
  yield put(triggerRequestClusterList())
  yield put(triggerRequestGroupList())
  yield put(triggerRequestNodeList())
  yield put(triggerRequestPipelineList())
  yield put(triggerRequestTopicList())
}

function* watchDashboardLifecycle(): SagaIterator {
  while (true) {
    yield take(dashboardMounted)
    yield call(requestDashboardDependencies)

    while (true) {
      const { unmounted } = yield race({
        unmounted: take(dashboardUnmounted),
        timeout: call(delay, dashboardRefreshRate),
      })

      if (unmounted) break
      else yield call(requestDashboardDependencies)
    }
  }
}

export default function* uiSaga(): SagaIterator {
  yield fork(watchDashboardLifecycle)
}
