import flatMap from 'lodash-es/flatMap'
import { combineReducers } from 'redux'
import { createSelector, createStructuredSelector } from 'reselect'
import {
  EntityLoadingState,
  makeEntityLoadingReducer,
  makeGetEntityError,
  makeGetEntityIsLoading,
} from 'src/store/internal/entity-loading'
import {
  makeGetQList,
  makeGetQListEntity,
  makeGetQListIsLoading,
  makeQueryableListReducer,
  QueryableListState,
} from 'src/store/internal/list'
import {
  makeGetOperationState,
  makeOperationsByIdReducer,
  OperationsByIdState,
} from 'src/store/internal/operation'
import { State } from 'src/store/root-reducer'
import { ParametricSelector } from 'src/store/selectors'
import {
  applySubscriptionTtl,
  ApplySubscriptionTtlPayload,
  clearSubscriptionBacklog,
  ClearSubscriptionBacklogPayload,
  deleteTopic,
  DeleteTopicPayload,
  peekSubscription,
  PeekSubscriptionPayload,
  requestTopic,
  requestTopicList,
  rollbackSubscription,
  RollbackSubscriptionPayload,
  skipSubscriptionMsgs,
  SkipSubscriptionMsgsPayload,
  unloadTopic,
  UnloadTopicPayload,
} from 'src/store/topic/topic-actions'
import {
  Consumer,
  ConsumerWithSubsData,
  denormalizeTopic,
  NormalizedTopic,
  Topic,
} from 'src/store/topic/topic-model'
import { AsyncAction, asyncParams } from 'src/store/util/reducer'

export interface TopicsState {
  list: QueryableListState<NormalizedTopic>
  loading: EntityLoadingState
  delete: OperationsByIdState<DeleteTopicPayload>
  unload: OperationsByIdState<UnloadTopicPayload>
  clearBacklog: OperationsByIdState<ClearSubscriptionBacklogPayload>
  applyTtl: OperationsByIdState<ApplySubscriptionTtlPayload>
  skipMsgs: OperationsByIdState<SkipSubscriptionMsgsPayload>
  rollback: OperationsByIdState<RollbackSubscriptionPayload>
  peek: OperationsByIdState<PeekSubscriptionPayload>
}

interface SubscriptionKey {
  id: string // topic id
  subscription: string
}

const subsOpId = ({ id, subscription }: SubscriptionKey) => `${id}:${subscription}`

const subsOpOpts = {
  getId<P extends SubscriptionKey>(action: AsyncAction<P, {}>) {
    return subsOpId(asyncParams(action))
  },
}

export const topicsReducer = combineReducers<TopicsState>({
  list: makeQueryableListReducer({
    actions: requestTopicList,
    getEntities: results => results.entities.topics,
  }),
  loading: makeEntityLoadingReducer(requestTopic),
  delete: makeOperationsByIdReducer({ actions: deleteTopic }),
  unload: makeOperationsByIdReducer({ actions: unloadTopic }),
  clearBacklog: makeOperationsByIdReducer({
    ...subsOpOpts,
    actions: clearSubscriptionBacklog,
  }),
  applyTtl: makeOperationsByIdReducer({ ...subsOpOpts, actions: applySubscriptionTtl }),
  skipMsgs: makeOperationsByIdReducer({ ...subsOpOpts, actions: skipSubscriptionMsgs }),
  rollback: makeOperationsByIdReducer({ ...subsOpOpts, actions: rollbackSubscription }),
  peek: makeOperationsByIdReducer({ ...subsOpOpts, actions: peekSubscription }),
})

/// Selectors
const getList = (state: State) => state.topics.list
const getLoading = (state: State) => state.topics.loading

const getTopicsSubEntities = createStructuredSelector({})

// Gets the list of all topics
export const getTopicList = makeGetQList(getList, getTopicsSubEntities, denormalizeTopic)

// Gets whether the list of all topics is loading
export const getTopicListIsLoading = makeGetQListIsLoading(getList)

// Gets the list of all topics in a given namespace id
export const makeGetTopicsByNamespace = () =>
  createSelector(
    getTopicList,
    (_: State, { namespaceId }: { namespaceId: string }) => namespaceId,
    (topics, namespaceId) => topics.filter(topic => topic.namespaceId === namespaceId)
  )

// Creates a selector that gets a topic by id
export const makeGetTopic = () =>
  makeGetQListEntity(getList, getTopicsSubEntities, denormalizeTopic)

// Gets whether a topic is loading
export const getTopicIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a topic
export const getTopicLoadingError = makeGetEntityError(getLoading)

// Gets the consumers of a topic
export const customGetConsumers = <Props>(getTopic: ParametricSelector<Props, Topic | null>) =>
  createSelector(getTopic, (topic): ConsumerWithSubsData[] | null => {
    if (!topic) return topic
    return flatMap(Object.entries(topic.subscriptions), ([subscriptionId, subscription]) =>
      subscription.consumers.map((c: Consumer) => ({
        topicId: topic.id,
        subscription,
        subscriptionId,
        ...c,
      }))
    )
  })

export const getTopicDeleteState = makeGetOperationState({
  operationsState: s => s.topics.delete,
})

export const getUnloadTopicState = makeGetOperationState({
  operationsState: s => s.topics.unload,
})

const subsSelectorOpts = {
  getId: subsOpId,
}

export const getClearSubscriptionBacklogState = makeGetOperationState({
  ...subsSelectorOpts,
  operationsState: s => s.topics.clearBacklog,
})

export const getApplySubscriptionTtlState = makeGetOperationState({
  ...subsSelectorOpts,
  operationsState: s => s.topics.applyTtl,
})

export const getSkipSubscriptionMsgsState = makeGetOperationState({
  ...subsSelectorOpts,
  operationsState: s => s.topics.skipMsgs,
})

export const getRollbackSubscriptionState = makeGetOperationState({
  ...subsSelectorOpts,
  operationsState: s => s.topics.rollback,
})

export const getPeekSubscriptionState = makeGetOperationState({
  ...subsSelectorOpts,
  operationsState: s => s.topics.peek,
})
