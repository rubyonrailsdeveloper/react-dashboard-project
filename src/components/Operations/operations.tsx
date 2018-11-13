import _uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import {
  activatePipelineProps,
  clearBacklogNamespaceProps,
  clearBacklogSubscriptionProps,
  deactivatePipelineProps,
  deleteGroupProps,
  deleteNamespaceProps,
  deleteTopicProps,
  deleteUserProps,
  terminatePipelineProps,
  unloadNamespaceProps,
  unloadTopicProps,
} from 'src/components/Operations/internal/operationProps'
import makeOperationWithDialog from 'src/components/Operations/internal/OperationWithDialog'
import {
  ClearBacklogProps,
  ConfirmationProps,
  DialogBaseProps,
  NestedIdSubscription,
} from 'src/components/Operations/internal/types'
import { NestedId } from 'src/store/constants'
import { DeleteGroupPayload, triggerDeleteGroup } from 'src/store/group/group-actions'
import { getGroupDeleteState } from 'src/store/group/group-reducers'
import {
  ClearNamespaceBacklogPayload,
  DeleteNamespacePayload,
  triggerClearNamespaceBacklog,
  triggerDeleteNamespace,
  triggerUnloadNamespace,
  UnloadNamespacePayload,
} from 'src/store/namespace/namespace-actions'
import {
  getNamespaceClearBacklogState,
  getNamespaceDeleteState,
  getNamespaceUnloadState,
} from 'src/store/namespace/namespace-reducers'
import {
  ActivatePipelinePayload,
  DeactivatePipelinePayload,
  DeletePipelinePayload,
  triggerActivatePipeline,
  triggerDeactivatePipeline,
  triggerDeletePipeline,
} from 'src/store/pipeline/pipeline-actions'
import {
  getPipelineActivateState,
  getPipelineDeactivateState,
  getPipelineDeleteState,
} from 'src/store/pipeline/pipeline-reducers'
import { State } from 'src/store/root-reducer'
import {
  ClearSubscriptionBacklogPayload,
  DeleteTopicPayload,
  triggerClearSubscriptionBacklog,
  triggerDeleteTopic,
  triggerUnloadTopic,
  UnloadTopicPayload,
} from 'src/store/topic/topic-actions'
import {
  getClearSubscriptionBacklogState,
  getTopicDeleteState,
  getUnloadTopicState,
} from 'src/store/topic/topic-reducers'
import { DeleteUserPayload, triggerDeleteUser } from 'src/store/user/user-actions'
import { getUserDeleteState, makeGetUser } from 'src/store/user/user-reducers'

// Group Operations
const DeleteGroupOperation = makeOperationWithDialog<DeleteGroupPayload, ConfirmationProps>()

// Namespace Operations
const ClearBacklogNamespaceOperation = makeOperationWithDialog<
  ClearNamespaceBacklogPayload,
  DialogBaseProps
>()
const DeleteNamespaceOperation = makeOperationWithDialog<
  DeleteNamespacePayload,
  ConfirmationProps
>()
const UnloadNamespaceOperation = makeOperationWithDialog<UnloadNamespacePayload, DialogBaseProps>()

// Pipeline Operations
const TerminatePipelineOperation = makeOperationWithDialog<
  DeletePipelinePayload,
  ConfirmationProps
>()
const DeactivatePipelineOperation = makeOperationWithDialog<
  DeactivatePipelinePayload,
  DialogBaseProps
>()
const ActivatePipelineOperation = makeOperationWithDialog<
  ActivatePipelinePayload,
  DialogBaseProps
>()

// Subscription Operations
const ClearBacklogSubscriptionOperation = makeOperationWithDialog<
  ClearSubscriptionBacklogPayload,
  ClearBacklogProps
>()

// Topic Operations
const DeleteTopicOperation = makeOperationWithDialog<DeleteTopicPayload, ConfirmationProps>()

const UnloadTopicOperation = makeOperationWithDialog<UnloadTopicPayload, DialogBaseProps>()

// User Operations
const DeleteUserOperation = makeOperationWithDialog<DeleteUserPayload, ConfirmationProps>()

// Group Operations
export const DeleteGroup = connect(
  () => {
    return (state: State, { id }: NestedId) => {
      const name = id.split('/').pop()
      return {
        dialogBody: (
          <span>
            Are you sure you want to delete group <span className="delete-entity-name">{name}</span>?
          </span>
        ),
        toastSuccessText: `Group ${id} was deleted`,
        toastFailureText: `Group ${id} could not be deleted`,
        operation: getGroupDeleteState(state, { id }) as any, // todo: remove as any
        requester: _uniqueId('GroupDelete'),
        ...deleteGroupProps,
      }
    }
  },
  {
    triggerOperation: triggerDeleteGroup,
  }
)(DeleteGroupOperation)

// Namespace Operations
export const DeleteNamespace = connect(
  () => {
    return (state: State, { id }: NestedId) => {
      const name = id.split('/').pop()
      return {
        dialogBody: (
          <span>
            Are you sure you want to delete namespace{' '}
            <span className="delete-entity-name">{name}</span>?
          </span>
        ),
        toastSuccessText: `Namespace ${id} was deleted`,
        toastFailureText: `Namespace ${id} could not be deleted`,
        operation: getNamespaceDeleteState(state, { id }) as any, // todo: remove as any
        requester: _uniqueId('DeleteNamespace'),
        ...deleteNamespaceProps,
      }
    }
  },
  {
    triggerOperation: triggerDeleteNamespace,
  }
)(DeleteNamespaceOperation)

export const UnloadNamespace = connect(
  () => {
    return (state: State, { id }: NestedId) => ({
      toastSuccessText: `Namespace ${id} was unloaded`,
      toastFailureText: `Namespace ${id} could not be unloaded`,
      operation: getNamespaceUnloadState(state, { id }) as any, // todo: remove as any
      requester: _uniqueId('UnloadNamespace'),
      ...unloadNamespaceProps,
    })
  },
  {
    triggerOperation: triggerUnloadNamespace,
  }
)(UnloadNamespaceOperation)

export const ClearBacklogNamespace = connect(
  () => {
    return (state: State, { id }: NestedId) => ({
      toastSuccessText: `Namespace ${id} was cleared`,
      toastFailureText: `Namespace ${id} could not be cleared`,
      operation: getNamespaceClearBacklogState(state, { id }) as any, // todo: remove as any
      requester: _uniqueId('ClearBacklogNamespace'),
      ...clearBacklogNamespaceProps,
    })
  },
  {
    triggerOperation: triggerClearNamespaceBacklog,
  }
)(ClearBacklogNamespaceOperation)

// Pipeline Operations
export const TerminatePipeline = connect(
  () => {
    return (state: State, { id }: NestedId) => {
      const name = id.split('/').pop()
      return {
        dialogBody: (
          <span>
            Are you sure you want to terminate pipeline{' '}
            <span className="delete-entity-name">{name}</span>?
          </span>
        ),
        toastSuccessText: `Pipeline ${id} was deleted`,
        toastFailureText: `Pipeline ${id} could not be deleted`,
        operation: getPipelineDeleteState(state, { id }) as any, // todo: remove as any
        requester: _uniqueId('TerminatePipeline'),
        ...terminatePipelineProps,
      }
    }
  },
  {
    triggerOperation: triggerDeletePipeline,
  }
)(TerminatePipelineOperation)

export const DeactivatePipeline = connect(
  () => {
    return (state: State, { id }: NestedId) => ({
      toastSuccessText: `Pipeline ${id} was deactivated`,
      toastFailureText: `Pipeline ${id} could not be deactivated`,
      operation: getPipelineDeactivateState(state, { id }) as any, // todo: remove as any
      requester: _uniqueId('DeactivatePipeline'),
      ...deactivatePipelineProps,
    })
  },
  {
    triggerOperation: triggerDeactivatePipeline,
  }
)(DeactivatePipelineOperation)

export const ActivatePipeline = connect(
  () => {
    return (state: State, { id }: NestedId) => ({
      toastSuccessText: `Pipeline ${id} was activated`,
      toastFailureText: `Pipeline ${id} could not be activated`,
      operation: getPipelineActivateState(state, { id }) as any, // todo: remove as any
      requester: _uniqueId('ActivatePipeline'),
      ...activatePipelineProps,
    })
  },
  {
    triggerOperation: triggerActivatePipeline,
  }
)(ActivatePipelineOperation)

// Subscription Operations
export const ClearBacklogSubscription = connect(
  () => {
    return (state: State, { id, subscription }: NestedIdSubscription) => ({
      toastSuccessText: `Backlog was cleared in subscription ${id}`,
      toastFailureText: `Subscription ${id} backlog could not was cleared`,
      dialogBody: `Are you sure you want to clear the backlog of subscription ${id}?`,
      operation: getClearSubscriptionBacklogState(state, { id, subscription }) as any, // todo: remove as any
      requester: _uniqueId('ClearBacklogSubscription'),
      ...clearBacklogSubscriptionProps,
    })
  },
  {
    triggerOperation: triggerClearSubscriptionBacklog,
  }
)(ClearBacklogSubscriptionOperation)

// Topic Operations
export const DeleteTopic = connect(
  () => {
    return (state: State, { id }: NestedId) => {
      const name = id.split('/').pop()
      return {
        dialogBody: (
          <span>
            Are you sure you want to delete topic <span className="delete-entity-name">{name}</span>?
          </span>
        ),
        toastSuccessText: `Topic ${id} was deleted`,
        toastFailureText: `Topic ${id} could not be deleted`,
        operation: getTopicDeleteState(state, { id }) as any, // todo: remove as any
        requester: _uniqueId('DeleteTopic'),
        ...deleteTopicProps,
      }
    }
  },
  {
    triggerOperation: triggerDeleteTopic,
  }
)(DeleteTopicOperation)

export const UnloadTopic = connect(
  () => {
    return (state: State, { id }: NestedId) => ({
      toastSuccessText: `Topic ${id} was unloaded`,
      toastFailureText: `Topic ${id} could not be unloaded`,
      operation: getUnloadTopicState(state, { id }) as any, // todo: remove as any
      requester: _uniqueId('UnloadTopic'),
      ...unloadTopicProps,
    })
  },
  {
    triggerOperation: triggerUnloadTopic,
  }
)(UnloadTopicOperation)

// User Operations
export const DeleteUser = connect(
  () => {
    const getUser = makeGetUser()
    return (state: State, { id }: NestedId) => {
      const user = getUser(state, { id })
      return {
        dialogBody: (
          <span>
            Are you sure you want to delete user{' '}
            <span className="delete-entity-name">
              {user!.name} ({user!.email})
            </span>?
          </span>
        ),
        toastSuccessText: `User ${id} was deleted`,
        toastFailureText: `User ${id} could not be deleted`,
        operation: getUserDeleteState(state, { id }) as any, // todo: remove as any
        requester: _uniqueId('DeleteUser'),
        ...deleteUserProps,
      }
    }
  },
  {
    triggerOperation: triggerDeleteUser,
  }
)(DeleteUserOperation)
