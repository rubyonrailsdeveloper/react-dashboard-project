import * as React from 'react'
import { connect } from 'react-redux'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import BreadcrumbsTextItem from 'src/components/Breadcrumbs/BreadcrumbsTextItem'
import { clusterUrl, nodeUrl } from 'src/routes'
import { NestedId } from 'src/store/constants'
import { Container } from 'src/store/container/container-model'
import { makeGetContainer } from 'src/store/container/container-reducers'
import { State } from 'src/store/root-reducer'

type OwnProps = NestedId

interface ConnectProps {
  container: Container | null
}

type ContainerActionsProps = OwnProps & ConnectProps

class ContainerActions extends React.Component<ContainerActionsProps> {
  render() {
    const { container } = this.props
    return (
      container && (
        <div className="container-actions action-bar-wrap">
          <Breadcrumbs>
            <BreadcrumbsTextItem
              href={clusterUrl({ id: container.cluster })}
              description="Cluster"
              name={container.cluster} />
            <BreadcrumbsTextItem
              href={nodeUrl({ id: container.nodeId })}
              description="Node"
              name={container.node} />
            <BreadcrumbsPageItem name={container.name} />
          </Breadcrumbs>
        </div>
      )
    )
  }
}

export default connect(() => {
  const getContainer = makeGetContainer()

  return (state: State, ownProps: OwnProps) => ({
    container: getContainer(state, ownProps),
  })
})(ContainerActions)
