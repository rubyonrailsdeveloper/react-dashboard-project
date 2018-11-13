import { SagaIterator } from 'redux-saga'
import { all, call, fork, takeLatest } from 'redux-saga/effects'
import * as clusters from 'src/api/clusters'
import {
  requestCluster,
  requestClusterList,
  triggerRequestCluster,
  triggerRequestClusterList,
} from 'src/store/cluster/cluster-actions'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestClusterListWorker = bindAsyncAction(requestClusterList)(function*(): SagaIterator {
  return yield call(clusters.findAll)
})

const requestClusterWorker = bindAsyncAction(requestCluster)(function*({ id }): SagaIterator {
  return yield call(clusters.find, id)
})

function* watchRequestClusterList(): SagaIterator {
  yield takeLatest(triggerRequestClusterList, requestClusterListWorker)
}

function* watchRequestCluster(): SagaIterator {
  yield takeLatestPayload(triggerRequestCluster, requestClusterWorker)
}

export default function* clusterSaga(): SagaIterator {
  yield all([fork(watchRequestClusterList), fork(watchRequestCluster)])
}
