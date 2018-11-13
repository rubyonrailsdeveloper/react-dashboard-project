import { FocusStyleManager } from '@blueprintjs/core'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import createStore from './store'

FocusStyleManager.onlyShowFocusOnTabs()

const store = createStore()

ReactDOM.render(<App store={store} />, document.getElementById('root'))
