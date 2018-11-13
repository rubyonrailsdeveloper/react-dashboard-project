import * as React from 'react'

export interface ListToolbarProps {
  filters?: React.ReactNode
  actions?: React.ReactNode
}

const ListToolbar: React.SFC<ListToolbarProps> = ({ filters, actions }) => (
  <div className="list-toolbar">
    {filters && <div className="list-toolbar-filters">{filters}</div>}
    {actions && <div className="list-toolbar-actions">{actions}</div>}
  </div>
)

export default ListToolbar
