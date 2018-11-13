import classes from 'classnames'
import * as React from 'react'
import { Link } from 'react-router-dom'
import GraphSelect from '../../components/graphSelect/graphSelect'
export interface PanelProps {
  header?: string | React.ReactNode
  className?: string
  layoutHeader?: boolean
  layoutBody?: boolean
  separateHeader?: boolean
  footer?: string | React.ReactNode
  layoutFooter?: boolean
  separateFooter?: boolean
  to?: string
}

const GraphPanel: React.SFC<PanelProps> = ({
  header,
  className,
  layoutHeader,
  separateHeader,
  layoutBody,
  children,
  footer,
  layoutFooter,
  separateFooter,
  to,
}) => (
  <PanelWrapper to={to} className={classes('panel', className)}>
    {header && (
      <header
        className={classes(
          'panel-header',
          layoutHeader && 'has-children-layout',
          separateHeader && 'separate-header'
        )}>
        {header}
        <GraphSelect></GraphSelect>        
      </header>
    )}
    <div className={classes('panel-body', layoutBody && 'has-children-layout')}>{children}</div>
    {footer && (
      <footer
        className={classes(
          'panel-footer',
          layoutFooter && 'has-children-layout',
          separateFooter && 'separate-footer'
        )}>
        {footer}
      </footer>
    )}
  </PanelWrapper>
)

interface PanelWrapperProps {
  to?: string
  className: string
}
const PanelWrapper: React.SFC<PanelWrapperProps> = ({ to, children, ...props }) =>
  to ? (
    <Link to={to} {...props}>
      {children}
    </Link>
  ) : (
    <section {...props}>{children}</section>
  )

GraphPanel.defaultProps = {
  layoutHeader: true,
  separateHeader: true,
  layoutBody: true,
  layoutFooter: true,
  separateFooter: true,
}

export default GraphPanel