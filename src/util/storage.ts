const stateKey = 'streamlio'

export default {
  save: (payload: any) => {
    try {
      localStorage.setItem(stateKey, JSON.stringify(payload))
    } catch (err) {
      /* Silently ignore */
    }
  },

  load: () => {
    try {
      const serializedState = localStorage.getItem(stateKey)

      if (serializedState == null) {
        return {}
      }

      return JSON.parse(serializedState)
    } catch (err) {
      return {}
    }
  },

  clear: () => {
    try {
      localStorage.clear()
    } catch (err) {
      /* Silently ignore */
    }
  },
}
