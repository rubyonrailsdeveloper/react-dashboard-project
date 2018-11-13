import { UserEditableProps } from 'src/api/users'
import { CommonOperationParams, NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('USER')

// Finds all users
export const triggerRequestUserList = actionCreator('TRIGGER_REQUEST_LIST')
export const requestUserList = actionCreator.async<void, NormalizedPayload>('REQUEST_LIST')

// Finds a user by id
export const triggerRequestUser = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestUser = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')

// Deletes a user by id
export type DeleteUserPayload = CommonOperationParams
export const triggerDeleteUser = actionCreator<DeleteUserPayload>('TRIGGER_DELETE')
export const deleteUser = actionCreator.async<DeleteUserPayload, {}>('DELETE')

// Creates a user
export type CreateUserPayload = UserEditableProps
export const triggerCreateUser = actionCreator<CreateUserPayload>('TRIGGER_CREATE')
export const createUser = actionCreator.async<CreateUserPayload, {}>('CREATE')

// Updates a user
export interface UpdateUserPayload extends UserEditableProps, CommonOperationParams {}
export const triggerUpdateUser = actionCreator<UpdateUserPayload>('TRIGGER_UPDATE')
export const updateUser = actionCreator.async<UpdateUserPayload, {}>('UPDATE')
