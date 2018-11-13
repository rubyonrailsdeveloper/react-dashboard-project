import { NamespaceEditableProps } from 'src/api/namespaces'
import { CommonOperationParams, NestedId } from 'src/store/constants'
import { NormalizedPayload } from 'src/store/util/normalize'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('NAMESPACE')

// Finds all namespaces
export const triggerRequestNamespaceList = actionCreator('TRIGGER_REQUEST_LIST')
export const requestNamespaceList = actionCreator.async<void, NormalizedPayload>('REQUEST_LIST')

// Finds a namespace by id
export const triggerRequestNamespace = actionCreator<NestedId>('TRIGGER_REQUEST')
export const requestNamespace = actionCreator.async<NestedId, NormalizedPayload>('REQUEST')

// Deletes a namespace by id
export type DeleteNamespacePayload = CommonOperationParams
export const triggerDeleteNamespace = actionCreator<DeleteNamespacePayload>('TRIGGER_DELETE')
export const deleteNamespace = actionCreator.async<DeleteNamespacePayload, {}>('DELETE')

// Creates a namespace
export interface CreateNamespacePayload extends NamespaceEditableProps {
  group: string
  name: string
}
export const triggerCreateNamespace = actionCreator<CreateNamespacePayload>('TRIGGER_CREATE')
export const createNamespace = actionCreator.async<CreateNamespacePayload, {}>('CREATE')

// Partially updates a namespace
export interface UpdateNamespacePayload
  extends Partial<NamespaceEditableProps>,
    CommonOperationParams {}
export const triggerUpdateNamespace = actionCreator<UpdateNamespacePayload>('TRIGGER_UPDATE')
export const updateNamespace = actionCreator.async<UpdateNamespacePayload, {}>('UPDATE')

// Unloads a namespace by id
export type UnloadNamespacePayload = CommonOperationParams
export const triggerUnloadNamespace = actionCreator<UnloadNamespacePayload>('TRIGGER_UNLOAD')
export const unloadNamespace = actionCreator.async<UnloadNamespacePayload, {}>('UNLOAD')

// Clear Backlog
export type ClearNamespaceBacklogPayload = CommonOperationParams
export const triggerClearNamespaceBacklog = actionCreator<ClearNamespaceBacklogPayload>(
  'TRIGGER_CLEAR_BACKLOG'
)
export const clearNamespaceBacklog = actionCreator.async<ClearNamespaceBacklogPayload, {}>(
  'CLEAR_BACKLOG'
)
