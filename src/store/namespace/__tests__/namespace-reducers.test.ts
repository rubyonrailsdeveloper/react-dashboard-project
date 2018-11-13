import { defaultRootState } from 'src/store/__tests__/util'
import {
  clearNamespaceBacklog,
  deleteNamespace,
  unloadNamespace,
} from 'src/store/namespace/namespace-actions'
import {
  getNamespaceClearBacklogState,
  getNamespaceDeleteState,
  getNamespaceUnloadState,
} from 'src/store/namespace/namespace-reducers'
import { rootReducer } from 'src/store/root-reducer'

const id = 'group/ns-2'
const requester = 'req'

describe('namespace selectors', () => {
  describe('getNamespaceDeleteState', () => {
    it('should get the state when done', () => {
      const state = rootReducer(
        defaultRootState(),
        deleteNamespace.done({ params: { id, requester }, result: 'Good' })
      )

      expect(getNamespaceDeleteState(state, { id })).toEqual({
        error: null,
        isLoading: false,
        requester,
        result: 'Good',
      })
    })
  })

  describe('getNamespaceUnloadState', () => {
    it('should get the state when done', () => {
      const state = rootReducer(
        defaultRootState(),
        unloadNamespace.done({
          params: { id, requester },
          result: '~Ok~',
        })
      )

      expect(getNamespaceUnloadState(state, { id })).toEqual({
        error: null,
        isLoading: false,
        requester,
        result: '~Ok~',
      })
    })
  })

  describe('getNamespaceClearBacklogState', () => {
    it('should get the state when done', () => {
      const state = rootReducer(
        defaultRootState(),
        clearNamespaceBacklog.done({
          params: { id, requester },
          result: { result: 'Fine' },
        })
      )

      expect(getNamespaceClearBacklogState(state, { id })).toEqual({
        error: null,
        isLoading: false,
        requester,
        result: { result: 'Fine' },
      })
    })
  })
})
