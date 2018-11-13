import { combineReducers } from 'redux'
import { createSelector, createStructuredSelector } from 'reselect'
import {
  EntityLoadingState,
  makeEntityLoadingReducer,
  makeGetEntityError,
  makeGetEntityIsLoading,
} from 'src/store/internal/entity-loading'
import {
  makeGetQList,
  makeGetQListEntity,
  makeGetQListIsLoading,
  makeQueryableListReducer,
  QueryableListState,
} from 'src/store/internal/list'
import {
  makeGetOperationState,
  makeOperationsByIdReducer,
  OperationsByIdState,
} from 'src/store/internal/operation'
import {
  clearNamespaceBacklog,
  ClearNamespaceBacklogPayload,
  createNamespace,
  CreateNamespacePayload,
  deleteNamespace,
  DeleteNamespacePayload,
  requestNamespace,
  requestNamespaceList,
  unloadNamespace,
  UnloadNamespacePayload,
  updateNamespace,
  UpdateNamespacePayload,
} from 'src/store/namespace/namespace-actions'
import { denormalizeNamespace, NormalizedNamespace } from 'src/store/namespace/namespace-model'
import { getPipelineWithResourcesList } from 'src/store/pipeline/pipeline-reducers'
import { State } from 'src/store/root-reducer'
import { getTopicList } from 'src/store/topic/topic-reducers'

export interface NamespacesState {
  list: QueryableListState<NormalizedNamespace>
  loading: EntityLoadingState
  create: OperationsByIdState<CreateNamespacePayload>
  update: OperationsByIdState<UpdateNamespacePayload>
  delete: OperationsByIdState<DeleteNamespacePayload>
  unload: OperationsByIdState<UnloadNamespacePayload>
  clearBacklog: OperationsByIdState<ClearNamespaceBacklogPayload>
}

const createId = () => 'create'

export const namespacesReducer = combineReducers<NamespacesState>({
  list: makeQueryableListReducer({
    actions: requestNamespaceList,
    getEntities: results => results.entities.namespaces,
  }),
  loading: makeEntityLoadingReducer(requestNamespace),
  create: makeOperationsByIdReducer({
    actions: createNamespace,
    getId: createId,
    getRequester: createId,
  }),
  update: makeOperationsByIdReducer({ actions: updateNamespace }),
  delete: makeOperationsByIdReducer({ actions: deleteNamespace }),
  unload: makeOperationsByIdReducer({ actions: unloadNamespace }),
  clearBacklog: makeOperationsByIdReducer({ actions: clearNamespaceBacklog }),
})

/// Selectors
const getList = (state: State) => state.namespaces.list
const getLoading = (state: State) => state.namespaces.loading

const getNamespacesSubEntities = createStructuredSelector({})

// Gets the list of all namespaces
export const getNamespaceList = makeGetQList(
  getList,
  getNamespacesSubEntities,
  denormalizeNamespace
)

// Gets whether the list of all namespaces is loading
export const getNamespaceListIsLoading = makeGetQListIsLoading(getList)

// Creates a selector that gets a namespace by id
export const makeGetNamespace = () =>
  makeGetQListEntity(getList, getNamespacesSubEntities, denormalizeNamespace)

// Gets whether a namespace is loading
export const getNamespaceIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a namespace
export const getNamespaceLoadingError = makeGetEntityError(getLoading)

// Gets the list of all namespaces in a given group id
export const makeGetNamespacesByGroup = () =>
  createSelector(
    getNamespaceList,
    (_: State, { groupId }: { groupId: string }) => groupId,
    (namespaces, groupId) => namespaces.filter(namespace => namespace.groupId === groupId)
  )

// Gets the list of all namespaces in a given cluster id
export const makeGetNamespacesByCluster = () =>
  createSelector(
    getNamespaceList,
    (_: State, { cluster }: { cluster: string }) => cluster,
    (namespaces, cluster) => namespaces.filter(namespace => namespace.clusters.includes(cluster))
  )

interface FilterableByCluster {
  id: string
  cluster?: string
}

// Gets the list of all topics in a given namespace id
export const makeGetNamespaceTopics = () =>
  createSelector(
    getTopicList,
    (_: State, { id }: FilterableByCluster) => id,
    (_, { cluster }) => cluster,
    (topics, namespaceId, cluster) =>
      topics.filter(
        topic => topic.namespaceId === namespaceId && (!cluster || topic.clusters.includes(cluster))
      )
  )

// Gets the list of all pipelines in a given namespace id
export const makeGetNamespacePipelines = () =>
  createSelector(
    getPipelineWithResourcesList,
    (_: State, { id }: FilterableByCluster) => id,
    (_, { cluster }) => cluster,
    (pipelines, namespaceId, cluster) =>
      pipelines.filter(
        pipeline =>
          pipeline.namespaceId === namespaceId && (!cluster || pipeline.clusters.includes(cluster))
      )
  )

export const getNamespaceCreateState = makeGetOperationState({
  operationsState: s => s.namespaces.create,
  getId: createId,
})

export const getNamespaceUpdateState = makeGetOperationState({
  operationsState: s => s.namespaces.update,
})

export const getNamespaceDeleteState = makeGetOperationState({
  operationsState: s => s.namespaces.delete,
})

export const getNamespaceUnloadState = makeGetOperationState({
  operationsState: s => s.namespaces.unload,
})

export const getNamespaceClearBacklogState = makeGetOperationState({
  operationsState: s => s.namespaces.clearBacklog,
})
