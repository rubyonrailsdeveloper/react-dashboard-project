import { Button, Classes } from '@blueprintjs/core'
import * as React from 'react'
import { ListViewMode } from 'src/constants'

interface BrowseViewModeTogglerProps {
  viewMode: ListViewMode
  setViewMode?: (viewMode: ListViewMode) => void
}

export default class BrowseViewModeToggler extends React.Component<BrowseViewModeTogglerProps> {
  setListViewMode = () => this.props.setViewMode && this.props.setViewMode(ListViewMode.ROWS)

  setGridViewMode = () => this.props.setViewMode && this.props.setViewMode(ListViewMode.CARDS)

  render() {
    const { viewMode } = this.props

    return (
      <div className={`browse-view-mode-toggler ${Classes.BUTTON_GROUP}`}>
        <Button
          iconName="list"
          active={viewMode === ListViewMode.ROWS}
          onClick={this.setListViewMode}
        />
        <Button
          iconName="grid-view"
          active={viewMode === ListViewMode.CARDS}
          onClick={this.setGridViewMode}
        />
      </div>
    )
  }
}
