import { Classes, Icon, IconName, Menu, MenuItem } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import MenuLink from 'src/components/Url/MenuLink'
import { Health } from 'src/store/constants'

export interface BreadcrumbListProps {
  items: BreadcrumbListItem[]
  noItemsMsg: string
  icon?: IconName
}

export interface BreadcrumbListItem {
  name: string
  url: string
  health: Health
}

const BreadcrumbList: React.SFC<BreadcrumbListProps> = ({ items, noItemsMsg, icon }) => {
  return (
    <Menu className="breadcrumb-list">
      {items.length ? (
        items.map(({ name, health, url }) => (
          <li key={url}>
            <MenuLink
              to={url}
              className={classes(
                Classes.MENU_ITEM,
                Classes.POPOVER_DISMISS,
                'breadcrumb-list-item'
              )}
            >
              <span className="breadcrumb-list-item-label">
                {icon && <Icon iconName={icon} className="breadcrumb-list-item-icon" />}
                <span className="breadcrumb-list-item-name">{name}</span>
              </span>
              <HealthIndicator health={health} />
            </MenuLink>
          </li>
        ))
      ) : (
        <MenuItem disabled className="no-items-message" text={noItemsMsg} />
      )}
    </Menu>
  )
}

export default BreadcrumbList
