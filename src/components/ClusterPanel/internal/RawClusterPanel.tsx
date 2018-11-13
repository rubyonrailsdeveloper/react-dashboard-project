import { Classes, Menu, MenuItem } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import Panel from 'src/components/Panel/Panel'

interface RawClusterPanelProps {
  clusters: string[]
  currentCluster: string | null
  onChange: (cluster: string | null) => void
}

export default class RawClusterPanel extends React.Component<RawClusterPanelProps> {
  handleAllClustersClick() {
    this.props.onChange(null)
  }

  render() {
    const { clusters, currentCluster, onChange } = this.props
    const header = clusters.length > 1 ? 'Filter by Cluster' : 'Cluster'

    // tslint:disable jsx-no-lambda
    return (
      <Panel className="cluster-panel" header={header}>
        <Menu>
          {clusters.length > 1 && (
            <MenuItem
              className={classes(!currentCluster && Classes.ACTIVE)}
              onClick={this.handleAllClustersClick}
              text="All clusters"
            />
          )}
          {clusters.map(cluster => (
            <li
              key={cluster}
              className={classes(
                Classes.MENU_ITEM,
                currentCluster === cluster && clusters.length > 1 && Classes.ACTIVE,
                clusters.length <= 1 && 'no-hover'
              )}
              onClick={() => clusters.length > 1 && onChange(cluster)}
            >
              {cluster}
            </li>
          ))}
        </Menu>
      </Panel>
    )
  }
}
