import { denormalize, Schema } from 'normalizr'
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import {
  AsyncErrorState,
  IsLoadingState,
  makeAsyncErrorReducer,
  makeIsLoadingReducer,
} from 'src/store/internal/async'
import { State } from 'src/store/root-reducer'
import { NormalizedPayload } from 'src/store/util/normalize'
import { AsyncActionCreators } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export interface ListProjectionState {
  isLoading: IsLoadingState
  error: AsyncErrorState
  ids: IdsState
}

type IdsState = string[] | null

interface ListProjectionOpts {
  actions: AsyncActionCreators<any, NormalizedPayload, any>
}

export const makeListProjectionReducer = ({ actions }: ListProjectionOpts) => {
  const ids = reducerWithInitialState<IdsState>(null)
    .case(actions.done, (_, { result }) => result.result as string[])
    .build()

  return combineReducers<ListProjectionState>({
    isLoading: makeIsLoadingReducer(actions),
    error: makeAsyncErrorReducer(actions),
    ids,
  })
}

/// Selectors
type ListProjectionGetter<T> = (state: State, params: T) => ListProjectionState | null

export const makeGetListProjection = <Denormalized, T, RequiredEntities = any>(
  getProjection: ListProjectionGetter<T>,
  schema: Schema,
  getRequiredEntities: (state: State) => RequiredEntities
) =>
  createSelector(
    (state: State, params: T) => {
      const projection = getProjection(state, params)
      return projection ? projection.ids : null
    },
    getRequiredEntities,
    (list, entities): Denormalized[] | null => {
      if (!list) return list
      return denormalize(list, [schema] as Schema, entities)
    }
  )

export const makeGetListProjectionIsLoading = <T>(getProjection: ListProjectionGetter<T>) => (
  state: State,
  params: T
) => {
  const projection = getProjection(state, params)
  return projection ? projection.isLoading : false
}

export const makeGetListProjectionError = <T>(getProjection: ListProjectionGetter<T>) => (
  state: State,
  params: T
) => {
  const projection = getProjection(state, params)
  return projection ? projection.error : null
}
