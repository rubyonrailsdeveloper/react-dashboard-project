import { CommonOperationParams, NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('PIPELINE')

// Finds all pipelines
export const triggerRequestPipelineList = actionCreator('TRIGGER_REQUEST_PIPELINE_LIST')
export const requestPipelineList = actionCreator.async<void, NormalizedPayload>('REQUEST_LIST')

// Finds a Pipeline by id
export const triggerRequestPipeline = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestPipeline = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')

// Sends a request to the API to activate a Pipeline
export type ActivatePipelinePayload = CommonOperationParams
export const triggerActivatePipeline = actionCreator<CommonOperationParams>('TRIGGER_ACTIVATE')
export const activatePipeline = actionCreator.async<ActivatePipelinePayload, {}>('ACTIVATE')

// Sends a request to the API to deactivate a Pipeline
export type DeactivatePipelinePayload = CommonOperationParams
export const triggerDeactivatePipeline = actionCreator<DeactivatePipelinePayload>(
  'TRIGGER_DEACTIVATE'
)
export const deactivatePipeline = actionCreator.async<DeactivatePipelinePayload, {}>('DEACTIVATE')

// Sends a request to the API to delete a Pipeline
export type DeletePipelinePayload = CommonOperationParams
export const triggerDeletePipeline = actionCreator<DeletePipelinePayload>('TRIGGER_DELETE')
export const deletePipeline = actionCreator.async<DeletePipelinePayload, {}>('DELETE')
