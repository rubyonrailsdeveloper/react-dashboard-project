import { combineReducers } from 'redux'
import {
  // createSelector,
  createStructuredSelector
} from 'reselect'

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
// import { getNamespaceList } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'
import {
  createStreamFunction,
  CreateStreamFunctionPayload,
  deleteStreamFunction,
  DeleteStreamFunctionPayload,
  requestStreamFunction,
  requestStreamFunctionList,
  updateStreamFunction,
  UpdateStreamFunctionPayload,
} from 'src/store/streamfunction/streamfunction-actions'
import { denormalizeStreamFunction, NormalizedStreamFunction } from 'src/store/streamfunction/streamfunction-model'

export interface StreamFunctionsState {
  list: QueryableListState<NormalizedStreamFunction>
  loading: EntityLoadingState
  create: OperationsByIdState<CreateStreamFunctionPayload>
  update: OperationsByIdState<UpdateStreamFunctionPayload>
  delete: OperationsByIdState<DeleteStreamFunctionPayload>
}

const createId = () => 'create'

export const streamFunctionsReducer = combineReducers<StreamFunctionsState>({
  list: makeQueryableListReducer({
    actions: requestStreamFunctionList,
    getEntities: results => results.entities.streamFunctions
  }),
  loading: makeEntityLoadingReducer(requestStreamFunction),
  create: makeOperationsByIdReducer({
    actions: createStreamFunction,
    getId: createId,
    getRequester: createId,
  }),
  update: makeOperationsByIdReducer({ actions: updateStreamFunction }),
  delete: makeOperationsByIdReducer({ actions: deleteStreamFunction }),
})

// interface FilterableByCluster {
//   id: string
//   cluster?: string
// }

// export const makeGetStreamFunctionNamespaces = () =>
//   createSelector(
//     getNamespaceList,
//     (_: State, { id }: FilterableByCluster) => id,
//     (_, { cluster }) => cluster,
//     (namespaces, streamFunctionId, cluster) =>
//       namespaces.filter(
//         namespace =>
//           namespace.streamFunctionId === streamFunctionId && (!cluster || namespace.clusters.includes(cluster))
//       )
//   )

/// Selectors
const getList = (state: State) => state.streamFunctions.list
const getLoading = (state: State) => state.streamFunctions.loading

const getStreamFunctionsSubEntities = createStructuredSelector({})

// Gets the list of all stream functions
export const getStreamFunctionList = makeGetQList(getList, getStreamFunctionsSubEntities, denormalizeStreamFunction)

// Gets whether the list of all stream functions is loading
export const getStreamFunctionListIsLoading = makeGetQListIsLoading(getList)

// Creates a selector that gets a stream function by id
export const makeGetStreamFunction = () =>
  makeGetQListEntity(getList, getStreamFunctionsSubEntities, denormalizeStreamFunction)

// Gets whether a stream function is loading
export const getStreamFunctionIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a stream function
export const getStreamFunctionLoadingError = makeGetEntityError(getLoading)

export const getStreamFunctionCreateState = makeGetOperationState({
  operationsState: s => s.streamFunctions.create,
  getId: createId,
})

export const getStreamFunctionUpdateState = makeGetOperationState({
  operationsState: s => s.streamFunctions.update,
})

export const getStreamFunctionDeleteState = makeGetOperationState({
  operationsState: s => s.streamFunctions.delete,
})
