import { AsyncAction, isAsyncFailure, isAsyncStarted } from 'src/store/util/reducer'
import { AsyncActionCreators } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export const isLoading = (action: AsyncAction<any, any>) => isAsyncStarted(action)

export const asyncFailure = (action: AsyncAction<any, any>) =>
  isAsyncFailure(action) ? action.payload.error : null

export type IsLoadingState = boolean

export const makeIsLoadingReducer = (actions: AsyncActionCreators<any, any, any>) =>
  reducerWithInitialState<IsLoadingState>(false)
    .case(actions.started, () => true)
    .cases([actions.failed, actions.done], () => false)
    .build()

export type AsyncErrorState<E = object> = E | null

export const makeAsyncErrorReducer = <E>(actions: AsyncActionCreators<any, any, E>) =>
  reducerWithInitialState<AsyncErrorState<E>>(null)
    .case(actions.failed, (_, { error }) => error)
    .case(actions.done, () => null)
    .build()
