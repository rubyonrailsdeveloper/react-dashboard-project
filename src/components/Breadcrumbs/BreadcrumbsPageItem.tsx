import { Classes } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'

export interface BreadcrumbsPageItemProps {
  name: string
  description?: string
}

const BreadcrumbsPageItem = (props: BreadcrumbsPageItemProps) => {
  const { name } = props

  return (
    <li>
      <div className={classes(Classes.MINIMAL, 'breadcrumb-item')}>
        <div className="breadcrumb-text-page">{name}</div>
      </div>
    </li>
  )
}

export default BreadcrumbsPageItem
