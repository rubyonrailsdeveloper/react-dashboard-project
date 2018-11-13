import { Classes } from '@blueprintjs/core'
import * as React from 'react'

class EntityNav extends React.Component {
  render() {
    return (
      <div className={`entity-nav ${Classes.NAVBAR}`}>
        <div className="entity-nav-wrap">{this.props.children}</div>
      </div>
    )
  }
}

export default EntityNav
