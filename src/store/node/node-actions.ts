import { NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('NODE')

// Finds all nodes
export const triggerRequestNodeList = actionCreator('TRIGGER_REQUEST_LIST')
export const requestNodeList = actionCreator.async<void, NormalizedPayload>('REQUEST_LIST')

// Finds a node by id
export const triggerRequestNode = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestNode = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')

interface RequestNodesByClusterPayload {
  cluster: string
}
// Finds nodes by cluster id
export const triggerRequestNodesByCluster = actionCreator<RequestNodesByClusterPayload>(
  'TRIGGER_REQUEST_BY_CLUSTER'
)
export const requestNodesByCluster = actionCreator.async<
  RequestNodesByClusterPayload,
  NormalizedPayload
>('REQUEST_BY_CLUSTER')
