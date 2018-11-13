import { Classes } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import AppLink from 'src/components/Url/AppLink'

export interface BreadcrumbsTextItemProps {
  href: string
  name: string
  description?: string
}

const BreadcrumbsTextItem = (props: BreadcrumbsTextItemProps) => {
  const { href, name } = props

  return (
    <li>
      <AppLink to={href} className={classes(Classes.MINIMAL, 'breadcrumb-item')}>
        <div className="breadcrumb-text">{name}</div>
      </AppLink>
    </li>
  )
}

export default BreadcrumbsTextItem
