import { defaultReducerState, defaultRootState } from 'src/store/__tests__/util'
import { rootReducer } from 'src/store/root-reducer'
import {
  applySubscriptionTtl,
  clearSubscriptionBacklog,
  deleteTopic,
  rollbackSubscription,
  skipSubscriptionMsgs,
} from 'src/store/topic/topic-actions'
import {
  getApplySubscriptionTtlState,
  getClearSubscriptionBacklogState,
  getRollbackSubscriptionState,
  getSkipSubscriptionMsgsState,
  getTopicDeleteState,
  topicsReducer,
} from 'src/store/topic/topic-reducers'

const initState = defaultReducerState(topicsReducer)
const id = 'group/ns/topic-1'
const requester = 'dummy'

describe('topic reducer', () => {
  describe('delete operation', () => {
    it('should handle deleteTopic.started', () => {
      expect(topicsReducer(initState, deleteTopic.started({ id, requester }))).toMatchObject({
        delete: { [id]: { error: null, isLoading: true, requester, result: null } },
      })
    })

    it('should handle deleteTopic.done', () => {
      expect(
        topicsReducer(initState, deleteTopic.done({ params: { id, requester }, result: 'Good' }))
      ).toMatchObject({
        delete: { [id]: { error: null, isLoading: false, requester, result: 'Good' } },
      })
    })

    it('should handle deleteTopic.failed', () => {
      const error = new Error('gg')
      expect(
        topicsReducer(initState, deleteTopic.failed({ params: { id, requester }, error }))
      ).toMatchObject({
        delete: { [id]: { error, isLoading: false, requester, result: null } },
      })
    })
  })
})

describe('topic selectors', () => {
  const subscription = 'sub1'

  describe('getTopicDeleteState', () => {
    it('should get the state when done', () => {
      const state = rootReducer(
        defaultRootState(),
        deleteTopic.done({ params: { id, requester }, result: 'Good' })
      )

      expect(getTopicDeleteState(state, { id })).toEqual({
        error: null,
        isLoading: false,
        requester,
        result: 'Good',
      })
    })
  })

  describe('getClearSubscriptionBacklogState', () => {
    it('should get the state when done', () => {
      const state = rootReducer(
        defaultRootState(),
        clearSubscriptionBacklog.done({
          params: { id, requester, subscription },
          result: '~Ok~',
        })
      )

      expect(getClearSubscriptionBacklogState(state, { id, subscription })).toEqual({
        error: null,
        isLoading: false,
        requester,
        result: '~Ok~',
      })
    })
  })

  describe('getApplySubscriptionTtlState', () => {
    it('should get the state when done', () => {
      const state = rootReducer(
        defaultRootState(),
        applySubscriptionTtl.done({
          params: { id, requester, subscription, ttl: 12312 },
          result: { result: 'Fine' },
        })
      )

      expect(getApplySubscriptionTtlState(state, { id, subscription })).toEqual({
        error: null,
        isLoading: false,
        requester,
        result: { result: 'Fine' },
      })
    })
  })

  describe('getSkipSubscriptionMsgsState', () => {
    it('should get the state when done', () => {
      const state = rootReducer(
        defaultRootState(),
        skipSubscriptionMsgs.done({
          params: { id, requester, subscription, messages: 12 },
          result: 'All good',
        })
      )

      expect(getSkipSubscriptionMsgsState(state, { id, subscription })).toEqual({
        error: null,
        isLoading: false,
        requester,
        result: 'All good',
      })
    })
  })

  describe('getRollbackSubscriptionState', () => {
    it('should get the state when done', () => {
      const state = rootReducer(
        defaultRootState(),
        rollbackSubscription.done({
          params: { id, requester, subscription, time: new Date() },
          result: 'OK',
        })
      )

      expect(getRollbackSubscriptionState(state, { id, subscription })).toEqual({
        error: null,
        isLoading: false,
        requester,
        result: 'OK',
      })
    })
  })
})
