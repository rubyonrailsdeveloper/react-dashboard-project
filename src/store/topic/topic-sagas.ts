import { SagaIterator } from 'redux-saga'
import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import * as topics from 'src/api/topics'
import {
  applySubscriptionTtl,
  clearSubscriptionBacklog,
  deleteTopic,
  peekSubscription,
  requestTopic,
  requestTopicList,
  rollbackSubscription,
  skipSubscriptionMsgs,
  triggerApplySubscriptionTtl,
  triggerClearSubscriptionBacklog,
  triggerDeleteTopic,
  triggerPeekSubscription,
  triggerRequestTopic,
  triggerRequestTopicList,
  triggerRollbackSubscription,
  triggerSkipSubscriptionMsgs,
  triggerUnloadTopic,
  unloadTopic,
} from 'src/store/topic/topic-actions'
import { bindAsyncAction } from 'src/store/util/bind-async-action'
import { takeLatestPayload } from 'src/store/util/take-latest-payload'

const requestTopicListWorker = bindAsyncAction(requestTopicList)(function*(): SagaIterator {
  return yield call(topics.findAll)
})

const requestTopicWorker = bindAsyncAction(requestTopic)(function*({ id }): SagaIterator {
  return yield call(topics.find, id)
})

const deleteTopicWorker = bindAsyncAction(deleteTopic)(function*({ id }): SagaIterator {
  const res = yield call(topics.destroy, id)
  yield put(triggerRequestTopicList())
  return res
})

const clearBacklogWorker = bindAsyncAction(clearSubscriptionBacklog)(function*({
  id,
  subscription,
}): SagaIterator {
  return yield call(topics.clearSubsBacklog, id, subscription)
})

const skipMsgsWorker = bindAsyncAction(skipSubscriptionMsgs)(function*({
  id,
  subscription,
  messages,
}): SagaIterator {
  return yield call(topics.skipMsgs, id, subscription, messages)
})

const applyTllWorker = bindAsyncAction(applySubscriptionTtl)(function*({ id, subscription, ttl }) {
  return yield call(topics.applySubsTtl, id, subscription, ttl)
})

const rollbackWorker = bindAsyncAction(rollbackSubscription)(function*({ id, subscription, time }) {
  return yield call(topics.rollbackSubs, id, subscription, time)
})

const unloadWorker = bindAsyncAction(unloadTopic)(function*({ id }) {
  const res = yield call(topics.unload, id)
  yield put(triggerRequestTopicList())
  return res
})

const peekWorker = bindAsyncAction(peekSubscription)(function*({ id, subscription, position }) {
  return yield call(topics.peekSubs, id, subscription, position)
})

function* watchRequestTopicList(): SagaIterator {
  yield takeLatest(triggerRequestTopicList, requestTopicListWorker)
}

function* watchRequestTopic(): SagaIterator {
  yield takeLatestPayload(triggerRequestTopic, requestTopicWorker)
}

function* watchDeleteTopic(): SagaIterator {
  yield takeLatestPayload(triggerDeleteTopic, deleteTopicWorker)
}

function* watchClearBacklog(): SagaIterator {
  yield takeLatestPayload(triggerClearSubscriptionBacklog, clearBacklogWorker)
}

function* watchSkipMessages(): SagaIterator {
  yield takeLatestPayload(triggerSkipSubscriptionMsgs, skipMsgsWorker)
}

function* watchApplyTtl(): SagaIterator {
  yield takeLatestPayload(triggerApplySubscriptionTtl, applyTllWorker)
}

function* watchRollback(): SagaIterator {
  yield takeLatestPayload(triggerRollbackSubscription, rollbackWorker)
}

function* watchUnload(): SagaIterator {
  yield takeLatestPayload(triggerUnloadTopic, unloadWorker)
}

function* watchPeek(): SagaIterator {
  yield takeLatestPayload(triggerPeekSubscription, peekWorker)
}

export default function* topicSaga(): SagaIterator {
  yield all([
    fork(watchRequestTopicList),
    fork(watchRequestTopic),
    fork(watchDeleteTopic),
    fork(watchClearBacklog),
    fork(watchSkipMessages),
    fork(watchApplyTtl),
    fork(watchRollback),
    fork(watchUnload),
    fork(watchPeek),
  ])
}
