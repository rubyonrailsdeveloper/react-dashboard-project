import { Icon, Tag, Tooltip } from '@blueprintjs/core'
import capitalize from 'lodash-es/capitalize'
import truncate from 'lodash-es/truncate'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import withTagFilters from 'src/components/TagPanel/withTagFilters'
import { TagFilterInjectedProps } from 'src/components/TagPanel/withTagFilters'
import { Icons, tagIcon } from 'src/constants'
import { nodeUrl } from 'src/routes'
import { Cluster } from 'src/store/cluster/cluster-model'
import { getClusterIsLoading, makeGetCluster } from 'src/store/cluster/cluster-reducers'
import { Health, NestedId } from 'src/store/constants'
import { triggerRequestNodesByCluster } from 'src/store/node/node-actions'
import { Node } from 'src/store/node/node-model'
import { getNodesByClusterIsLoading, makeGetNodesByCluster } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'
import { unfilterableClass } from 'src/util/classes'
import Header from './internal/Header'
import { totalByHealth } from './internal/util'

type OwnProps = NestedId & TagFilterInjectedProps

interface ConnectedProps {
  cluster: Cluster
  clusterIsLoading: boolean
  nodes: Node[]
  nodeListIsLoading: boolean
  triggerRequestNodesByCluster: typeof triggerRequestNodesByCluster
}

type ClusterDetailTableProps = OwnProps & ConnectedProps

class ClusterDetailTable extends React.Component<ClusterDetailTableProps> {
  fetchNodes() {
    this.props.triggerRequestNodesByCluster({ cluster: this.props.id })
  }

  componentDidMount() {
    this.fetchNodes()
  }

  render() {
    const { cluster, nodes, tag } = this.props

    if (!cluster || !nodes) return null

    return (
      <section id="cluster-detail" className="entity-explorer-container-none">
        <div className="entity-explorer-table">
          <Header
            title={cluster.name}
            metaTitle="Nodes"
            total={nodes.length}
            unhealthy={totalByHealth(nodes, Health.UNHEALTHY)}
            failing={totalByHealth(nodes, Health.FAILING)}
          />
          <div className="entity-explorer-entities">
            {nodes.map((n, i) => (
              <div
                className={`entity-explorer-entity ${unfilterableClass(
                  tag && !n.tags.includes(tag)
                )}`}
                key={i}
              >
                <Link to={nodeUrl(n)} className="content">
                  <span className="label">
                    <Icon iconName={Icons.NODE} className="icon" />
                    <span className="name">{truncate(n.name, { length: 50 })}</span>
                  </span>
                  <span className="details">
                    {n.tags.map((t, k) => (
                      <Tooltip key={k} content={capitalize(t)}>
                        <Tag>
                          <Icon iconName={tagIcon(t)} className="icon" />
                        </Tag>
                      </Tooltip>
                    ))}
                    <HealthIndicator health={n.health} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

const connected = connect(
  () => {
    const getCluster = makeGetCluster()
    const getNodes = makeGetNodesByCluster()

    return (state: State, props: OwnProps) => {
      const filterParams = { cluster: props.id, tag: props.tag }

      return {
        cluster: getCluster(state, props),
        clusterIsLoading: getClusterIsLoading(state, props),
        nodes: getNodes(state, filterParams),
        nodeListIsLoading: getNodesByClusterIsLoading(state, filterParams),
      }
    }
  },
  { triggerRequestNodesByCluster }
)(ClusterDetailTable)

export default withTagFilters()(connected)
