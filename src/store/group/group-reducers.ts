import { combineReducers } from 'redux'
import { createSelector, createStructuredSelector } from 'reselect'
import {
  createGroup,
  CreateGroupPayload,
  deleteGroup,
  DeleteGroupPayload,
  requestGroup,
  requestGroupList,
  updateGroup,
  UpdateGroupPayload,
} from 'src/store/group/group-actions'
import { denormalizeGroup, NormalizedGroup } from 'src/store/group/group-model'
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
import { getNamespaceList } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'

export interface GroupsState {
  list: QueryableListState<NormalizedGroup>
  loading: EntityLoadingState
  create: OperationsByIdState<CreateGroupPayload>
  update: OperationsByIdState<UpdateGroupPayload>
  delete: OperationsByIdState<DeleteGroupPayload>
}

const createId = () => 'create'

export const groupsReducer = combineReducers<GroupsState>({
  list: makeQueryableListReducer({
    actions: requestGroupList,
    getEntities: results => results.entities.groups,
  }),
  loading: makeEntityLoadingReducer(requestGroup),
  create: makeOperationsByIdReducer({
    actions: createGroup,
    getId: createId,
    getRequester: createId,
  }),
  update: makeOperationsByIdReducer({ actions: updateGroup }),
  delete: makeOperationsByIdReducer({ actions: deleteGroup }),
})

interface FilterableByCluster {
  id: string
  cluster?: string
}

export const makeGetGroupNamespaces = () =>
  createSelector(
    getNamespaceList,
    (_: State, { id }: FilterableByCluster) => id,
    (_, { cluster }) => cluster,
    (namespaces, groupId, cluster) =>
      namespaces.filter(
        namespace =>
          namespace.groupId === groupId && (!cluster || namespace.clusters.includes(cluster))
      )
  )

/// Selectors
const getList = (state: State) => state.groups.list
const getLoading = (state: State) => state.groups.loading

const getGroupsSubEntities = createStructuredSelector({})

// Gets the list of all groups
export const getGroupList = makeGetQList(getList, getGroupsSubEntities, denormalizeGroup)

// Gets whether the list of all groups is loading
export const getGroupListIsLoading = makeGetQListIsLoading(getList)

// Creates a selector that gets a group by id
export const makeGetGroup = () =>
  makeGetQListEntity(getList, getGroupsSubEntities, denormalizeGroup)

// Gets whether a group is loading
export const getGroupIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a group
export const getGroupLoadingError = makeGetEntityError(getLoading)

export const getGroupCreateState = makeGetOperationState({
  operationsState: s => s.groups.create,
  getId: createId,
})

export const getGroupUpdateState = makeGetOperationState({
  operationsState: s => s.groups.update,
})

export const getGroupDeleteState = makeGetOperationState({
  operationsState: s => s.groups.delete,
})
