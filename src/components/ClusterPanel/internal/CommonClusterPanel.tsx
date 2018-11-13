import * as React from 'react'
import ClusterPanel from 'src/components/ClusterPanel/internal/RawClusterPanel'

export type ClusterHolder = null | { clusters: string[] }

export interface CommonClusterPanelProps {
  clusterHolder: ClusterHolder
  cluster: string
  setClusterFilter: (cluster: string | null) => void
}

export default class CommonClusterPanel extends React.Component<CommonClusterPanelProps> {
  render() {
    const { clusterHolder, cluster, setClusterFilter } = this.props

    return (
      clusterHolder && (
        <ClusterPanel
          clusters={clusterHolder.clusters}
          currentCluster={cluster}
          onChange={setClusterFilter}
        />
      )
    )
  }
}
