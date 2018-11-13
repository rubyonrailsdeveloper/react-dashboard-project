import { ReactNode } from 'react'
import * as React from 'react'
import ActionBar from 'src/components/ActionBar/ActionBar'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import UrlNamespace from 'src/components/Url/UrlNamespace'

export const listUrlNamespace = new UrlNamespace('')

interface PipelineTplProps {
  menu: ReactNode
  breadcrumbs: ReactNode
  actions?: React.ReactNode
}

class PipelineTpl extends React.Component<PipelineTplProps> {
  render() {
    const { children, breadcrumbs, actions } = this.props

    return (
      <div className="list-scene-tpl">
        <ActionBar>
          <div className="action-bar-wrap">
            {breadcrumbs && <Breadcrumbs>{breadcrumbs}</Breadcrumbs>}
            {actions && <div className="list-toolbar-actions">{actions}</div>}
          </div>
        </ActionBar>
        <div className="list-scene-tpl-wrap">
          <main>{children}</main>
        </div>
      </div>
    )
  }
}

export default PipelineTpl