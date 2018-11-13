import { combineReducers, Reducer } from 'redux'
import { CommonOperationParams, NestedId, Requester } from 'src/store/constants'
import {
  AsyncErrorState,
  IsLoadingState,
  makeAsyncErrorReducer,
  makeIsLoadingReducer,
} from 'src/store/internal/async'
import { State } from 'src/store/root-reducer'
import { ParametricSelector, Selector } from 'src/store/selectors'
import { AsyncAction, asyncParams } from 'src/store/util/reducer'
import { AsyncActionCreators } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export interface OperationState<S, E = object> {
  isLoading: IsLoadingState
  error: AsyncErrorState<E>
  result: S | null
}

export interface OperationsByIdState<S, E = object> {
  [id: string]: OperationState<S, E>
}

interface MakeOperationsById {
  <P extends CommonOperationParams, S, E>(actions: ActionsPlusOptionalOpts<P, S, E>): Reducer<
    OperationsByIdState<S, E>
  >

  <P, S, E>(opts: AllOpts<P, S, E>): Reducer<OperationsByIdState<S, E>>
}

type ActionsPlusOptionalOpts<P, S, E> = OpActions<P, S, E> &
  Partial<OpIdGetter<P, S> & OpRequesterGetter<P, S>>

type AllOpts<P, S, E> = OpActions<P, S, E> & OpIdGetter<P, S> & OpRequesterGetter<P, S>

interface OpActions<P, S, E> {
  actions: AsyncActionCreators<P, S, E>
}
interface OpIdGetter<P, S> {
  getId: (action: AsyncAction<P, S>) => string
}
interface OpRequesterGetter<P, S> {
  getRequester: (action: AsyncAction<P, S>) => Requester
}

export const makeOperationsByIdReducer: MakeOperationsById = <
  P extends {} | CommonOperationParams,
  S,
  E
>({
  actions,
  getId = action => asyncParams(action as AsyncAction<CommonOperationParams, S>).id,
  getRequester = action => asyncParams(action as AsyncAction<CommonOperationParams, S>).requester,
}: ActionsPlusOptionalOpts<P, S, E>) => {
  const operationReducer = combineReducers<OperationState<S, E>>({
    isLoading: makeIsLoadingReducer(actions),
    error: makeAsyncErrorReducer(actions),
    result: reducerWithInitialState<S | null>(null)
      .cases([actions.started, actions.failed], () => null)
      .case(actions.done, (_, { result }) => result)
      .build(),
    requester: reducerWithInitialState<Requester | null>(null)
      .casesWithAction([actions.done, actions.failed, actions.started], (state, action) =>
        getRequester(action)
      )
      .build(),
  })

  return reducerWithInitialState<OperationsByIdState<S, E>>({})
    .casesWithAction([actions.started, actions.done, actions.failed], (state, action) => {
      const id = getId(action)
      return { ...state, [id]: operationReducer(state[id], action) }
    })
    .build()
}

/// Selectors
interface MakeGetOperationState {
  <S, E>(
    opts: OpsStateGetter<S, E> & {
      getId: () => string
    }
  ): Selector<OperationState<S, E> | null>

  <T, S, E>(opts: OpsStateGetter<S, E> & SelectorOpIdGetter<T>): ParametricSelector<
    T,
    OperationState<S, E> | null
  >

  <T extends NestedId, S, E>(opts: StateGetterPlusOptionalOpts<T, S, E>): ParametricSelector<
    T,
    OperationState<S, E> | null
  >
}

type StateGetterPlusOptionalOpts<T, S, E> = OpsStateGetter<S, E> & Partial<SelectorOpIdGetter<T>>

interface OpsStateGetter<S, E> {
  operationsState: (state: State) => OperationsByIdState<S, E>
}

interface SelectorOpIdGetter<T> {
  getId: (params: T) => string
}

const getOpId = <T extends NestedId>({ id }: T) => id

export const makeGetOperationState: MakeGetOperationState = <T extends {} | NestedId, S, E>({
  operationsState,
  getId = getOpId,
}: StateGetterPlusOptionalOpts<T, S, E>) => (state: State, params?: T) => {
  const operationsById = operationsState(state)
  const id = (getId as SelectorOpIdGetter<T>['getId'])(params!)
  return operationsById[id] || null
}
