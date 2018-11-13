import { AnyAction, Reducer } from 'redux'
import { State } from 'src/store/root-reducer'

export interface ActionSwitchState<T> {
  [k: string]: T
}

interface ActionSwitchOpts<T> {
  by: (action: AnyAction) => string | null
  reducer: Reducer<T>
}

export const makeActionSwitchReducer = <T>({ by, reducer }: ActionSwitchOpts<T>) => (
  state: ActionSwitchState<T> = {},
  action: AnyAction
) => {
  const switchKey = by(action)

  if (switchKey) {
    state[switchKey] = reducer(state[switchKey], action)
  }

  return state
}

/// Selectors
type ActionSwitchStateGetter<T> = (state: State) => ActionSwitchState<T>

type SwitchKeyGetter<T> = (params: T) => string

export const makeActionSwitchGetter = <S, T>(
  getState: ActionSwitchStateGetter<S>,
  getKey: SwitchKeyGetter<T>
) => (state: State, params: T) => {
  const switchState = getState(state)
  const switchKey = getKey(params)
  return switchState[switchKey] || null
}
