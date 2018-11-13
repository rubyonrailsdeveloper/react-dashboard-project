import { IconClasses, InputGroup } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import BreadcrumbList, { BreadcrumbListItem } from 'src/components/Breadcrumbs/BreadcrumbList'
import { Icons } from 'src/constants'
import { namespaceUrl } from 'src/routes'
import { Namespace } from 'src/store/namespace/namespace-model'
import { makeGetNamespacesByGroup } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'

interface ConnectProps {
  namespaces: Namespace[]
}

interface OwnProps {
  groupId: string
}

type SearchNamespacesProps = OwnProps & ConnectProps & RouteComponentProps<{}>

interface SearchNamespacesState {
  search: string
  processedNamespaces: BreadcrumbListItem[]
}

class SearchNamespaces extends React.Component<SearchNamespacesProps, SearchNamespacesState> {
  state = {
    search: '',
    ...SearchNamespaces.process(this.props, ''),
  }

  static mapEntityArray = (namespaces: Namespace[]) =>
    namespaces.map(({ id, name, health }) => ({
      name,
      health,
      url: namespaceUrl({ id }),
    }))

  static process({ namespaces }: SearchNamespacesProps, search: string) {
    return {
      processedNamespaces: SearchNamespaces.searchArray(
        SearchNamespaces.mapEntityArray(namespaces),
        search
      ),
    }
  }

  static searchArray = (array: BreadcrumbListItem[], search: string) =>
    array.filter(entity => !search || entity.name.includes(search))

  onSearchChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      search: ev.currentTarget.value,
      ...SearchNamespaces.process(this.props, ev.currentTarget.value),
    })
  }

  componentWillReceiveProps(nextProps: SearchNamespacesProps) {
    if (nextProps.namespaces !== this.props.namespaces)
      this.setState(SearchNamespaces.process(nextProps, this.state.search))
  }

  render() {
    const { processedNamespaces, search } = this.state

    return (
      <div className="breadcrumbs-search search-namespaces">
        <div className="breadcrumbs-search-input">
          <InputGroup
            type="text"
            placeholder="Search current group"
            leftIconName={IconClasses.SEARCH}
            value={search}
            onChange={this.onSearchChange}
          />
        </div>
        <BreadcrumbList
          items={processedNamespaces}
          noItemsMsg={
            search !== '' ? 'No namespaces match your search' : 'No namespaces for this group'
          }
          icon={Icons.NAMESPACE}
        />
      </div>
    )
  }
}

export default withRouter(
  connect(() => {
    const filterNamespaces = makeGetNamespacesByGroup()

    return (state: State, props: OwnProps) => ({
      namespaces: filterNamespaces(state, props),
    })
  })(SearchNamespaces)
)
