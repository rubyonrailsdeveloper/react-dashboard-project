import { combineReducers } from 'redux'
import { createStructuredSelector } from 'reselect'
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
import { State } from 'src/store/root-reducer'
import {
  createUser,
  CreateUserPayload,
  deleteUser,
  DeleteUserPayload,
  requestUser,
  requestUserList,
  updateUser,
  UpdateUserPayload,
} from 'src/store/user/user-actions'
import { denormalizeUser, User } from 'src/store/user/user-model'

const createId = () => 'create'

export interface UsersState {
  list: QueryableListState<User>
  loading: EntityLoadingState
  create: OperationsByIdState<CreateUserPayload>
  update: OperationsByIdState<UpdateUserPayload>
  delete: OperationsByIdState<DeleteUserPayload>
}

export const usersReducer = combineReducers<UsersState>({
  list: makeQueryableListReducer({
    actions: requestUserList,
    getEntities: results => results.entities.users,
  }),
  loading: makeEntityLoadingReducer(requestUser),
  create: makeOperationsByIdReducer({
    actions: createUser,
    getId: createId,
    getRequester: createId,
  }),
  update: makeOperationsByIdReducer({ actions: updateUser }),
  delete: makeOperationsByIdReducer({ actions: deleteUser }),
})

/// Selectors
const getList = (state: State) => state.users.list
const getLoading = (state: State) => state.users.loading

const getUsersSubEntities = createStructuredSelector({})

// Gets the list of all users
export const getUserList = makeGetQList(getList, getUsersSubEntities, denormalizeUser)

// Gets whether the list of all users is loading
export const getUserListIsLoading = makeGetQListIsLoading(getList)

// Creates a selector that gets a user by id
export const makeGetUser = () => makeGetQListEntity(getList, getUsersSubEntities, denormalizeUser)

// Gets whether a user is loading
export const getUserIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a user
export const getUserLoadingError = makeGetEntityError(getLoading)

// Create operation for user
export const getUserCreateState = makeGetOperationState({
  operationsState: s => s.users.create,
  getId: createId,
})

// Update operation for user
export const getUserUpdateState = makeGetOperationState({
  operationsState: s => s.users.update,
})

// Delete operation for user
export const getUserDeleteState = makeGetOperationState({
  operationsState: s => s.users.delete,
})
