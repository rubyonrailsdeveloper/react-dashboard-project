import { IconClasses, InputGroup } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import BreadcrumbList, { BreadcrumbListItem } from 'src/components/Breadcrumbs/BreadcrumbList'
import { Icons } from 'src/constants'
import { nodeUrl } from 'src/routes'
import { Node } from 'src/store/node/node-model'
import { getNodeList } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'

interface ConnectProps {
  nodes: Node[]
}

type SearchNodesProps = ConnectProps & RouteComponentProps<{}>

interface SearchNodesState {
  search: string
  processedNodes: BreadcrumbListItem[]
}

class SearchNodes extends React.Component<SearchNodesProps, SearchNodesState> {
  state = {
    search: '',
    ...SearchNodes.process(this.props, ''),
  }

  static mapEntityArray = (nodes: Node[]) =>
    nodes.map(({ id, name, health }) => ({
      name: name,
      health: health,
      url: nodeUrl({ id }),
    }))

  static process({ nodes }: SearchNodesProps, search: string) {
    return {
      processedNodes: SearchNodes.searchArray(SearchNodes.mapEntityArray(nodes), search),
    }
  }

  static searchArray = (array: BreadcrumbListItem[], search: string) =>
    array.filter(entity => !search || entity.name.includes(search))

  onSearchChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      search: ev.currentTarget.value,
      ...SearchNodes.process(this.props, ev.currentTarget.value),
    })
  }

  componentWillReceiveProps(nextProps: SearchNodesProps) {
    if (nextProps.nodes !== this.props.nodes)
      this.setState(SearchNodes.process(nextProps, this.state.search))
  }

  render() {
    const { processedNodes, search } = this.state

    return (
      <div className="breadcrumbs-search search-nodes">
        <div className="breadcrumbs-search-input">
          <InputGroup
            type="text"
            placeholder="Search all nodes"
            leftIconName={IconClasses.SEARCH}
            value={search}
            onChange={this.onSearchChange}
          />
        </div>
        <BreadcrumbList
          items={processedNodes}
          noItemsMsg={search !== '' ? 'No nodes match your search' : 'No nodes'}
          icon={Icons.NODE}
        />
      </div>
    )
  }
}

export default withRouter(
  connect(() => {
    return (state: State) => {
      const allNodes = getNodeList(state)
      return {
        nodes: allNodes,
      }
    }
  })(SearchNodes)
)
