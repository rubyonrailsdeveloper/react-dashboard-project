import { Classes } from '@blueprintjs/core'
import * as React from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import withQueryBehaviour, { WithQueryBehaviourProps } from 'src/components/Url/withQueryBehaviour'

const MenuLink: React.SFC<NavLinkProps> = (props: NavLinkProps) => (
  <NavLink activeClassName={Classes.ACTIVE} {...props} />
)

export type MenuLinkProps = WithQueryBehaviourProps<NavLinkProps>

export default withQueryBehaviour(MenuLink)
