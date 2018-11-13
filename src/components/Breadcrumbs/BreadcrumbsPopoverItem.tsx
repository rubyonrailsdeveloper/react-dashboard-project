import { Classes, Popover, Position } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'

export interface BreadcrumbsPopoverItemProps {
  name: string
  popover: React.ReactNode
  description?: string
}

const BreadcrumbsPopoverItem = (props: BreadcrumbsPopoverItemProps) => {
  const { name, popover } = props

  return (
    <li>
      <Popover popoverClassName={Classes.MINIMAL} position={Position.BOTTOM_LEFT}>
        <a role="button" tabIndex={0}
          className={classes(
            Classes.MINIMAL,
            'pt-button',
            'breadcrumb-item'
          )}>
          <div className="breadcrumb-text-page">{name}</div>
        </a>
        {popover}
      </Popover>
    </li>
  )
}

export default BreadcrumbsPopoverItem
