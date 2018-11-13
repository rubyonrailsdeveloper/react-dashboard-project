import { Classes } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import { Link, LinkProps } from 'react-router-dom'

interface AppLinkProps extends LinkProps {
  disabled?: boolean
}

const AppLink: React.SFC<AppLinkProps> = ({ disabled, ...linkProps }: AppLinkProps) => (
  <Link
    {...linkProps}
    className={classes(
      'app-link',
      linkProps.className,
      // Classes.BUTTON,
      disabled && Classes.DISABLED
    )}
  />
)

export default AppLink
