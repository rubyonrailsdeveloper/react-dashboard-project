import { combineReducers } from 'redux'
import { NestedId } from 'src/store/constants'
import {
  AsyncErrorState,
  IsLoadingState,
  makeAsyncErrorReducer,
  makeIsLoadingReducer,
} from 'src/store/internal/async'
import { State } from 'src/store/root-reducer'
import { AsyncAction, asyncParams } from 'src/store/util/reducer'
import { AsyncActionCreators } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export interface EntityLoadingState {
  [id: string]: ItemLoadingState
}

interface ItemLoadingState {
  isLoading: IsLoadingState
  error: AsyncErrorState<object>
}

const entityLoadingInitState: EntityLoadingState = {}

export const makeEntityLoadingReducer = <A extends AsyncActionCreators<NestedId, any, any>>(
  asyncActions: A
) => {
  const { started, done, failed } = asyncActions

  const itemLoadingReducer = combineReducers<ItemLoadingState>({
    isLoading: makeIsLoadingReducer(asyncActions),
    error: makeAsyncErrorReducer(asyncActions),
  })

  return reducerWithInitialState(entityLoadingInitState)
    .casesWithAction([started, failed], (state, action: AsyncAction<NestedId, any>) => {
      const id = asyncParams(action).id

      return {
        ...state,
        [id]: itemLoadingReducer(state[id], action),
      }
    })
    .case(done, (state, payload) => {
      const next = { ...state }
      delete next[payload.params.id]
      return next
    })
    .build()
}

/// Selectors
type LoadingGetter = (state: State) => EntityLoadingState

export const makeGetEntityIsLoading = (getLoading: LoadingGetter) => (
  state: State,
  { id }: NestedId
) => {
  const status = getLoading(state)[id]
  return status && status.isLoading
}

export const makeGetEntityError = (getLoading: LoadingGetter) => (
  state: State,
  { id }: NestedId
) => {
  const status = getLoading(state)[id]
  return status && status.error
}
