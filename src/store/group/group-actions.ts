import { GroupEditableProps } from 'src/api/groups'
import { CommonOperationParams, NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('GROUP')

// Finds all groups
export const triggerRequestGroupList = actionCreator('TRIGGER_REQUEST_LIST')
export const requestGroupList = actionCreator.async<void, NormalizedPayload>('REQUEST_LIST')

// Finds a group by id
export const triggerRequestGroup = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestGroup = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')

// Deletes a group by id
export type DeleteGroupPayload = CommonOperationParams
export const triggerDeleteGroup = actionCreator<DeleteGroupPayload>('TRIGGER_DELETE')
export const deleteGroup = actionCreator.async<DeleteGroupPayload, {}>('DELETE')

// Creates a group
export type CreateGroupPayload = GroupEditableProps
export const triggerCreateGroup = actionCreator<CreateGroupPayload>('TRIGGER_CREATE')
export const createGroup = actionCreator.async<CreateGroupPayload, {}>('CREATE')

// Updates a group
export interface UpdateGroupPayload extends GroupEditableProps, CommonOperationParams {}
export const triggerUpdateGroup = actionCreator<UpdateGroupPayload>('TRIGGER_UPDATE')
export const updateGroup = actionCreator.async<UpdateGroupPayload, {}>('UPDATE')
