import { SagaIterator } from 'redux-saga'
import { call, cancelled, put } from 'redux-saga/effects'
import { AsyncActionCreators } from 'typescript-fsa'

// Taken from typescript-fsa-redux-saga
export function bindAsyncAction<R>(
  actionCreators: AsyncActionCreators<void, R, any>
): {
  (worker: () => Promise<R> | SagaIterator): () => SagaIterator

  (worker: (params: void) => Promise<R> | SagaIterator): (params: void) => SagaIterator

  <A1>(worker: (params: void, arg1: A1) => Promise<R> | SagaIterator): (
    params: void,
    arg1: A1
  ) => SagaIterator

  <A1, A2>(worker: (params: void, arg1: A1, arg2: A2) => Promise<R> | SagaIterator): (
    params: void,
    arg1: A1,
    arg2: A2
  ) => SagaIterator

  <A1, A2, A3>(
    worker: (
      params: void,
      arg1: A1,
      arg2: A2,
      arg3: A3,
      ...rest: any[]
    ) => Promise<R> | SagaIterator
  ): (params: void, arg1: A1, arg2: A2, arg3: A3, ...rest: any[]) => SagaIterator
}
export function bindAsyncAction<P, R>(
  actionCreators: AsyncActionCreators<P, R, any>
): {
  (worker: (params: P) => Promise<R> | SagaIterator): (params: P) => SagaIterator

  <A1>(worker: (params: P, arg1: A1) => Promise<R> | SagaIterator): (
    params: P,
    arg1: A1
  ) => SagaIterator

  <A1, A2>(worker: (params: P, arg1: A1, arg2: A2) => Promise<R> | SagaIterator): (
    params: P,
    arg1: A1,
    arg2: A2
  ) => SagaIterator

  <A1, A2, A3>(
    worker: (params: P, arg1: A1, arg2: A2, arg3: A3, ...rest: any[]) => Promise<R> | SagaIterator
  ): (params: P, arg1: A1, arg2: A2, arg3: A3, ...rest: any[]) => SagaIterator
}

export function bindAsyncAction(actionCreator: AsyncActionCreators<any, any, any>) {
  return (worker: (params: any, ...args: any[]) => Promise<any> | SagaIterator) => {
    function* boundAsyncActionSaga(params: any, ...args: any[]): SagaIterator {
      yield put(actionCreator.started(params))

      try {
        const result = yield (call as any)(worker, params, ...args)
        yield put(actionCreator.done({ params, result }))
        return result
      } catch (error) {
        // tslint:disable-next-line no-console
        if (process.env.NODE_ENV !== 'production') console.error(error)
        yield put(actionCreator.failed({ params, error }))
      } finally {
        if (yield cancelled()) {
          yield put(actionCreator.failed({ params, error: 'cancelled' }))
        }
      }
    }

    const capName = worker.name.charAt(0).toUpperCase() + worker.name.substring(1)

    return setFunctionName(boundAsyncActionSaga, `bound${capName}(${actionCreator.type})`)
  }
}

/**
 * Set function name.
 *
 * Note that this won't have effect on built-in Chrome stack traces, although
 * useful for stack traces generated by `redux-saga`.
 */
// tslint:disable-next-line ban-types
function setFunctionName<F extends Function>(func: F, name: string): F {
  try {
    Object.defineProperty(func, 'name', {
      value: name,
      configurable: true,
    })
  } catch (e) {
    // ignore
  }

  return func
}
