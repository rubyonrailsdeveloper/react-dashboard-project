import { Icon, IconClasses, Tooltip } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
import { NamespaceCreate } from 'src/components/Operations/NamespaceModify'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import { Icons } from 'src/constants'
import { namespaceUrl } from 'src/routes'
import { Health, NestedId } from 'src/store/constants'
import { Group } from 'src/store/group/group-model'
import { getGroupIsLoading, makeGetGroup } from 'src/store/group/group-reducers'
import { State } from 'src/store/root-reducer'
import Header from './internal/Header'
import { totalByHealth } from './internal/util'

interface OwnProps extends NestedId, ClusterFiltersInjectedProps {}

interface ConnectProps extends ClusterFiltersInjectedProps {
  group: Group | null
  groupIsLoading: boolean
}

type GroupDetailProps = OwnProps & ConnectProps

const GroupDetailTable: React.SFC<GroupDetailProps> = ({ cluster, group }) => {
  if (!group) return null

  const namespaces = cluster
    ? group.namespaces.filter(n => n.clusters.includes(cluster))
    : group.namespaces

  return (
    <section id="group-detail" className="entity-explorer-container-none">
      <div className="entity-explorer-table">
        <Header
          title={group.name}
          total={group.namespaces.length}
          metaTitle="Namespaces"
          unhealthy={totalByHealth(group.namespaces, Health.UNHEALTHY)}
          failing={totalByHealth(group.namespaces, Health.FAILING)}
        />
        <div className="entity-explorer-entities">
          {namespaces.map((n, i) => (
            <Tooltip content={n.id} className="entity-explorer-entity" key={i}>
              <Link to={namespaceUrl(n)} className="content">
                <span className="label">
                  <Icon iconName={Icons.NAMESPACE} className="icon" />
                  <span className="name">{n.id}</span>
                </span>
                <HealthIndicator health={n.health} />
              </Link>
            </Tooltip>
          ))}
          <div className="entity-explorer-entity entity-explorer-create-entity">
            <NamespaceCreate parentId={group.id}>
              {({ onClick }) => (
                <div className="content" onClick={onClick}>
                  <span className="label">
                    <Icon iconName={IconClasses.PLUS} className="icon" />
                    <span className="name">Create namespace</span>
                  </span>
                </div>
              )}
            </NamespaceCreate>
          </div>
        </div>
      </div>
    </section>
  )
}

const connected = connect(() => {
  const getGroup = makeGetGroup()

  return (state: State, props: OwnProps) => {
    return {
      group: getGroup(state, props),
      groupIsLoading: getGroupIsLoading(state, props),
    }
  }
})(GroupDetailTable)

export default withClusterFilters()(connected)
