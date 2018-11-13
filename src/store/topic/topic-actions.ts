import { CommonOperationParams, NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('TOPIC')

// Finds all topics
export const triggerRequestTopicList = actionCreator('TRIGGER_REQUEST_LIST')
export const requestTopicList = actionCreator.async<void, NormalizedPayload>('REQUEST_LIST')

// Finds a topic by id
export const triggerRequestTopic = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestTopic = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')

// Deletes a topic by id
export type DeleteTopicPayload = CommonOperationParams
export const triggerDeleteTopic = actionCreator<DeleteTopicPayload>('TRIGGER_DELETE')
export const deleteTopic = actionCreator.async<DeleteTopicPayload, {}>('DELETE')

// Unloads a topic by id
export type UnloadTopicPayload = CommonOperationParams
export const triggerUnloadTopic = actionCreator<UnloadTopicPayload>('TRIGGER_UNLOAD')
export const unloadTopic = actionCreator.async<UnloadTopicPayload, {}>('UNLOAD')

interface CommonSubsOperationPayload extends CommonOperationParams {
  subscription: string
}

// Clear Backlog
export type ClearSubscriptionBacklogPayload = CommonSubsOperationPayload
export const triggerClearSubscriptionBacklog = actionCreator<ClearSubscriptionBacklogPayload>(
  'TRIGGER_CLEAR_BACKLOG'
)
export const clearSubscriptionBacklog = actionCreator.async<ClearSubscriptionBacklogPayload, {}>(
  'CLEAR_BACKLOG'
)

// Skip
export interface SkipSubscriptionMsgsPayload extends CommonSubsOperationPayload {
  messages: number
}
export const triggerSkipSubscriptionMsgs = actionCreator<SkipSubscriptionMsgsPayload>(
  'TRIGGER_SKIP'
)
export const skipSubscriptionMsgs = actionCreator.async<SkipSubscriptionMsgsPayload, {}>('SKIP')

// Apply TTL
export interface ApplySubscriptionTtlPayload extends CommonSubsOperationPayload {
  ttl: number
}
export const triggerApplySubscriptionTtl = actionCreator<ApplySubscriptionTtlPayload>(
  'TRIGGER_APPLY_TTL'
)
export const applySubscriptionTtl = actionCreator.async<ApplySubscriptionTtlPayload, {}>(
  'APPLY_TTL'
)

// Rollback
export interface RollbackSubscriptionPayload extends CommonSubsOperationPayload {
  time: Date
}
export const triggerRollbackSubscription = actionCreator<RollbackSubscriptionPayload>(
  'TRIGGER_ROLLBACK'
)
export const rollbackSubscription = actionCreator.async<RollbackSubscriptionPayload, {}>('ROLLBACK')

// Peek
export interface PeekSubscriptionPayload extends CommonSubsOperationPayload {
  position: number
}
export const triggerPeekSubscription = actionCreator<PeekSubscriptionPayload>('TRIGGER_PEEK')
export const peekSubscription = actionCreator.async<PeekSubscriptionPayload, {}>('PEEK')
