import { IconClasses, InputGroup } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import BreadcrumbList, { BreadcrumbListItem } from 'src/components/Breadcrumbs/BreadcrumbList'
import { Icons } from 'src/constants'
import { containerUrl } from 'src/routes'
import { Container } from 'src/store/container/container-model'
import { getContainerList } from 'src/store/container/container-reducers'
import { State } from 'src/store/root-reducer'

interface ConnectProps {
  containers: Container[]
}

type SearchContainersProps = ConnectProps & RouteComponentProps<{}>

interface SearchContainersState {
  search: string
  processedContainers: BreadcrumbListItem[]
}

class SearchContainers extends React.Component<SearchContainersProps, SearchContainersState> {
  state = {
    search: '',
    ...SearchContainers.process(this.props, ''),
  }

  static mapEntityArray = (containers: Container[]) =>
    containers.map(({ id, name, health }) => ({
      name: name,
      health: health,
      url: containerUrl({ id }),
    }))

  static process({ containers }: SearchContainersProps, search: string) {
    return {
      processedContainers: SearchContainers.searchArray(
        SearchContainers.mapEntityArray(containers),
        search
      ),
    }
  }

  static searchArray = (array: BreadcrumbListItem[], search: string) =>
    array.filter(entity => !search || entity.name.includes(search))

  onSearchChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      search: ev.currentTarget.value,
      ...SearchContainers.process(this.props, ev.currentTarget.value),
    })
  }

  componentWillReceiveProps(nextProps: SearchContainersProps) {
    if (nextProps.containers !== this.props.containers)
      this.setState(SearchContainers.process(nextProps, this.state.search))
  }

  render() {
    const { processedContainers, search } = this.state

    return (
      <div className="breadcrumbs-search search-containers">
        <div className="breadcrumbs-search-input">
          <InputGroup
            type="text"
            placeholder="Search all containers"
            leftIconName={IconClasses.SEARCH}
            value={search}
            onChange={this.onSearchChange}
          />
        </div>
        <BreadcrumbList
          items={processedContainers}
          noItemsMsg={search !== '' ? 'No containers match your search' : 'No containers'}
          icon={Icons.CONTAINER}
        />
      </div>
    )
  }
}

export default withRouter(
  connect(() => {
    return (state: State) => {
      const allContainers = getContainerList(state)
      return {
        containers: allContainers,
      }
    }
  })(SearchContainers)
)
