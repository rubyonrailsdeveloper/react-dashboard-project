import classes from 'classnames'
import * as React from 'react'
import MenuLink, { MenuLinkProps } from 'src/components/Url/MenuLink'

const EntityNavLink: React.SFC<MenuLinkProps> = props => (
  <MenuLink preserveQuery {...props} className={classes('entity-nav-link', props.className)} />
)

export default EntityNavLink
