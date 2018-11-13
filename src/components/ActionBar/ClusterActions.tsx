import * as React from 'react'
import { connect } from 'react-redux'
import FilterBar from 'src/components/ActionBar/FilterBar'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import withTagFilters, { TagFilterInjectedProps } from 'src/components/TagPanel/withTagFilters'
import { Cluster } from 'src/store/cluster/cluster-model'
import { makeGetCluster } from 'src/store/cluster/cluster-reducers'
import { NestedId } from 'src/store/constants'
import { State } from 'src/store/root-reducer'

type OwnProps = NestedId & TagFilterInjectedProps

interface ConnectProps {
  cluster: Cluster | null
}

type ClusterActionsProps = OwnProps & ConnectProps

class ClusterActions extends React.Component<ClusterActionsProps> {
  render() {
    const { cluster, clearTagFilters, tag } = this.props
    return (
      cluster && (
        <div className="cluster-actions action-bar-wrap">
          <Breadcrumbs>
            <BreadcrumbsPageItem name={cluster.name} />
          </Breadcrumbs>
          <FilterBar onClearFilter={clearTagFilters} filterActive={!!tag}>
            <span className="filter-bar-label">Filtering by type:</span>{' '}
            <span className="filter-bar-name">{tag}</span>
          </FilterBar>
        </div>
      )
    )
  }
}

const connected = connect(() => {
  const getCluster = makeGetCluster()

  return (state: State, ownProps: OwnProps) => ({
    cluster: getCluster(state, ownProps),
  })
})(ClusterActions)

export default withTagFilters()(connected)
