import { Icon } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import { Icons } from 'src/constants'
import { Health, NestedId } from 'src/store/constants'
import { Container } from 'src/store/container/container-model'
import { getContainerIsLoading, makeGetContainer } from 'src/store/container/container-reducers'
import { State } from 'src/store/root-reducer'
import Header from './internal/Header'
import { totalByHealth } from './internal/util'

type OwnProps = NestedId

interface ConnectProps {
  container: Container | null
  containerIsLoading: boolean
}

type ContainerDetailProps = OwnProps & ConnectProps

const ContainerDetailTable: React.SFC<ContainerDetailProps> = ({ container }) => {
  if (!container) return null

  return (
    <section id="container-detail" className="entity-explorer-container-none">
      <div className="entity-explorer-table">
        <div className="entity-explorer-group-header">
          <Header
            title={container.name}
            subTitle={container.cluster}
            metaTitle="Containers"
            total={container.processes && container.processes.length}
            unhealthy={container.processes && totalByHealth(container.processes, Health.UNHEALTHY)}
            failing={container.processes && totalByHealth(container.processes, Health.FAILING)}
          />
        </div>
        <div className="entity-explorer-entities">
          {container.processes &&
            container.processes.map((p, i) => (
              <div className="entity-explorer-entity" key={i}>
                <div className="content">
                  <span className="label">
                    <Icon iconName={Icons.PROCESS} className="icon" />
                    <span className="name">{p.name || p.id}</span>
                  </span>
                  <HealthIndicator health={p.health} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default connect(() => {
  const getContainer = makeGetContainer()

  return (state: State, props: OwnProps) => {
    return {
      container: getContainer(state, props),
      containerIsLoading: getContainerIsLoading(state, props),
    }
  }
}, {})(ContainerDetailTable)
