import * as React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { Omit } from 'src/types'

interface CellWrapperProps extends Omit<LinkProps, 'to'> {
  to: LinkProps['to'] | null
}

const CellWrapper: React.SFC<CellWrapperProps> = ({ children, to }) =>
  to ? (
    <Link to={to} className="cell-wrapper">
      {children}
    </Link>
  ) : (
    <div className="cell-wrapper">{children}</div>
  )

export default CellWrapper
