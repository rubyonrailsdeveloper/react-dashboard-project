import { Classes } from '@blueprintjs/core'
import * as React from 'react'

interface BreadcrumbsProps {
  children: React.ReactNode | React.ReactNode[]
}

class Breadcrumbs extends React.Component<BreadcrumbsProps> {
/*  constructor(props) {
    super(props)
    let numchildren = this.props.children.length
    let children = numchildren == 1 ? this.props.children.slice(0, 1) : this.props.children.slice(1, numchildren)
    this.state = {
      children : children
    }
  }*/
  render() {
    return <ul className={Classes.BREADCRUMBS}>{this.props.children}</ul>
  }
}

export default Breadcrumbs
