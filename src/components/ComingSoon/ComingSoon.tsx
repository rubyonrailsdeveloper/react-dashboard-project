// import { Classes } from '@blueprintjs/core'
import * as React from 'react'

interface ComingSoonProps {
  pageName?: string
}

export default class ComingSoon extends React.Component<ComingSoonProps> {
  render() {
    const className: string = `coming-soon coming-soon-${this.props.pageName || 'default'}`
    return <div className={className}>
      <div className="coming-soon-text">coming soon</div>
    </div>
  }
}