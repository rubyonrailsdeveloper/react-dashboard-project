import { Icon, IconName, Tooltip } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import { Icons } from 'src/constants'
import { EntityParams, pipelineUrl, topicUrl } from 'src/routes'
import { Health, NestedId, RelatedEntity } from 'src/store/constants'
import { Namespace } from 'src/store/namespace/namespace-model'
import { getNamespaceIsLoading, makeGetNamespace } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'
import Header, { HeaderProps } from './internal/Header'
import { totalByHealth } from './internal/util'

type EntityGroupProps = HeaderProps & {
  entities: RelatedEntity[]
  iconName: IconName
  urlFn: (id: EntityParams) => string
}

interface OwnProps extends NestedId, ClusterFiltersInjectedProps {}

interface ConnectedProps {
  namespace: Namespace | null
  namespaceIsLoading: boolean
}

type NamespaceDetailTableProps = OwnProps & ConnectedProps

const EntityGroup: React.SFC<EntityGroupProps> = ({
  title,
  entities,
  iconName,
  total,
  failing,
  unhealthy,
  urlFn,
}) => {
  return (
    <div className="entity-group">
      <Header title={title} total={total} failing={failing} unhealthy={unhealthy} />
      <div className="entity-explorer-entities">
        {entities.map((e, i) => (
          <Tooltip content={e.id} className="entity-explorer-entity" key={e.id}>
            <Link to={urlFn(e)} className="content">
              <Icon iconName={iconName} />
              <HealthIndicator health={e.health} labeled={false} />
            </Link>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

const NamespaceDetailTable: React.SFC<NamespaceDetailTableProps> = ({ namespace }) => {
  if (!namespace) return null

  return (
    <section id="namespace-detail" className="entity-explorer-container-none">
      <div className="entity-explorer-table">
        <div className="header-container">
          <Header title={namespace.name} subTitle={namespace.group} />
        </div>
        <footer>
          {namespace.pipelines.length > 0 && (
            <EntityGroup
              title="Pipelines"
              urlFn={pipelineUrl}
              entities={namespace.pipelines}
              iconName={Icons.PIPELINE}
              total={namespace.pipelines.length}
              unhealthy={totalByHealth(namespace.pipelines, Health.UNHEALTHY)}
              failing={totalByHealth(namespace.pipelines, Health.FAILING)}
            />
          )}
          {namespace.topics.length > 0 && (
            <EntityGroup
              title="Topics"
              urlFn={topicUrl}
              entities={namespace.topics}
              iconName={Icons.TOPIC}
              total={namespace.topics.length}
              unhealthy={totalByHealth(namespace.topics, Health.UNHEALTHY)}
              failing={totalByHealth(namespace.topics, Health.FAILING)}
            />
          )}
        </footer>
      </div>
    </section>
  )
}

const connected = connect(() => {
  const getNamespace = makeGetNamespace()

  return (state: State, props: OwnProps) => {
    return {
      namespace: getNamespace(state, props),
      namespaceIsLoading: getNamespaceIsLoading(state, props),
    }
  }
})(NamespaceDetailTable)

export default withClusterFilters()(connected)
