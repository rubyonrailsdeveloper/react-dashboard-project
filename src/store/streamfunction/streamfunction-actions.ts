import { StreamFunctionEditableProps } from 'src/api/streamfunctions'
import { CommonOperationParams, NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('STREAM_FUNCTION')

// Finds all stream functions
export const triggerRequestStreamFunctionList = actionCreator('TRIGGER_REQUEST_LIST')
export const requestStreamFunctionList = actionCreator.async<void, NormalizedPayload>('REQUEST_LIST')

// Finds a stream function by id
export const triggerRequestStreamFunction = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestStreamFunction = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')

// Deletes a stream function by id
export type DeleteStreamFunctionPayload = CommonOperationParams
export const triggerDeleteStreamFunction = actionCreator<DeleteStreamFunctionPayload>('TRIGGER_DELETE')
export const deleteStreamFunction = actionCreator.async<DeleteStreamFunctionPayload, {}>('DELETE')

// Creates a stream function
export type CreateStreamFunctionPayload = StreamFunctionEditableProps
export const triggerCreateStreamFunction = actionCreator<CreateStreamFunctionPayload>('TRIGGER_CREATE')
export const createStreamFunction = actionCreator.async<CreateStreamFunctionPayload, {}>('CREATE')

// Updates a stream function
export interface UpdateStreamFunctionPayload extends StreamFunctionEditableProps, CommonOperationParams {}
export const triggerUpdateStreamFunction = actionCreator<UpdateStreamFunctionPayload>('TRIGGER_UPDATE')
export const updateStreamFunction = actionCreator.async<UpdateStreamFunctionPayload, {}>('UPDATE')
