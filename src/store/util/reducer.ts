import { Action } from 'src/store/constants'
import { Failure, Success } from 'typescript-fsa'

export type AsyncSuccessOrFailure<P = any, R = any, E = any> = Success<P, R> | Failure<P, E>

export type AsyncPayload<P, R> = P | AsyncSuccessOrFailure<P, R>

export type AsyncAction<P, R> = Action<AsyncPayload<P, R>>

export const isAsyncStarted = <P, R>(action: AsyncAction<P, R>): action is Action<P> =>
  !(action as Action<AsyncSuccessOrFailure<P, R>>).payload.params

export const isAsyncSuccess = <P, R>(action: AsyncAction<P, R>): action is Action<Success<P, R>> =>
  !!(action as Action<Success<P, R>>).payload.result

export const isAsyncFailure = <P, R>(action: AsyncAction<P, R>): action is Action<Failure<P, R>> =>
  !!action.error

export const asyncParams = <P, R>({ payload }: AsyncAction<P, R>): P =>
  (payload as AsyncSuccessOrFailure<P, R>).params || payload
