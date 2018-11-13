import { NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('PHYSICAL_PLAN')

// Finds the physical plan of a Pipeline by pipeline id (which is a 1:1 relationship)
export const triggerRequestPhysicalPlan = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestPhysicalPlan = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')
