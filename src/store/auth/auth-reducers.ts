import { Action } from 'redux'
import { State } from 'src/store/root-reducer'
import { User } from 'src/store/user/user-model'
import { makeGetUser } from 'src/store/user/user-reducers'
import { isType } from 'typescript-fsa'
import { loggedIn, loggedOut, triggerLogin } from './auth-actions'

export interface AuthState {
  token: string | null
  id?: string
  error?: string | null
  loading: boolean
}

const initialState = { loading: false, token: null }

export const getCurrentUser = (state: State): User | null =>
  state.auth.id ? makeGetUser()(state, { id: state.auth.id }) : null

export const authReducer = (state: AuthState = initialState, action: Action): AuthState => {
  if (isType(action, triggerLogin) || isType(action, loggedIn.started)) {
    return { token: null, loading: true }
  }

  if (isType(action, loggedIn.failed)) {
    return { error: action.payload.error.message, loading: false, token: null }
  }

  if (isType(action, loggedIn.done)) {
    const { result } = action.payload
    return { error: null, ...result, loading: false }
  }

  if (isType(action, loggedOut.done)) {
    return { error: null, token: null, loading: false }
  }

  return state
}
