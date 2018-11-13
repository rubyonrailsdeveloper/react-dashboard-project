import { AuthProps } from 'src/api/auth'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('AUTH')

interface AuthSuccess {
  token: string
}

interface AuthFailure {
  message: string
}

export const triggerLogin = actionCreator<AuthProps>('TRIGGER_LOGIN')

export const loggedIn = actionCreator.async<AuthProps, AuthSuccess, AuthFailure>('LOGIN')

export const triggerLogout = actionCreator('TRIGGER_LOGOUT')

export const loggedOut = actionCreator.async<void, {}>('LOGOUT')
