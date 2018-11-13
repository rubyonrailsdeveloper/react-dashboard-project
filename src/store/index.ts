import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import authSaga from 'src/store/auth/auth-sagas'
import clusterSaga from 'src/store/cluster/cluster-sagas'
import containerSaga from 'src/store/container/container-sagas'
import groupSaga from 'src/store/group/group-sagas'
import metricsSaga from 'src/store/metrics/metrics-saga'
import namespaceSaga from 'src/store/namespace/namespace-sagas'
import nodeSaga from 'src/store/node/node-sagas'
import physicalPlanSaga from 'src/store/physical-plan/physical-plan-sagas'
import pipelineSaga from 'src/store/pipeline/pipeline-sagas'
import { rootReducer, State } from 'src/store/root-reducer'
import topicSaga from 'src/store/topic/topic-sagas'
import uiSaga from 'src/store/ui/ui-sagas'
import userSaga from 'src/store/user/user-sagas'
import storage from 'src/util/storage'

const composeEnhancers: typeof compose =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function* rootSaga() {
  yield all([
    authSaga(),
    pipelineSaga(),
    physicalPlanSaga(),
    topicSaga(),
    metricsSaga(),
    namespaceSaga(),
    groupSaga(),
    clusterSaga(),
    nodeSaga(),
    userSaga(),
    containerSaga(),
    uiSaga(),
  ])
}

export default () => {
  const persistedState = storage.load()
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore<State>(
    rootReducer,
    persistedState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  )

  sagaMiddleware.run(rootSaga)

  return store
}
