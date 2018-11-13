import { IconClasses, InputGroup } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import BreadcrumbList, { BreadcrumbListItem } from 'src/components/Breadcrumbs/BreadcrumbList'
import { Icons } from 'src/constants'
import { clusterUrl } from 'src/routes'
import { Cluster } from 'src/store/cluster/cluster-model'
import { getClusterList } from 'src/store/cluster/cluster-reducers'
import { State } from 'src/store/root-reducer'

interface ConnectProps {
  clusters: Cluster[]
}

type SearchClustersProps = ConnectProps & RouteComponentProps<{}>

interface SearchClustersState {
  search: string
  processedClusters: BreadcrumbListItem[]
}

class SearchClusters extends React.Component<SearchClustersProps, SearchClustersState> {
  state = {
    search: '',
    ...SearchClusters.process(this.props, ''),
  }

  static mapEntityArray = (clusters: Cluster[]) =>
    clusters.map(({ id, name, health }) => ({
      name: name,
      health: health,
      url: clusterUrl({ id }),
    }))

  static process({ clusters }: SearchClustersProps, search: string) {
    return {
      processedClusters: SearchClusters.searchArray(
        SearchClusters.mapEntityArray(clusters),
        search
      ),
    }
  }

  static searchArray = (array: BreadcrumbListItem[], search: string) =>
    array.filter(entity => !search || entity.name.includes(search))

  onSearchChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      search: ev.currentTarget.value,
      ...SearchClusters.process(this.props, ev.currentTarget.value),
    })
  }

  componentWillReceiveProps(nextProps: SearchClustersProps) {
    if (nextProps.clusters !== this.props.clusters)
      this.setState(SearchClusters.process(nextProps, this.state.search))
  }

  render() {
    const { processedClusters, search } = this.state

    return (
      <div className="breadcrumbs-search search-clusters">
        <div className="breadcrumbs-search-input">
          <InputGroup
            type="text"
            placeholder="Search all clusters"
            leftIconName={IconClasses.SEARCH}
            value={search}
            onChange={this.onSearchChange}
          />
        </div>
        <BreadcrumbList
          items={processedClusters}
          noItemsMsg={search !== '' ? 'No clusters match your search' : 'No clusters'}
          icon={Icons.CLUSTER}
        />
      </div>
    )
  }
}

export default withRouter(
  connect(() => {
    return (state: State) => {
      const allClusters = getClusterList(state)
      return {
        clusters: allClusters,
      }
    }
  })(SearchClusters)
)
