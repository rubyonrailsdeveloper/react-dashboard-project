import classes from 'classnames'
import * as React from 'react'
import Transition from 'react-transition-group/Transition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import { ContainerEventHandler } from 'src/components/ContainerGrid/internal/ContainerGridItem'
import ContainerGridWidget, {
  ContainerGridWidgetProps,
} from 'src/components/ContainerGrid/internal/ContainerGridWidget'
import { ContainerLike } from 'src/components/ContainerGrid/internal/types'
import Panel from 'src/components/Panel/Panel'
import { TransitionDuration } from 'src/constants'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'

export interface ContainerGridPanelProps {
  className?: string
  containers: ContainerGridWidgetProps['containers']
  highlightedContainers: ContainerGridWidgetProps['highlightedContainers']
  detailOn: boolean
  containerDetailHeader: ContainerDetailRenderer
  containerDetail: ContainerDetailRenderer
  onContainerClick: ContainerEventHandler
  filterType: PhysicalPlanFilter
  filterValue: string
}

export type ContainerDetailRenderer = (args: { container: ContainerLike }) => React.ReactNode

const ContainerGridPanelHeader = ({ containers }: { containers: ContainerLike[] }) => {
  const totalInstances = containers.reduce((acc: number, curr: ContainerLike) => (acc + curr.instances.length),  0)
  return (
    <div className="container-grid-panel-header">
      <span>{containers.length} Containers</span>
      <span>{totalInstances} Instances</span>
    </div>
  )
}

class ContainerGridPanel extends React.Component<ContainerGridPanelProps> {
  render() {
    const {
      containers,
      className,
      highlightedContainers,
      containerDetailHeader,
      containerDetail,
      onContainerClick,
      detailOn,
      filterType,
      filterValue,
    } = this.props

    const highlighted = detailOn ? containers.find(c => c.id === highlightedContainers[0]) : null

    return (
      <Panel
        className={classes('container-grid-panel', className)}
        header={
          highlighted ? (
            containerDetailHeader({ container: highlighted })
          ) : (
            <ContainerGridPanelHeader containers={containers} />
          )
        }
      >
        <ContainerGridWidget
          containers={containers}
          highlightedContainers={highlightedContainers}
          onContainerClick={onContainerClick}
          filterType={filterType}
          filterValue={filterValue} />
        <TransitionGroup>
          {highlighted && (
            <Transition key={0} timeout={TransitionDuration.LG}>
              {(state: string) => (
                <div className={`container-grid-panel-detail is-${state}`}>
                  {containerDetail({ container: highlighted })}
                </div>
              )}
            </Transition>
          )}
        </TransitionGroup>
      </Panel>
    )
  }
}

export default ContainerGridPanel
