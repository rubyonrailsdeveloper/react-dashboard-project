import * as React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import ContainerDetailHeader from 'src/components/ContainerGrid/internal/ContainerDetailHeader'
import ContainerGridPanel, {
  ContainerDetailRenderer,
} from 'src/components/ContainerGrid/internal/ContainerGridPanel'
import PipelineContainerDetail from 'src/components/ContainerGrid/internal/PipelineContainerDetail'
import { ContainerLike } from 'src/components/ContainerGrid/internal/types'
import withPhysicalPlanFilters, {
  PhysicalPlanFiltersInjectedProps,
} from 'src/components/Pipeline/withPhysicalPlanFilters'
import { SortOrder } from 'src/constants'
import {
  customGetPPlanContainersFiltered,
  makeGetPPlanContainersSorted,
} from 'src/store/physical-plan/physical-plan-reducers'
import {
  PhysicalPlanContainer,
  PhysicalPlanContainerFields,
  PhysicalPlanFilter,
} from 'src/store/physical-plan/physical-plan-views'
import { State } from 'src/store/root-reducer'

interface OwnProps extends PhysicalPlanFiltersInjectedProps {
  pipelineId: string
}

interface ConnectProps {
  containers: PhysicalPlanContainer[] | null
  highlightedContainers: string[]
}

type PipelineContainerPanelProps = OwnProps & ConnectProps

class PipelineContainerPanel extends React.Component<PipelineContainerPanelProps> {
  renderContainerDetailHeader: ContainerDetailRenderer = ({ container }) => {
    return (
      <ContainerDetailHeader
        container={container}
        allContainers={this.props.containers!}
        onBackClick={this.props.clearPhysicalPlanFilters}
      />
    )
  }

  renderContainerDetail: ContainerDetailRenderer = ({ container }) => {
    return (
      <PipelineContainerDetail
        pipelineId={this.props.pipelineId}
        container={container as PhysicalPlanContainer}
      />
    )
  }

  handleContainerClick = (container: ContainerLike) => {
    this.props.setPhysicalPlanFilters(PhysicalPlanFilter.CONTAINER, container.id)
  }

  render() {
    const { containers, highlightedContainers, filterType, filterValue } = this.props

    return (
      containers && (
        <ContainerGridPanel
          containers={containers}
          filterType={filterType}
          filterValue={filterValue}
          detailOn={
            (filterType === PhysicalPlanFilter.CONTAINER ||
              filterType === PhysicalPlanFilter.INSTANCE) &&
            !!filterValue
          }
          highlightedContainers={highlightedContainers}
          containerDetailHeader={this.renderContainerDetailHeader}
          containerDetail={this.renderContainerDetail}
          onContainerClick={this.handleContainerClick}
        />
      )
    )
  }
}

const connected = connect(() => {
  const getContainers = makeGetPPlanContainersSorted()
  const getFilteredContainers = createSelector(
    customGetPPlanContainersFiltered(getContainers),
    containers => containers && containers.map(c => c.id)
  )

  return (state: State, { pipelineId: id, ...props }: OwnProps) => {
    const params = {
      id,
      ...props,
      iterator: PhysicalPlanContainerFields.health.sortIterator,
      order: SortOrder.DESC,
    }

    return {
      containers: getContainers(state, params),
      highlightedContainers: getFilteredContainers(state, params),
    }
  }
})(PipelineContainerPanel)

export default withPhysicalPlanFilters()(connected)
