import { NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('CONTAINER')

// Finds a container by id
export const triggerRequestContainer = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestContainer = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')
