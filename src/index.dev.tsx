import { FocusStyleManager } from '@blueprintjs/core'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'src/App'
import createStore from 'src/store'

FocusStyleManager.onlyShowFocusOnTabs()

const store = createStore()

const render = (Component: typeof App) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    render(require('./App').default)
  })
}
