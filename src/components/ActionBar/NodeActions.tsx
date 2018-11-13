import * as React from 'react'
import { connect } from 'react-redux'
import FilterBar from 'src/components/ActionBar/FilterBar'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import BreadcrumbsTextItem from 'src/components/Breadcrumbs/BreadcrumbsTextItem'
import withTagFilters, { TagFilterInjectedProps } from 'src/components/TagPanel/withTagFilters'
import { clusterUrl } from 'src/routes'
import { NestedId } from 'src/store/constants'
import { Node } from 'src/store/node/node-model'
import { makeGetNode } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'

type OwnProps = NestedId & TagFilterInjectedProps

interface ConnectProps {
  node: Node | null
}

type NodeActionsProps = OwnProps & ConnectProps

class NodeActions extends React.Component<NodeActionsProps> {
  render() {
    const { node, clearTagFilters, tag } = this.props
    return (
      node && (
        <div className="node-actions action-bar-wrap">
          <Breadcrumbs>
            <BreadcrumbsTextItem
              href={clusterUrl({ id: node.cluster })}
              description="Cluster"
              name={node.cluster} />
            <BreadcrumbsPageItem name={node.name} />
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
  const getNode = makeGetNode()

  return (state: State, ownProps: OwnProps) => ({
    node: getNode(state, ownProps),
  })
})(NodeActions)

export default withTagFilters()(connected)
