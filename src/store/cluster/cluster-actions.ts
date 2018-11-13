import { NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('CLUSTER')

// Finds all clusters
export const triggerRequestClusterList = actionCreator('TRIGGER_REQUEST_LIST')
export const requestClusterList = actionCreator.async<void, NormalizedPayload>('REQUEST_LIST')

// Finds a cluster by id
export const triggerRequestCluster = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestCluster = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')
