import { combineReducers } from 'redux'
import { createStructuredSelector } from 'reselect'
import { requestCluster, requestClusterList } from 'src/store/cluster/cluster-actions'
import { denormalizeCluster, NormalizedCluster } from 'src/store/cluster/cluster-model'
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
import { State } from 'src/store/root-reducer'

export interface ClustersState {
  list: QueryableListState<NormalizedCluster>
  loading: EntityLoadingState
}

export const clustersReducer = combineReducers<ClustersState>({
  list: makeQueryableListReducer({
    actions: requestClusterList,
    getEntities: results => results.entities.clusters,
  }),
  loading: makeEntityLoadingReducer(requestCluster),
})

/// Selectors
const getList = (state: State) => state.clusters.list
const getLoading = (state: State) => state.clusters.loading

const getClustersSubEntities = createStructuredSelector({})

// Gets the list of all clusters
export const getClusterList = makeGetQList(getList, getClustersSubEntities, denormalizeCluster)

// Gets whether the list of all clusters is loading
export const getClusterListIsLoading = makeGetQListIsLoading(getList)

// Creates a selector that gets a cluster by id
export const makeGetCluster = () =>
  makeGetQListEntity(getList, getClustersSubEntities, denormalizeCluster)

// Gets whether a cluster is loading
export const getClusterIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a cluster
export const getClusterLoadingError = makeGetEntityError(getLoading)
