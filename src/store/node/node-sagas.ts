import { SagaIterator } from 'redux-saga'
import { all, call, fork, takeLatest } from 'redux-saga/effects'
import * as nodes from 'src/api/nodes'
import {
  requestNode,
  requestNodeList,
  requestNodesByCluster,
  triggerRequestNode,
  triggerRequestNodeList,
  triggerRequestNodesByCluster,
} from 'src/store/node/node-actions'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestNodeListWorker = bindAsyncAction(requestNodeList)(function*(): SagaIterator {
  return yield call(nodes.findAll)
})

const requestNodeWorker = bindAsyncAction(requestNode)(function*({ id }): SagaIterator {
  return yield call(nodes.find, id)
})

const requestNodesByClusterWorker = bindAsyncAction(requestNodesByCluster)(function*({
  cluster,
}): SagaIterator {
  return yield call(nodes.findByCluster, cluster)
})

function* watchRequestNodeList(): SagaIterator {
  yield takeLatest(triggerRequestNodeList, requestNodeListWorker)
}

function* watchRequestNode(): SagaIterator {
  yield takeLatestPayload(triggerRequestNode, requestNodeWorker)
}

function* watchRequestNodesByCluster(): SagaIterator {
  yield takeLatestPayload(triggerRequestNodesByCluster, requestNodesByClusterWorker)
}

export default function* nodeSaga(): SagaIterator {
  yield all([fork(watchRequestNodeList), fork(watchRequestNode), fork(watchRequestNodesByCluster)])
}
