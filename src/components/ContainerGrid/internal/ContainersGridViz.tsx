import * as React from 'react'
import ContainerGridItem, {
  ContainerEventHandler,
} from 'src/components/ContainerGrid/internal/ContainerGridItem'
import {
  SquareGridLayout,
  SquarePosition,
} from 'src/components/ContainerGrid/internal/square-grid-layout'
import { ContainerLike } from 'src/components/ContainerGrid/internal/types'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'

export interface ContainersGridVizProps {
  containers: ContainerLike[]
  filterType: PhysicalPlanFilter
  filterValue: string
  highlightedContainers: string[]
  layout: SquarePosition[]
  childLayoutBuilder: SquareGridLayout
  childPadding: number
  onContainerClick: ContainerEventHandler
}

export class ContainersGridViz extends React.PureComponent<ContainersGridVizProps> {
  render() {
    const {
      layout,
      containers,
      filterType,
      filterValue,
      childPadding,
      childLayoutBuilder,
      highlightedContainers,
      onContainerClick,
    } = this.props

    const scale = 0.9
    const side = layout.length ? layout[0].side : 0
    const center = -(side / 2) * (scale - 1)

    return layout.map((pos, i) => {
      const container = containers[i]
      return (
        <ContainerGridItem
          key={container.id}
          onClick={onContainerClick}
          container={container}
          filterType={filterType}
          filterValue={filterValue}
          isHighlighted={highlightedContainers.includes(container.id)}
          padding={childPadding}
          layoutBuilder={childLayoutBuilder}
          width={pos.side}
          height={pos.side}
          transform={`translate(${pos.x + center}, ${pos.y + center}) scale(${scale}) `}
        />
      )
    })
  }
}
