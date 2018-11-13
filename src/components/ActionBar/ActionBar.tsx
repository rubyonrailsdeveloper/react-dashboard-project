import { Classes } from '@blueprintjs/core'
import * as React from 'react'

export default class ActionBar extends React.Component {
  render() {
    return <nav className={`action-bar ${Classes.NAVBAR}`}>{this.props.children}</nav>
  }
}
