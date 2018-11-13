import { Reducer } from 'redux'
import { rootReducer } from 'src/store/root-reducer'

export const defaultRootState = () => defaultReducerState(rootReducer)

export const defaultReducerState = <S>(reducer: Reducer<S>) =>
  Object.freeze(reducer(undefined as any, { type: 'DUMMY_INIT' }))
