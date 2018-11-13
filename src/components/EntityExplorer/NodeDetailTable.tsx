import { Icon, IconClasses, Tooltip } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import withTagFilters from 'src/components/TagPanel/withTagFilters'
import { TagFilterInjectedProps } from 'src/components/TagPanel/withTagFilters'
import { tagIcon } from 'src/constants'
import { containerUrl } from 'src/routes'
import { Health, NestedId } from 'src/store/constants'
import { Container } from 'src/store/container/container-model'
import { makeGetContainersByNode } from 'src/store/container/container-reducers'
import { Node } from 'src/store/node/node-model'
import { getNodeIsLoading, makeGetNode } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'
import { unfilterableClass } from 'src/util/classes'
import Header from './internal/Header'
import { totalByHealth } from './internal/util'

type OwnProps = NestedId & TagFilterInjectedProps

interface ConnectProps {
  nodes: Node | null
  nodeIsLoading: boolean
  containers: Container[]
}

type NodeDetailTableProps = OwnProps & ConnectProps

class NodeDetailTable extends React.Component<NodeDetailTableProps> {
  render() {
    const { nodes, tag, containers } = this.props

    if (!nodes) return null

    return (
      <section id="node-detail" className="entity-explorer-container-none">
        <div className="entity-explorer-table">
          <div className="entity-explorer-group-header">
            <Header
              title={nodes.name}
              subTitle={nodes.cluster}
              metaTitle="Containers"
              total={nodes.containers.length}
              unhealthy={totalByHealth(nodes.containers, Health.UNHEALTHY)}
              failing={totalByHealth(nodes.containers, Health.FAILING)}
            />
          </div>
          <div className="entity-explorer-entities">
            {containers.map((c, i) => (
              <Tooltip
                content={c.name}
                className={`entity-explorer-entity ${unfilterableClass(
                  tag && !c.tags.includes(tag)
                )}`}
                key={i}
              >
                <Link to={containerUrl(c)} className="content">
                  {c.tags.length === 0 ? (
                    <span className="tag-icon untagged">
                      <Icon iconName={IconClasses.CROSS} className="icon" />
                    </span>
                  ) : (
                    c.tags.map((t, k) => (
                      <span className="tag-icon" key={k}>
                        <Icon key={k} iconName={tagIcon(t)} className="icon" />
                      </span>
                    ))
                  )}
                  <HealthIndicator health={c.health} />
                </Link>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

const connected = connect(() => {
  const getNode = makeGetNode()
  const getContainers = makeGetContainersByNode()

  return (state: State, props: OwnProps) => {
    const filterParams = { node: props.id, ...props }

    return {
      containers: getContainers(state, filterParams),
      nodes: getNode(state, props),
      nodeIsLoading: getNodeIsLoading(state, props),
    }
  }
}, {})(NodeDetailTable)

export default withTagFilters()(connected)
